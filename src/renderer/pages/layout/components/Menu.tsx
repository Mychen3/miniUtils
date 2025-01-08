import { useState, useRef } from 'react';
import styles from '../css/menu.module.scss';
import menuRoutes from '@src/renderer/router/module/menu';
import Icons from '@src/renderer/components/Icons';
import type { IMenuTypeItem } from '@src/renderer/router/module/menu';
import { useNavigate } from 'react-router-dom';
import { Tooltip } from '@nextui-org/react';

const Menu = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('');
  const activeIndex = useRef(0);

  const onClickSelectMenu = (item: IMenuTypeItem, index: number) => {
    navigate(item.path);
    setActiveMenu(item.path);
    activeIndex.current = index;
  };

  return (
    <div className={styles.menu}>
      <div className={styles.activeMenu} style={{ transform: `translateY(${activeIndex.current * 46}px)` }}></div>
      {menuRoutes.map((item, index) => (
        <Tooltip color="primary" content={item.meta.title} delay={1000} placement="right" key={item.path}>
          <div
            key={item.path}
            className={`${styles.menuItem} ${activeMenu === item.path ? styles.activeMenuStyle : ''}`}
            onClick={() => onClickSelectMenu(item, index)}
          >
            <Icons name={item.meta.icon} className={item.meta.className}></Icons>
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

export default Menu;
