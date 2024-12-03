import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IpcKey } from '../ipc/ipcKey.ts';
import { tgLoginHandle } from '../../common/const';
import type { QueueItem } from '../workr/TimedQueue.ts';
import type { TypeOptions } from 'react-toastify';
import type { IUserItem } from '../db/module/user';

const electronAPI = {
  windowClose: () => ipcRenderer.send(IpcKey.close),
  windowHide: () => ipcRenderer.send(IpcKey.windowHide),
  windowMinimize: () => ipcRenderer.send(IpcKey.windowMinimize),
  changeWindowSize: (isMax: boolean) => ipcRenderer.send(IpcKey.changeWindowSize, isMax),
  setWinPin: (isPin: boolean) => ipcRenderer.send(IpcKey.setWindowPin, isPin),
  addTimedQueue: (target: Omit<QueueItem, 'callback'>) => ipcRenderer.send(IpcKey.addTimedQueue, target),
  onTimedQueueTask: (callback: (event: IpcRendererEvent, taskName: string) => void) =>
    ipcRenderer.on(IpcKey.onTimedQueueTask, callback),
  loginTg: (params: { username: string; password?: string }) => ipcRenderer.send(IpcKey.loginTg, params),
  confirmPhoneCode: (code: string) => ipcRenderer.send(IpcKey.confirmPhoneCode, code),
  onTgLoginHandle: (callback: (event: IpcRendererEvent, handle: keyof typeof tgLoginHandle) => void) =>
    ipcRenderer.on(IpcKey.onTgLoginHandle, callback),
  onToastMessage: (callback: (event: IpcRendererEvent, message: string, type: TypeOptions) => void) =>
    ipcRenderer.on(IpcKey.onToastMessage, callback),
  getPageUsers: (params: { page: number; pageSize: number; search: string }) =>
    ipcRenderer.invoke(IpcKey.getPageUsers, params) as Promise<{ list: IUserItem[]; total: number }>,
  deleteUser: (userItem: IUserItem) => ipcRenderer.invoke(IpcKey.deleteUser, userItem),
  refreshUserStatus: (user_id: number) => ipcRenderer.invoke(IpcKey.refreshUserStatus, user_id),
};

export type IElectronAPI = typeof electronAPI;

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
