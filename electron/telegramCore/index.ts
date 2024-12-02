import { ipcMain, BrowserWindow, IpcMainEvent } from 'electron';
import { TelegramClient, sessions } from 'telegram';
import { IpcKey } from '../ipc/ipcKey';
import { TgErrorConst } from '../../common/const';
const stringSession = new sessions.StringSession('');
let client: TelegramClient;

const initTg = async () => {
  const apiId = Number(import.meta.env.VITE_TG_API_ID);
  const apiHash = import.meta.env.VITE_TG_API_HASH;
  client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  return client;
};

const loginTg = async (event: IpcMainEvent, params: { username: string; password?: string }) => {
  if (!client) client = await initTg();
  await client.start({
    phoneNumber: params.username,
    phoneCode: async () => {
      const result: string = await new Promise((resolve) => {
        ipcMain.once(IpcKey.confirmPhoneCode, (_event: IpcMainEvent, code: string) => resolve(code));
        const win = BrowserWindow.fromWebContents(event.sender);
        win?.webContents.send(IpcKey.onConfirmPhoneCodeSend);
      });
      return result;
    },
    password: undefined,
    onError: (error) => {
      const message = TgErrorConst[error.message];
      const win = BrowserWindow.fromWebContents(event.sender);
      win?.webContents.send(IpcKey.onToastMessage, message, 'error');
    },
  });
  client.session.save();
};

export { initTg, loginTg };
