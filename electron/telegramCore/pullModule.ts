import { BrowserWindow, IpcMainInvokeEvent, IpcMainEvent } from 'electron';
import { applayUserStatus, passKey, IErrorType, TgErrorConst, regex } from '../../common/const';
import { IpcKey } from '../ipc/ipcKey';
import { getErrorMessage, getErrorTypeMessage } from '../../common/util';
import { initClient, checkUserRisk } from './index';
import { updateUserStatus, getUsersByIds } from '../db/module/user';
import type { IUserItem } from '../db/module/user';
import { TelegramClient, Api } from 'telegram';

const pullInfo = {
  currentUserIndex: 0,
  currentPullNames: [] as string[],
  currentUser: [] as IUserItem[],
  groupHash: '',
  pullStatus: applayUserStatus.pullWait,
  currentWin: null as BrowserWindow | null,
};

const handleSetUserIndex = () => {
  pullInfo.currentUserIndex =
    pullInfo.currentUserIndex === pullInfo.currentUser.length - 1 ? 0 : pullInfo.currentUserIndex + 1;
};

const clearPullInfo = () => {
  pullInfo.currentUserIndex = 0;
  pullInfo.currentPullNames = [];
  pullInfo.currentUser = [];
  pullInfo.pullStatus = applayUserStatus.pullWait;
  pullInfo.currentWin = null;
  pullInfo.groupHash = '';
};

const nextPull = () => {
  if (pullInfo.currentUser.length === 0 || pullInfo.currentPullNames.length === 0) {
    const message = pullInfo.currentUser.length === 0 ? '没有可使用的账号继续拉取了！' : '全部拉取完成！';
    pullInfo.currentWin?.webContents.send(IpcKey.onPullHandleMessage, {
      type: 'end',
      message,
    });
    clearPullInfo();
    return; // 直接返回
  }

  if (pullInfo.pullStatus === applayUserStatus.pull) {
    // 判断当前账号是第几位如果是最后一个就把下标改为1，如果不是最后一个就加1
    handleSetUserIndex();
    startPull();
  }
  if (pullInfo.pullStatus === applayUserStatus.pullPause) {
    pullInfo.currentWin?.webContents.send(IpcKey.onPullHandleMessage, {
      type: 'stop',
      message: '邀请暂停中',
    });
  }
};

const filterUser = (userPhone: string) => {
  pullInfo.currentUser = pullInfo.currentUser.filter((item) => item.user_phone !== userPhone);
  pullInfo.currentUserIndex = pullInfo.currentUserIndex === 0 ? 0 : pullInfo.currentUserIndex - 1;
};

const startPull = async () => {
  let client: TelegramClient | null = null;
  let pullName: string = '';
  const currentUser = pullInfo.currentUser[pullInfo.currentUserIndex];

  try {
    pullInfo.currentWin?.webContents.send(IpcKey.onPullHandleMessage, { type: 'info', message: '10秒后开始拉取！' });
    await new Promise((resolve) => setTimeout(resolve, 10000));

    pullInfo.currentWin?.webContents.send(IpcKey.onPullHandleMessage, {
      type: 'info',
      message: `正在连接账号+${currentUser.user_phone}`,
    });
    client = await initClient(currentUser.session_id);

    if (!client) {
      filterUser(currentUser.user_phone);
      return nextPull();
    }
    //验证账号风控
    const status = await checkUserRisk(client);

    if (status === passKey.warn) {
      filterUser(currentUser.user_phone);
      await client?.destroy();
      await updateUserStatus(currentUser.user_id, passKey.warn);
      pullInfo.currentWin?.webContents.send(IpcKey.onPullHandleMessage, {
        type: 'error',
        message: `+${currentUser.user_phone},账号风控警告`,
      });
      return nextPull();
    }
    // TODO 加群需要优化
    const isAddGroup = await addGroup(client, pullInfo.groupHash);
    if (!isAddGroup) return nextPull();

    pullName = pullInfo.currentPullNames.pop()!;
    const result = await client.invoke(
      new Api.channels.InviteToChannel({
        channel: pullInfo.groupHash,
        users: [pullName],
      }),
    );
    const isSuccess = result.missingInvitees.length === 0;
    pullInfo.currentWin?.webContents.send(IpcKey.onPullHandleMessage, {
      type: isSuccess ? 'success' : 'error',
      message: `${pullName}邀请${isSuccess ? '成功' : `失败${TgErrorConst[result.missingInvitees[0].className]}`}!`,
    });
    await client?.destroy();
    nextPull();
  } catch (error) {
    await client?.destroy();
    const accountError = [IErrorType.PEER_FLOOD]; // 账号错误的list
    const errorType = getErrorTypeMessage(error);
    const isAccountError = accountError.includes(errorType);
    pullInfo.currentWin?.webContents.send(IpcKey.onPullHandleMessage, {
      type: 'error',
      message: `错误：${formatError(error)} 账号：${isAccountError ? `+${currentUser.user_phone}` : pullName}`,
    });
    // 账号频繁就过滤拉人账号
    if (errorType === IErrorType.PEER_FLOOD) filterUser(currentUser.user_phone);
    nextPull();
  }
};

const handleInviteMemberPause = (_event: IpcMainEvent, isStop: boolean) => {
  if (isStop) {
    pullInfo.pullStatus = applayUserStatus.pullPause;
  } else {
    pullInfo.pullStatus = applayUserStatus.pull;
    nextPull();
  }
};

const pullGroup = async (
  _event: IpcMainInvokeEvent,
  params: { pullNames: string; groupId: string; userIds: string },
) => {
  pullInfo.currentWin = BrowserWindow.fromWebContents(_event.sender);
  return new Promise(async (resolve, reject) => {
    if (pullInfo.pullStatus === applayUserStatus.pull) return reject('当前正在拉取中');
    const userList = await getUsersByIds(params.userIds.split(',').map(Number), passKey.pass);
    if (!userList || userList.length === 0) return reject('没有可使用的账号');
    if (pullInfo.pullStatus === applayUserStatus.pullWait) {
      pullInfo.currentUser = userList as IUserItem[];
      pullInfo.currentPullNames = params.pullNames.split(',');
      pullInfo.groupHash = params.groupId.split('/').pop() as string;
      // 开始拉取
      pullInfo.pullStatus = applayUserStatus.pull;
    }
    resolve(true);
    startPull();
  });
};

const addGroup = async (client: TelegramClient, groupId: string) => {
  try {
    await client?.invoke(new Api.channels.JoinChannel({ channel: groupId }));
    return true;
  } catch (error) {
    if (getErrorTypeMessage(error) === IErrorType.USER_ALREADY_PARTICIPANT) return true;
    const message = getErrorMessage(error);
    pullInfo.currentWin?.webContents.send(IpcKey.onPullHandleMessage, {
      type: 'error',
      message: `加群失败：${message}`,
    });
    return false;
  }
};

const formatError = (error: unknown) => {
  const message = getErrorMessage(error);
  const match = regex.isUserExist.exec(message);
  if (match) return `用户不存在：${match[1]}`;
  return message;
};

export { pullInfo, clearPullInfo, pullGroup, handleInviteMemberPause };
