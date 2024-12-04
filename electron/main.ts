import { app, BrowserWindow, ipcMain, IpcMainEvent, IpcMainInvokeEvent, globalShortcut } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { IpcKey } from './ipc/ipcKey.ts';
import { initDb, closeDb } from './db/database';
import {
  changeWindowSize,
  setWindowPin,
  windowClose,
  windowHide,
  windowMinimize,
  addTimedQueue,
} from './ipc/mainIpc.ts';
import { systemKey } from '../common/const';
import { createTray, destroyTray } from './tray';
// import TimedQueue from './workr/TimedQueue.ts';
import { handleLogin, refreshUserStatus, disconnectAll } from './telegramCore';
import { deleteUser, getPageUsers } from './db/module/user.ts';
import { addRiskDict, getRiskDictList, deleteRiskDict } from './db/module/risk.ts';
import { registerKeyboard } from './global/keyboard.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let win: BrowserWindow | null;

// let timedQueue: TimedQueue;
function createWindow() {
  const isMac = process.platform === systemKey.mac;
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'logo.png'),
    frame: isMac,
    titleBarStyle: isMac ? 'hidden' : 'default',
    height: 660,
    width: 830,
    minHeight: 660,
    minWidth: 830,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true, // 启用上下文隔离
    },
    show: false,
  });
  win.on('ready-to-show', () => {
    win?.show(); // 初始化后再显示
    // timedQueue = new TimedQueue(3000);
  });
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });
  VITE_DEV_SERVER_URL ? win.loadURL(VITE_DEV_SERVER_URL) : win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  app.isPackaged || win.webContents.openDevTools();
  const ipcMainMap = new Map<IpcKey, (event: IpcMainEvent, ...args: any[]) => void>([
    [IpcKey.close, windowClose],
    [IpcKey.windowHide, windowHide],
    [IpcKey.windowMinimize, windowMinimize],
    [IpcKey.changeWindowSize, changeWindowSize],
    [IpcKey.setWindowPin, setWindowPin],
    [IpcKey.addTimedQueue, addTimedQueue],
    [IpcKey.loginTg, handleLogin],
  ]);

  const ipcMainHandMap = new Map<IpcKey, (event: IpcMainInvokeEvent, ...args: any[]) => void>([
    [IpcKey.getPageUsers, getPageUsers],
    [IpcKey.deleteUser, deleteUser],
    [IpcKey.refreshUserStatus, refreshUserStatus],
    [IpcKey.addRiskDict, addRiskDict],
    [IpcKey.getRiskDictList, getRiskDictList],
    [IpcKey.deleteRiskDict, deleteRiskDict],
  ]);
  ipcMainMap.forEach((value, key) => ipcMain.on(key, value));
  ipcMainHandMap.forEach((value, key) => ipcMain.handle(key, value));

  win.on('closed', () => {
    ipcMainMap.forEach((_value, key) => ipcMain.removeAllListeners(key));
    ipcMainHandMap.forEach((_value, key) => ipcMain.removeHandler(key));
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('quit', () => {
  destroyTray();
});
app.on('before-quit', () => {
  closeDb();
  disconnectAll();
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  createTray(path.join(process.env.VITE_PUBLIC, 'logo.png'));
  createWindow();
  initDb(path.join(app.getPath('userData'), 'database.db'));
  if (app.isPackaged) registerKeyboard();
});
