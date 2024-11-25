import Icons from '@src/renderer/components/Icons.tsx';
import Head from './components/Head.tsx';
import { Outlet } from 'react-router-dom';

const Layout = () => (
  <div className="box-border">
    <Head></Head>
    <div className="h-[calc(100vh-var(--head-height))] box-border overflow-hidden flex">
      <div className="w-[140px] box-border pt-[20px]">
        <div className="logo flex items-center justify-center">
          <Icons name="logo" className="w-[40px] h-[40px] mr-[8px]"></Icons>
          <span className="font-bold">Mini Util</span>
        </div>
      </div>
      <div className="w-[calc(100vw-140px)] flex-auto">
        <Outlet />
      </div>
    </div>
  </div>
);

export default Layout;
