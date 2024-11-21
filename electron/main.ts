import { app, BrowserWindow, ipcMain, IpcMainEvent } from 'electron';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { IpcKey } from './ipc/ipcKey.ts';
import { windowClose } from './ipc/mainIpc.ts';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

process.env.APP_ROOT = path.join(__dirname, '..');

export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];
export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron');
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist');
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST;

let win: BrowserWindow | null;
function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'logo.png'),
    frame: false,
    height: 860,
    width: 1440,
    minHeight: 860,
    minWidth: 1440,
    webPreferences: {
      preload: path.join(__dirname, 'preload.mjs'),
      contextIsolation: true, // 启用上下文隔离
    },
  });

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });
  VITE_DEV_SERVER_URL ? win.loadURL(VITE_DEV_SERVER_URL) : win.loadFile(path.join(RENDERER_DIST, 'index.html'));
  app.isPackaged || win.webContents.openDevTools();

  const ipcMainMap = new Map<IpcKey, (event: IpcMainEvent, ...args: Parameters<any>) => void>([
    [IpcKey.close, windowClose],
  ]);
  ipcMainMap.forEach((value, key) => ipcMain.on(key, value));

  win.on('closed', () => {
    ipcMainMap.forEach((_value, key) => ipcMain.removeAllListeners(key));
  });
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(createWindow);
