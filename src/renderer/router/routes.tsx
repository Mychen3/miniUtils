import Layout from '@pages/layout';
import HomePage from '../pages/homePage';

const routes = [
  {
    path: '/',
    element: <Layout />,
    meta: {
      title: '布局栏',
    },
    children: [
      {
        path: '',
        element: <HomePage />,
        meta: {
          title: '首页',
        },
      },
    ],
  },
];

export default routes;
