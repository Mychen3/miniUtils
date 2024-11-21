import { BrowserWindow, IpcMainEvent } from 'electron';

export const windowClose = (event: IpcMainEvent) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
};
