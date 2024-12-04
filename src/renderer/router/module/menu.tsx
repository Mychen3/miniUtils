import HomePage from '@pages/homePage/index';
import RiskDict from '@pages/menu/riskDict';
import Work from '@pages/menu/work';
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
      title: '账号',
      icon: 'user',
      className: 'w-[22px] h-[22px]',
    },
  },
  {
    path: 'riskDict',
    element: <RiskDict />,
    meta: {
      title: '风控',
      icon: 'todo',
    },
  },
  {
    path: 'work',
    element: <Work />,
    meta: {
      title: '邀请',
      icon: 'userAddOutline',
    },
  },
];

export default routes;
