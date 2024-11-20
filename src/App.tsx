import { RouterProvider } from 'react-router-dom';
import { router } from './renderer/router/router.tsx';
function App() {
  return (
    <div>
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
