import HomePage from '../pages/homePage';
import Detail from '../pages/homePage/Detail.tsx';

const routes = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/detail',
    element: <Detail />,
  },
];

export default routes;
