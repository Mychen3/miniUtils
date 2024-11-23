import { BrowserWindow, IpcMainEvent } from 'electron';

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
