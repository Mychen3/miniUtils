import { BrowserWindow, ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import { TelegramClient, sessions, Api } from 'telegram';
import { IpcKey } from '../ipc/ipcKey';
import { applayUserStatus, passKey, tgLoginHandle, IErrorType, regex, TgErrorConst } from '../../common/const';
import { getUserById, insertUser, updateUserStatus, getPageUsers, IUserItem } from '../db/module/user';
import { getErrorMessage, getErrorTypeMessage } from '../../common/util';
import { getRiskDictList } from '../db/module/risk';

const apiId = Number(import.meta.env.VITE_TG_API_ID);
const apiHash = import.meta.env.VITE_TG_API_HASH;

const pullInfo = {
  currentUserIndex: 0,
  currentPullNames: [] as string[],
  currentUser: [] as IUserItem[],
  groupHash: '',
  pullStatus: applayUserStatus.pullWait,
  currentWin: null as BrowserWindow | null,
};

const saveUser = async (key: string, user: Api.User, status: keyof typeof passKey) => {
  await insertUser({
    userName: user.firstName ?? '',
    userStatus: status,
    userPhone: user.phone ?? '',
    userTgId: user.username ?? '',
    sessionId: key,
  });
};

const clearPullInfo = () => {
  pullInfo.currentUserIndex = 0;
  pullInfo.currentPullNames = [];
  pullInfo.currentUser = [];
  pullInfo.pullStatus = applayUserStatus.pullWait;
  pullInfo.currentWin = null;
  pullInfo.groupHash = '';
};

const initClient = async (session: string) => {
  const client = new TelegramClient(new sessions.StringSession(session), apiId, apiHash, {
    connectionRetries: 5,
  });

  try {
    // 连接是必需的
    await client.connect();

    // 检查连接状态
    if (!client.connected) {
      throw new Error('连接失败');
    }
    return client;
  } catch (error) {
    // 如果连接失败，确保断开连接并清理
    await client.destroy();
    return null;
  }
};
const checkUserRisk = (client: TelegramClient): Promise<keyof typeof passKey> =>
  new Promise(async (resolve, reject) => {
    try {
      await client.invoke(
        new Api.messages.SendMessage({
          peer: '@SpamBot',
          message: '/start',
          noWebpage: true,
          noforwards: true,
          clearDraft: false,
        }),
      );
      await new Promise((resolve) => setTimeout(resolve, 500));
      const messageInfo = await client.getMessages('@SpamBot', { limit: 1 });
      const message = messageInfo[0].message;
      const riskDictList = await getRiskDictList();
      const allRiskList = riskDictList.map((item) => item.risk_value);
      const warnList = riskDictList.filter((item) => item.risk_status === passKey.warn).map((item) => item.risk_value);
      // 判断字符串前缀 是否包含在 isString 或 warnString 中
      if (allRiskList.some((item) => message.startsWith(item))) {
        // 判断是否有警告字符串
        if (warnList.some((item) => message.includes(item))) return resolve(passKey.warn);
        return resolve(passKey.pass);
      }
      reject({ errorMessage: IErrorType.CHECK_USER_RISK });
    } catch (error) {
      reject(error);
    }
  });

const refreshUserStatus = async (_event: IpcMainInvokeEvent, user_id: number) => {
  const win = BrowserWindow.fromWebContents(_event.sender);
  try {
    const userItem = await getUserById(user_id);
    const client = await initClient(userItem.session_id);
    if (!client) {
      win?.webContents.send(IpcKey.onToastMessage, '账号存在问题！', 'error');
      return false;
    }
    const status = await checkUserRisk(client);
    if (status !== userItem.user_status) await updateUserStatus(user_id, status);
    if (status === passKey.warn) await client?.destroy();
    return true;
  } catch (error) {
    win?.webContents.send(IpcKey.onToastMessage, getErrorMessage(error), 'error');
  }
};

const handleLogin = async (_event: IpcMainEvent, params: { username: string; password: string }) => {
  const client = await initClient('');
  const win = BrowserWindow.fromWebContents(_event.sender);
  try {
    if (!client) {
      win?.webContents.send(IpcKey.onToastMessage, '账号存在问题！', 'error');
      return;
    }
    await client.start({
      phoneNumber: params.username,
      phoneCode: async () =>
        await new Promise((resolve) => {
          ipcMain.once(IpcKey.confirmPhoneCode, (_event: IpcMainEvent, code: string) => resolve(code));
          win?.webContents.send(IpcKey.onTgLoginHandle, tgLoginHandle.verifyPhoneCode);
        }),
      password: params.password ? () => Promise.resolve(params.password) : undefined,
      onError: (error) => {
        console.error(error);
        win?.webContents.send(IpcKey.onToastMessage, getErrorMessage(error), 'error');
      },
    });
    const key = client.session.save();
    const status = await checkUserRisk(client);
    const user = await client.getMe();
    await saveUser(key as unknown as string, user, status);
    await client?.destroy();
    win?.webContents.send(IpcKey.onTgLoginHandle, tgLoginHandle.loginEnd);
  } catch (error) {
    await client?.destroy();
    console.error(error);
    win?.webContents.send(IpcKey.onTgLoginHandle, tgLoginHandle.loginError, getErrorMessage(error));
  }
};

const handleSetUserIndex = () => {
  pullInfo.currentUserIndex =
    pullInfo.currentUserIndex === pullInfo.currentUser.length - 1 ? 0 : pullInfo.currentUserIndex + 1;
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
};

const filterUser = (userPhone: string) => {
  pullInfo.currentUser = pullInfo.currentUser.filter((item) => item.user_phone !== userPhone);
  pullInfo.currentUserIndex = pullInfo.currentUserIndex === 0 ? 0 : pullInfo.currentUserIndex - 1;
};

const formatError = (error: unknown) => {
  const message = getErrorMessage(error);
  const match = regex.isUserExist.exec(message);
  if (match) return `用户不存在：${match[1]}`;
  return message;
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

const pullGroup = async (_event: IpcMainInvokeEvent, params: { pullNames: string; groupId: string }) => {
  pullInfo.currentWin = BrowserWindow.fromWebContents(_event.sender);
  return new Promise(async (resolve, reject) => {
    if (pullInfo.pullStatus === applayUserStatus.pull) return reject('当前正在拉取中');
    const userList = await getPageUsers(_event, { userStatus: passKey.pass, isSession: true });
    if (!userList || userList?.list.length === 0) return reject('没有可使用的账号');
    if (pullInfo.pullStatus === applayUserStatus.pullWait) {
      pullInfo.currentUser = userList.list as IUserItem[];
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

export { handleLogin, refreshUserStatus, pullGroup, addGroup };
