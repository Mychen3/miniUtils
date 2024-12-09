import { StateCreator } from 'zustand';
import { PullHandleMessage, applayUserStatus } from '@src/../common/const/index';

type IUpdateUserCount = (prevUserCount: { total: number; success: number; error: number }) => {
  total: number;
  success: number;
  error: number;
};

export interface IInviteMember {
  msgList: Array<PullHandleMessage>;
  userCount: {
    total: number;
    success: number;
    error: number;
  };
  serveStatus: keyof typeof applayUserStatus;
  addMsgList: (msg: PullHandleMessage) => void;
  setUserCount: (updateFn: IUpdateUserCount) => void;
  setServeStatus: (serveStatus: keyof typeof applayUserStatus) => void;
}

export const createInviteMember: StateCreator<IInviteMember, [], [], IInviteMember> = (set, get) => ({
  msgList: [],
  userCount: {
    total: 0,
    success: 0,
    error: 0,
  },
  serveStatus: applayUserStatus.pullWait,
  addMsgList: (msg: PullHandleMessage) => set((state) => ({ msgList: [...state.msgList, msg] })),
  setUserCount: (updateFn: IUpdateUserCount) => set({ userCount: updateFn(get().userCount) }),
  setServeStatus: (serveStatus: keyof typeof applayUserStatus) => set({ serveStatus }),
});
