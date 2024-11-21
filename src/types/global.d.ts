import type { IElectronAPI } from '../../electron/preload/preload.ts';

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}

declare interface IElectronStore {}

declare module '*.jpg' {
  const jpg: string;
  export default jpg;
}

export {};
