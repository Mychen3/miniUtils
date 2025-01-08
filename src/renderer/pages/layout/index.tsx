import Icons from '@src/renderer/components/Icons.tsx';
import Head from './components/Head.tsx';
import Menu from './components/Menu.tsx';
import { Outlet } from 'react-router-dom';
import styles from './css/index.module.scss';

const Layout = () => (
  <div className="box-border">
    <Head></Head>
    <div className="h-[calc(100vh-var(--head-height))] box-border flex">
      <div className={styles.menu}>
        <div className={styles.logo}>
          <Icons name="logo" className="w-[45px] h-[45px]"></Icons>
        </div>
        <Menu></Menu>
      </div>
      <div className="w-[calc(100vw-100px)] flex-auto box-border">
        <Outlet />
      </div>
    </div>
  </div>
);

export default Layout;
