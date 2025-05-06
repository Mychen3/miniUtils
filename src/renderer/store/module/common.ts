import { StateCreator } from 'zustand';

export interface ICommon {}

export const createCommon: StateCreator<ICommon, [], [], ICommon> = (set, get) => ({});
