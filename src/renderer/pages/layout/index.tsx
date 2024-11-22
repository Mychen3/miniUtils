import Head from './components/Head.tsx';
import { Outlet } from 'react-router-dom';

const Layout = () => (
  <div className="box-border">
    <Head></Head>
    <div className="h-[calc(100vh-var(--head-height))] box-border overflow-hidden">
      <Outlet />
    </div>
  </div>
);

export default Layout;
