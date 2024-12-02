import { useState, useRef } from 'react';
import styles from '../css/menu.module.scss';
import menuRoutes from '@src/renderer/router/module/menu';
import Icons from '@src/renderer/components/Icons';
import type { IMenuTypeItem } from '@src/renderer/router/module/menu';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarIcon } from '@nextui-org/avatar';
import { useDisclosure } from '@nextui-org/react';
import Login from './Login';

const Menu = () => {
  const navigate = useNavigate();
  const [activeMenu, setActiveMenu] = useState('');
  const activeIndex = useRef(0);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const onClickSelectMenu = (item: IMenuTypeItem, index: number) => {
    navigate(item.path);
    setActiveMenu(item.path);
    activeIndex.current = index;
  };

  return (
    <div className="box-border">
      <div className={styles.menu}>
        <div className={styles.activeMenu} style={{ transform: `translateY(${activeIndex.current * 46}px)` }}></div>
        {menuRoutes.map((item, index) => (
          <div
            key={item.path}
            className={`${styles.menuItem} ${activeMenu === item.path ? styles.activeMenuStyle : ''}`}
            onClick={() => onClickSelectMenu(item, index)}
          >
            <Icons name={item.meta.icon} className={item.meta.className}></Icons>
            <span>{item.meta.title}</span>
          </div>
        ))}
      </div>
      <div className={styles.system}>
        <Avatar icon={<AvatarIcon />} onClick={onOpen} classNames={{ base: 'w-[35px] h-[35px] cursor-pointer' }} />
        <Login isOpen={isOpen} onOpenChange={onOpenChange} />
      </div>
    </div>
  );
};

export default Menu;
