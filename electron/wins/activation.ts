import { app, BrowserWindow, ipcMain, shell } from 'electron';
import { systemKey } from '../../common/const';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { IpcKey } from '../ipc/ipcKey';
import { getMachineId } from '../telegramCore';
let win: BrowserWindow | null;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
function closeWindow() {
  if (win) {
    win.close();
    win = null;
  }
}

function activateWin() {
  const isMac = process.platform === systemKey.mac;

  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'logo.png'),
    titleBarStyle: isMac ? 'hidden' : 'default',
    height: 330,
    width: 500,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true,
    },
    show: false,
  });

  win.on('ready-to-show', () => {
    win?.show();
  });

  // 完全移除菜单栏
  win.setMenu(null);

  // 加载activate页面
  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(`${process.env.VITE_DEV_SERVER_URL}#/activate`);
    // 开发环境下打开开发者工具
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'), {
      hash: '/activate',
    });
  }

  ipcMain.handle(IpcKey.getMachineId, getMachineId);
  ipcMain.on(IpcKey.buySoftware, () => {
    // 使用tg://协议直接打开Telegram应用并跳转到指定用户
    shell.openExternal('tg://resolve?domain=chatai_0');
    // 如果tg协议打开失败，再尝试打开网页版
    setTimeout(() => {
      shell.openExternal('https://t.me/chatai_0');
    }, 1000);
  });

  ipcMain.on(IpcKey.enterMain, async () => {
    // 重新启动
    app.relaunch();
    app.quit();
  });

  win.on('closed', () => {
    ipcMain.removeHandler(IpcKey.getMachineId);
    ipcMain.removeAllListeners(IpcKey.buySoftware);
    ipcMain.removeAllListeners(IpcKey.enterMain);
  });
}

export { activateWin, closeWindow, win };
