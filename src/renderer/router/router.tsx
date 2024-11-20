import { createHashRouter } from 'react-router-dom';
import HomePage from '../pages/homePage';
import Detail from '../pages/homePage/Detail.tsx';

const router = createHashRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/detail',
    element: <Detail />,
  },
]);

export { router };
