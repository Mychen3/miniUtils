import { StateCreator } from 'zustand';
import { GatherStatus, GatherTime } from '@src/../common/const/index';

type IUpdateGatherCounts = (prevGatherCounts: { total: number; success: number }) => {
  total: number;
  success: number;
};

export interface IGather {
  gatherStatus: GatherStatus ;
  gatherCounts: {
    total: number;
    success: number;
  };
  gatherUrl: string;
  gatherTime: keyof typeof GatherTime;
  setGatherUrl: (gatherUrl: string) => void;
  setGatherCounts: (updateFn: IUpdateGatherCounts) => void;
  setGatherStatus: (serveStatus: GatherStatus) => void;
  setGatherTime: (gatherDate: keyof typeof GatherTime) => void;
}

export const createGather: StateCreator<IGather, [], [], IGather> = (set, get) => ({
  gatherStatus: GatherStatus.awaitGather,
  gatherCounts: {
    total: 0,
    success: 0,
  },
  gatherUrl: '',
  gatherTime: GatherTime.day,
  setGatherUrl: (gatherUrl: string) => set({ gatherUrl }),
  setGatherStatus: (gatherStatus: GatherStatus) => set({ gatherStatus }),
  setGatherCounts: (updateFn: IUpdateGatherCounts) => set({ gatherCounts: updateFn(get().gatherCounts) }),
  setGatherTime: (gatherTime: keyof typeof GatherTime) => set({ gatherTime }),
});
