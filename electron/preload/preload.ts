import { contextBridge, ipcRenderer } from 'electron';
import { IpcKey } from '../ipc/ipcKey.ts';

const electronAPI = {
  windowClose: () => ipcRenderer.send(IpcKey.close),
  windowHide: () => ipcRenderer.send(IpcKey.windowHide),
  windowMMinimize: () => ipcRenderer.send(IpcKey.windowMinimize),
  changeWindowSize: (isMax: boolean) => ipcRenderer.send(IpcKey.changeWindowSize, isMax),
  setWinPin: (isPin: boolean) => ipcRenderer.send(IpcKey.setWindowPin, isPin),
};

export type IElectronAPI = typeof electronAPI;

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
