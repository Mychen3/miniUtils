import HomePage from '@pages/homePage/index';
import Todo from '@pages/menu/todo';
import type { IconSetType } from '@src/common/constants/iconSet';

export type IMenuTypeItem = {
  path: string;
  element: React.ReactNode;
  meta: {
    title: string;
    icon: IconSetType;
    className?: string;
  };
};

const routes: IMenuTypeItem[] = [
  {
    path: '',
    element: <HomePage />,
    meta: {
      title: '盒子',
      icon: 'home',
      className: 'w-[22px] h-[22px]',
    },
  },
  {
    path: 'todo',
    element: <Todo />,
    meta: {
      title: '待办',
      icon: 'todo',
    },
  },
];

export default routes;
