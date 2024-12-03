import { BrowserWindow, IpcMainEvent } from 'electron';
import { TelegramClient, sessions, Api } from 'telegram';
import { IpcKey } from '../ipc/ipcKey';
// import { TgErrorConst } from '../../common/const';
// import { ipcMain } from 'electron';

const stringSession = new sessions.StringSession(
  '1BQANOTEuMTA4LjU2LjE3OQG7kOt8FyIUtYGB9Y9P4q4NenBFO9ibIVDpyLgGitXcrpR3xsU+U+Iqw31DRQOWah1bXIKurSa0b7mLBSKBwDoZQz0zcyHLA5Omdc1IPSOwveZlzk5qEN9p+qiC7O+ag/OoQTJ5wlEkI07jdN9ck8a0WE8mXyh7rmh/rSe7s3hMQOca33qZ8KI0uCafoY+HuFxzwke3LggJGVHvUolvVYfTSD+Z4ucohzkPVdl2K+BUdFqqOSeGSwqQqbviR7zY0kPuO8oLvXYktLK2SxUx8x9dFcWuddvQhKXuKDuyP6/2embLsiWqrW5NnZmARlpKJmfop/hkU3FE02ZB+g9C7YjULQ==',
);
let client: TelegramClient;

const initTg = async () => {
  const apiId = Number(import.meta.env.VITE_TG_API_ID);
  const apiHash = import.meta.env.VITE_TG_API_HASH;
  client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });
  return client;
};

const sendBotQueryStatus = async () => {
  try {
    const result = await client.invoke(
      new Api.messages.SendMessage({
        peer: '@SpamBot',
        message: '/start',
        noWebpage: true,
        noforwards: true,
        clearDraft: false,
      }),
    );

    setTimeout(async () => {
      const message = await client.getMessages('@SpamBot', { limit: 1 });
      console.log(message);
    }, 500);
  } catch (error) {
    console.log(error);
  }
};

const pullGroup = async () => {
  try {
    // const entity = await client.getEntity('fyikbf1145');
    // const list = await client.getDialogs();
    // const dialog = list.find((item) => item.title === 'test');
    // console.log(dialog);

    // const result = await client.invoke(
    //   new Api.messages.AddChatUser({
    //     chatId: dialog?.id,
    //     userId: '@RadomilMendoza',
    //     fwdLimit: 10,
    //   }),
    // );
    const result = await client.invoke(
      new Api.channels.InviteToChannel({
        channel: '@fyikbf1145',
        users: [],
      }),
    );
    console.log(result);
  } catch (error) {
    console.log(error);
  }
};

const loginTg = async (event: IpcMainEvent, params: { username: string; password: string }) => {
  if (!client) client = await initTg();

  try {
    // await client.start({
    //   phoneNumber: params.username,
    //   phoneCode: async () => {
    //     const result: string = await new Promise((resolve) => {
    //       ipcMain.once(IpcKey.confirmPhoneCode, (_event: IpcMainEvent, code: string) => resolve(code));
    //       const win = BrowserWindow.fromWebContents(event.sender);
    //       win?.webContents.send(IpcKey.onTgLoginHandle);
    //     });
    //     console.log(result);
    //     return result;
    //   },
    //   password: params.password ? () => Promise.resolve(params.password) : undefined,
    //   onError: (error) => {
    //     const message = TgErrorConst[error.message];
    //     const win = BrowserWindow.fromWebContents(event.sender);
    //     win?.webContents.send(IpcKey.onToastMessage, message, 'error');
    //   },
    // });
    const key = client.session.save();
    console.log(key);
    await client.connect();
    // 获取用户实体
    // const user = await client.getMe();
    // console.log('User Info:', user);
    // await pullGroup();
    await sendBotQueryStatus();
  } catch (error) {
    const win = BrowserWindow.fromWebContents(event.sender);
    win?.webContents.send(IpcKey.onToastMessage, error, 'error');
  }
};

export { initTg, loginTg };
