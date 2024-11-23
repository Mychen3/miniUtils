import { lazy } from 'react';
const IconSet = {
  close: lazy(() => import('~icons/mdi/window-close')),
  windowRestore: lazy(() => import('~icons/mdi/window-restore')),
  windowMinimize: lazy(() => import('~icons/mdi/window-minimize')),
  windowMaximize: lazy(() => import('~icons/mdi/window-maximize')),
};

type IconSetType = keyof typeof IconSet;

export default IconSet;

export type { IconSetType };
