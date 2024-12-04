import { BrowserWindow, ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import { TelegramClient, sessions, Api } from 'telegram';
import { IpcKey } from '../ipc/ipcKey';
import { applayUserStatus, passKey, TgErrorConst, tgLoginHandle } from '../../common/const';
import { getUserById, insertUser, updateUserStatus, getPageUsers, IUserItem } from '../db/module/user';
import { getRiskDictList } from '../db/module/risk';

const apiId = Number(import.meta.env.VITE_TG_API_ID);
const apiHash = import.meta.env.VITE_TG_API_HASH;

let pullStatus = applayUserStatus.pullWait;
const pullInfo = {
  currentUserIndex: 0,
  currentPullNames: [] as string[],
  currentUser: [] as IUserItem[],
};

const clients: Map<string, TelegramClient> = new Map();

const saveUser = async (key: string, user: Api.User, status: keyof typeof passKey) => {
  await insertUser({
    userName: user.firstName ?? '',
    userStatus: status,
    userPhone: user.phone ?? '',
    userTgId: user.username ?? '',
    sessionId: key,
  });
};

const disconnectAll = async () => {
  for (const client of clients.values()) {
    try {
      await client.destroy();
    } catch (error) {
      console.error('断开连接时出错:', error);
    }
  }
  clients.clear();
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
      reject('账户存在风险问题！无法登录');
    } catch (error) {
      reject(error);
    }
  });

const refreshUserStatus = async (_event: IpcMainInvokeEvent, user_id: number) => {
  try {
    const win = BrowserWindow.fromWebContents(_event.sender);
    const userItem = await getUserById(user_id);
    const client = clients.get(userItem.user_phone) || (await initClient(userItem.session_id));
    if (!client) {
      win?.webContents.send(IpcKey.onToastMessage, '账号存在问题！', 'error');
      return false;
    }
    const status = await checkUserRisk(client);
    if (status !== userItem.user_status) await updateUserStatus(user_id, status);
    if (status === passKey.warn) {
      clients.delete(userItem.user_phone);
      await client?.destroy();
    }
    return true;
  } catch (error) {
    throw error;
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
      phoneCode: async () => {
        const result: string = await new Promise((resolve) => {
          ipcMain.once(IpcKey.confirmPhoneCode, (_event: IpcMainEvent, code: string) => resolve(code));
          win?.webContents.send(IpcKey.onTgLoginHandle, tgLoginHandle.verifyPhoneCode);
        });
        return result;
      },
      onError: (error) => {
        const message = TgErrorConst[error.message];
        win?.webContents.send(IpcKey.onToastMessage, message, 'error');
      },
    });
    const key = client.session.save();
    const status = await checkUserRisk(client);
    const user = await client.getMe();
    await saveUser(key as unknown as string, user, status);
    if (status === passKey.pass && user.phone) {
      clients.set(user.phone, client);
    } else {
      await client?.destroy();
    }
    win?.webContents.send(IpcKey.onTgLoginHandle, tgLoginHandle.loginEnd);
  } catch (error) {
    win?.webContents.send(IpcKey.onTgLoginHandle, tgLoginHandle.loginError);
  }
};

const pullGroup = async (_event: IpcMainEvent, params: { pullNames: string }) => {
  try {
    if (pullStatus === applayUserStatus.pull) return;
    const win = BrowserWindow.fromWebContents(_event.sender);
    const userList = await getPageUsers(_event, { userStatus: passKey.pass, isSession: true });
    if (!userList || userList?.list.length === 0)
      return win?.webContents.send(IpcKey.onToastMessage, '没有可使用的账号', 'error');
    const pullNames = params.pullNames.split(',');

    if (pullStatus === applayUserStatus.pullWait) {
      pullInfo.currentUser = userList.list as IUserItem[];
      pullInfo.currentPullNames = pullNames;
      // 开始拉取
      pullStatus = applayUserStatus.pull;
    }
    while (pullInfo.currentPullNames.length) {
      const removerNames = pullInfo.currentPullNames.splice(-3);
      //当前邀请到第几个账号（邀请的账号，不是被邀账号）
      const currentUser = pullInfo.currentUser[pullInfo.currentUserIndex];
      const client = clients.get(currentUser.user_phone) || (await initClient(currentUser.session_id));
      if (!client) {
        pullInfo.currentUser = pullInfo.currentUser.filter((item) => item.user_id !== currentUser.user_id);
        continue;
      }
      //验证账号风控
      const status = await checkUserRisk(client);
      if (status === passKey.warn) {
        pullInfo.currentUser = pullInfo.currentUser.filter((item) => item.user_id !== currentUser.user_id);
        clients.delete(currentUser.user_phone);
        await client?.destroy();
        continue;
      }
      // 邀请
      const result = await client.invoke(
        new Api.channels.InviteToChannel({
          channel: currentUser.user_phone,
          users: removerNames.map((item) => item),
        }),
      );
      // TODO 邀请结果的推送
    }
  } catch (error) {
    console.log(error);
  }
};

export { handleLogin, clients, refreshUserStatus, disconnectAll };
