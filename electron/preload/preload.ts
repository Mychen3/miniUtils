import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IpcKey } from '../ipc/ipcKey.ts';
import type { QueueItem } from '../workr/TimedQueue.ts';

const electronAPI = {
  windowClose: () => ipcRenderer.send(IpcKey.close),
  windowHide: () => ipcRenderer.send(IpcKey.windowHide),
  windowMinimize: () => ipcRenderer.send(IpcKey.windowMinimize),
  changeWindowSize: (isMax: boolean) => ipcRenderer.send(IpcKey.changeWindowSize, isMax),
  setWinPin: (isPin: boolean) => ipcRenderer.send(IpcKey.setWindowPin, isPin),
  addTimedQueue: (target: Omit<QueueItem, 'callback'>) => ipcRenderer.send(IpcKey.addTimedQueue, target),
  onTimedQueueTask: (callback: (event: IpcRendererEvent, taskName: string) => void) =>
    ipcRenderer.on(IpcKey.onTimedQueueTask, callback),
  searchApp: (keyword: string) => ipcRenderer.invoke(IpcKey.searchApp, keyword),
};

export type IElectronAPI = typeof electronAPI;

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
