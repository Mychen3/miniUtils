import { contextBridge } from 'electron';

const electronAPI = {};

export type IElectronAPI = typeof electronAPI;

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
