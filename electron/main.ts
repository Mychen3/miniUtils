import { app, BrowserWindow, globalShortcut } from 'electron';
import path from 'node:path';
import { closeDb } from './db/database';
import { authConfig } from '../common/const';
import { createTray, destroyTray } from './tray';
import { registerKeyboard } from './global/keyboard.ts';
import { createWindow } from './wins/home.ts';
import { machineIdSync } from 'node-machine-id';
import axios from 'axios';
import { enterMain } from './telegramCore';
import { initDb } from './db/database';
import { activateWin } from './wins/activation.ts';

let win: BrowserWindow | null;

// 单例模式 (暂时允许多开)
// const isSingleInstance = app.requestSingleInstanceLock();

// if (!isSingleInstance) app.quit();

app.on('second-instance', (_, _commandLine, _workingDirectory) => {
  if (win) {
    if (win.isMinimized()) win.restore();
    win.focus();
  }
});

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

app.whenReady().then(async () => {
  try {
    const id = machineIdSync(true);
    const url = `${authConfig.url}/software/createSoftwareMachine`;
    await axios.post(url, {
      machineId: id,
    });
    initDb(path.join(app.getPath('userData'), 'database.db'));
  } catch (error) {
    activateWin();
  } finally {
    createTray(path.join(process.env.VITE_PUBLIC, 'logo.png'));
    const res = await enterMain();
    res ? createWindow() : activateWin();
    if (app.isPackaged) registerKeyboard();
  }
});
