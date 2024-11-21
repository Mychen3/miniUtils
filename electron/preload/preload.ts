import { contextBridge } from 'electron';

const electronAPI = {};
contextBridge.exposeInMainWorld('electronAPI', electronAPI);
