import Layout from '@pages/layout';
import menuRoutes from './module/menu';

const routes = [
  {
    path: '/',
    element: <Layout />,
    meta: {
      title: '布局栏',
    },
    children: menuRoutes,
  },
];

export default routes;
