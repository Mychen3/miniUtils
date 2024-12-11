import { lazy } from 'react';
import HomePage from '@pages/homePage/index';
import type { IconSetType } from '@src/common/constants/iconSet';

const Work = lazy(() => import('@pages/menu/work'));
const Flag = lazy(() => import('@pages/menu/flag'));
const RiskDict = lazy(() => import('@pages/menu/riskDict'));

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
  {
    path: 'flag',
    element: <Flag />,
    meta: {
      title: '采集',
      icon: 'flagVariantPlusOutline',
    },
  },
];

export default routes;
