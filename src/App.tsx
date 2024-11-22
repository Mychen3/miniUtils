import { RouterProvider } from 'react-router-dom';
import { router } from './renderer/router/router.tsx';
import { useMount } from 'ahooks';
import sessionKey from '@const/sessionKey.ts';
import { Theme } from '@const/publicConst.ts';

function App() {
  useMount(() => {
    const dom = document.getElementById('app-content');
    const sessionTheme = localStorage.getItem(sessionKey.theme);
    const theme = sessionTheme ?? Theme.light;
    if (dom) dom.setAttribute('class', `${theme} text-foreground bg-background`);
    if (!sessionTheme) localStorage.setItem(sessionKey.theme, theme);
  });

  return (
    <div id="app-content">
      <RouterProvider router={router} future={{ v7_startTransition: true }} />
    </div>
  );
}

export default App;
