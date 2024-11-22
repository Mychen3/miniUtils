import { RouterProvider } from 'react-router-dom';
import { router } from './renderer/router/router.tsx';
function App() {
  return (
    <div className="dark text-foreground bg-background " id="app-content">
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </div>
  );
}

export default App;
