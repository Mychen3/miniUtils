import { contextBridge, ipcRenderer, IpcRendererEvent } from 'electron';
import { IpcKey } from '../ipc/ipcKey.ts';
import { tgLoginHandle } from '../../common/const';
import type { QueueItem } from '../workr/TimedQueue.ts';
import type { TypeOptions } from 'react-toastify';
import type { IUserItem } from '../db/module/user';
import type { RiskDictItem } from '../db/module/risk';
import type { PullHandleMessage, GatherTime } from '../../common/const';

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
  onTgLoginHandle: (
    callback: (event: IpcRendererEvent, handle: keyof typeof tgLoginHandle, errorMessage?: string) => void,
  ) => ipcRenderer.on(IpcKey.onTgLoginHandle, callback),
  onToastMessage: (callback: (event: IpcRendererEvent, message: string, type: TypeOptions) => void) =>
    ipcRenderer.on(IpcKey.onToastMessage, callback),
  getPageUsers: (params: { page: number; pageSize: number; phone: string }) =>
    ipcRenderer.invoke(IpcKey.getPageUsers, params) as Promise<{ list: IUserItem[]; total: number }>,
  deleteUser: (userItem: IUserItem) => ipcRenderer.invoke(IpcKey.deleteUser, userItem),
  refreshUserStatus: (user_id: number) => ipcRenderer.invoke(IpcKey.refreshUserStatus, user_id),
  addRiskDict: (params: { riskStatus: string; riskValue: string }) => ipcRenderer.invoke(IpcKey.addRiskDict, params),
  getRiskDictList: () => ipcRenderer.invoke(IpcKey.getRiskDictList) as Promise<Array<RiskDictItem>>,
  deleteRiskDict: (risk_id: number) => ipcRenderer.invoke(IpcKey.deleteRiskDict, { risk_id }),
  inviteUser: (params: { pullNames: string; groupId: string; userIds: string }) =>
    ipcRenderer.invoke(IpcKey.inviteUser, params),
  onPullHandleMessage: (callback: (event: IpcRendererEvent, params: PullHandleMessage) => void) =>
    ipcRenderer.on(IpcKey.onPullHandleMessage, callback),
  handleInviteMemberPause: (isStop: boolean) => ipcRenderer.send(IpcKey.handleInviteMemberPause, isStop),
  handleFlagMember: (params: {
    groupId: string;
    flagNumber: number;
    flagTime: keyof typeof GatherTime;
    userId: number;
  }) => ipcRenderer.send(IpcKey.handleFlagMember, params),
};

export type IElectronAPI = typeof electronAPI;

contextBridge.exposeInMainWorld('electronAPI', electronAPI);
