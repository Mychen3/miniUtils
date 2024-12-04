import { BrowserWindow, ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import { TelegramClient, sessions, Api } from 'telegram';
import { IpcKey } from '../ipc/ipcKey';
import { passKey, TgErrorConst, tgLoginHandle } from '../../common/const';
import { getUserById, insertUser, updateUserStatus } from '../db/module/user';

const apiId = Number(import.meta.env.VITE_TG_API_ID);
const apiHash = import.meta.env.VITE_TG_API_HASH;

const isString = ['Berita baik', 'Good news'];
const warnString = ['Saya khuatir', 'I’m afraid some'];
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

    // // 如果需要登录
    // if (!client.authorized) {
    //   // 处理登录逻辑
    //   await this.handleLogin(client);
    // }

    return client;
  } catch (error) {
    // 如果连接失败，确保断开连接并清理
    await client.destroy();
    throw error;
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
      // 判断字符串前缀 是否包含在 isString 或 warnString 中
      if ([...isString, ...warnString].some((item) => message.startsWith(item))) {
        // 判断是否有警告字符串
        if (warnString.some((item) => message.includes(item))) return resolve(passKey.warn);
        return resolve(passKey.pass);
      }
      reject('账户存在风险问题！无法登录');
    } catch (error) {
      reject(error);
    }
  });

const refreshUserStatus = async (_event: IpcMainInvokeEvent, user_id: number) => {
  try {
    const userItem = await getUserById(user_id);
    const client = clients.get(userItem.user_phone) || (await initClient(userItem.session_id));
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

// const pullGroup = async () => {
//   try {
//     const entity = await client.getEntity('fyikbf1145');
//     const list = await client.getDialogs();
//     const dialog = list.find((item) => item.title === 'test');
//     console.log(dialog);
//     const result = await client.invoke(
//       new Api.messages.AddChatUser({
//         chatId: dialog?.id,
//         userId: '@RadomilMendoza',
//         fwdLimit: 10,
//       }),
//     );
//     const result = await client.invoke(
//       new Api.channels.InviteToChannel({
//         channel: '@fyikbf1145',
//         users: [],
//       }),
//     );
//     console.log(result);
//   } catch (error) {
//     console.log(error);
//   }
// };

export { handleLogin, clients, refreshUserStatus, disconnectAll };
