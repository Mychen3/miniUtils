import { useState } from 'react';
import styles from '../css/menu.module.scss';
import menuRoutes from '@src/renderer/router/module/menu';
import Icons from '@src/renderer/components/Icons';
import { useNavigate, useLocation } from 'react-router-dom';
const Menu = () => {
  const [activeMenu, setActiveMenu] = useState('');

  return (
    <div className={styles.menu}>
      {menuRoutes.map((item) => (
        <div key={item.path} className={styles.menuItem}>
          <Icons name={item.meta.icon} className={item.meta.className}></Icons>
          <span>{item.meta.title}</span>
        </div>
      ))}
    </div>
  );
};

export default Menu;
