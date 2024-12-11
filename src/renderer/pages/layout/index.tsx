import Icons from '@src/renderer/components/Icons.tsx';
import Head from './components/Head.tsx';
import Menu from './components/Menu.tsx';
import { Outlet } from 'react-router-dom';
import styles from './css/index.module.scss';
import { Suspense } from 'react';
import { Spinner } from '@nextui-org/react';

const Layout = () => (
  <div className="box-border">
    <Head></Head>
    <div className="h-[calc(100vh-var(--head-height))] box-border flex">
      <div className={styles.menu}>
        <div className={styles.logo}>
          <Icons name="logo" className="w-[40px] h-[40px] mr-[3px]"></Icons>
          <span className={styles.logoText}>TG-Utils</span>
        </div>
        <Menu></Menu>
      </div>
      <div className="w-[calc(100vw-100px)] flex-auto box-border">
        <Suspense fallback={<Spinner size="lg" />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  </div>
);

export default Layout;
