import { BrowserWindow, IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import TimedQueue, { QueueItem } from '../workr/TimedQueue.ts';
import { IpcKey } from './ipcKey.ts';

export const windowClose = (event: IpcMainEvent) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
};

export const windowHide = (event: IpcMainEvent) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.hide();
};

export const windowMinimize = (event: IpcMainEvent) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
};

export const changeWindowSize = (event: IpcMainEvent, isMax: boolean) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) isMax ? win.unmaximize() : win.maximize();
};

export const setWindowPin = (event: IpcMainEvent, isPin: boolean) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.setAlwaysOnTop(isPin);
};

// 添加定时任务
export const addTimedQueue = (event: IpcMainEvent, target: Omit<QueueItem, 'callback'>) => {
  const timedQueue = TimedQueue.getInstance();
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    timedQueue.add({
      ...target,
      callback: (taskName) => {
        win.webContents.send(IpcKey.onTimedQueueTask, taskName);
      },
    });
  }
};

// 搜索App
export const searchApp = (_event: IpcMainInvokeEvent, keyword: string) => {
  console.log(keyword);
};
