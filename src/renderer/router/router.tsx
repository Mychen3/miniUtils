import { createHashRouter } from 'react-router-dom';
import routes from './routes.tsx';

const router = createHashRouter(routes, {
  future: {
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
    v7_relativeSplatPath: true,
    v7_skipActionErrorRevalidation: true,
  },
});

export { router };
