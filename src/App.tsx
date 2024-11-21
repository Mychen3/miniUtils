import { RouterProvider } from 'react-router-dom';
import { router } from './renderer/router/router.tsx';
function App() {
  return (
    <div>
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </div>
  );
}

export default App;
