import { lazy } from 'react';
const IconSet = {
  logo: lazy(() => import('~icons/mySvg/logo')),
  close: lazy(() => import('~icons/mdi/window-close')),
  windowRestore: lazy(() => import('~icons/mdi/window-restore')),
  windowMinimize: lazy(() => import('~icons/mdi/window-minimize')),
  windowMaximize: lazy(() => import('~icons/mdi/window-maximize')),
  windowPin: lazy(() => import('~icons/mdi/pin-outline')),
  home: lazy(() => import('~icons/mdi/home-lightning-bolt-outline')),
  todo: lazy(() => import('~icons/mdi/todo-auto')),
  user: lazy(() => import('~icons/mdi/user-tie')),
  password: lazy(() => import('~icons/mdi/password')),
  verifiedUser: lazy(() => import('~icons/mdi/verified-user')),
  add: lazy(() => import('~icons/mdi/add')),
  checkCircle: lazy(() => import('~icons/mdi/check-circle')),
  closeCircle: lazy(() => import('~icons/mdi/close-circle')),
  delete: lazy(() => import('~icons/mdi/delete')),
  refresh: lazy(() => import('~icons/mdi/refresh')),
};

type IconSetType = keyof typeof IconSet;

export default IconSet;

export type { IconSetType };
