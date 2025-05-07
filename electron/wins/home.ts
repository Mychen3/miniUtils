import { app, BrowserWindow, ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { IpcKey } from '../ipc/ipcKey.ts';
import {
  changeWindowSize,
  setWindowPin,
  windowClose,
  windowHide,
  windowMinimize,
  addTimedQueue,
} from '../ipc/mainIpc.ts';
import { systemKey } from '../../common/const';
import { handleLogin, refreshUserStatus, getMachineId } from '../telegramCore';
import { pullGroup, handleInviteMemberPause, batchExitGroup } from '../telegramCore/pullModule';
import { deleteUser, getPageUsers } from '../db/module/user.ts';
import { addRiskDict, getRiskDictList, deleteRiskDict } from '../db/module/risk.ts';
import {
  handleFlagMemberTell,
  handleFlagMemberTellStop,
  exportFlagMember,
  getGroupMemberList,
} from '../telegramCore/flagModule.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let win: BrowserWindow | null;

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

  // Set CSP headers to allow connections to auth server

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
    [IpcKey.handleInviteMemberPause, handleInviteMemberPause],
    [IpcKey.handleFlagMemberTell, handleFlagMemberTell],
    [IpcKey.handleFlagMemberTellStop, handleFlagMemberTellStop],
    [IpcKey.exportFlagMember, exportFlagMember],
    [IpcKey.getGroupMemberList, getGroupMemberList],
    [IpcKey.batchExitGroup, batchExitGroup],
  ]);

  const ipcMainHandMap = new Map<IpcKey, (event: IpcMainInvokeEvent, ...args: any[]) => void>([
    [IpcKey.getPageUsers, getPageUsers],
    [IpcKey.deleteUser, deleteUser],
    [IpcKey.refreshUserStatus, refreshUserStatus],
    [IpcKey.addRiskDict, addRiskDict],
    [IpcKey.getRiskDictList, getRiskDictList],
    [IpcKey.deleteRiskDict, deleteRiskDict],
    [IpcKey.inviteUser, pullGroup],
    [IpcKey.getMachineId, getMachineId],
  ]);

  ipcMainMap.forEach((value, key) => ipcMain.on(key, value));
  ipcMainHandMap.forEach((value, key) => ipcMain.handle(key, value));

  win.on('closed', () => {
    ipcMainMap.forEach((_value, key) => ipcMain.removeAllListeners(key));
    ipcMainHandMap.forEach((_value, key) => ipcMain.removeHandler(key));
  });
}

export { createWindow };
