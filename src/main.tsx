import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { NextUIProvider } from '@nextui-org/react';
import './index.css';
import './common/css/rootGlobal.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <NextUIProvider>
    <App />
  </NextUIProvider>,
);
