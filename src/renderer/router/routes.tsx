import Layout from '@pages/layout';
import menuRoutes from './module/menu';
import Activate from '../pages/activate';

const routes = [
  {
    path: '/',
    element: <Layout />,
    meta: {
      title: '布局栏',
    },
    children: menuRoutes,
  },
  {
    path: 'activate',
    element: <Activate />,
    meta: {
      title: '激活',
    },
  },
];

export default routes;
