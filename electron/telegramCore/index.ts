import { BrowserWindow, ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import { TelegramClient, sessions, Api } from 'telegram';
import { IpcKey } from '../ipc/ipcKey';
import { passKey, tgLoginHandle, IErrorType, apiId, apiHash } from '../../common/const';
import { getUserById, insertUser, updateUserStatus } from '../db/module/user';
import { getErrorMessage } from '../../common/util';
import { getRiskDictList } from '../db/module/risk';

const saveUser = async (key: string, user: Api.User, status: keyof typeof passKey) => {
  await insertUser({
    userName: user.firstName ?? '',
    userStatus: status,
    userPhone: user.phone ?? '',
    userTgId: user.username ?? '',
    sessionId: key,
  });
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

export { handleLogin, refreshUserStatus, initClient, checkUserRisk };
