import { contextBridge, ipcRenderer } from 'electron';
import { IpcKey } from '../ipc/ipcKey.ts';

const electronAPI = {
  windowClose: () => ipcRenderer.send(IpcKey.close),
};

export type IElectronAPI = typeof electronAPI;

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
