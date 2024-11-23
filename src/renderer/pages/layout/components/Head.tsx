import styles from '../css/head.module.scss';
import Icons from '@src/renderer/components/Icons.tsx';
import { useRef } from 'react';
import type { IconSetType } from '@const/iconSet.ts';

const Head = () => {
  const handIcons = useRef<Array<{ name: IconSetType; hoverClass: string }>>([
    {
      name: 'close',
      hoverClass: 'closeHover',
    },
  ]);

  return (
    <div className={styles.container}>
      <div className={styles.iconsBox}>
        {handIcons.current.map((item) => (
          <Icons key={item.name} name={item.name}></Icons>
        ))}
      </div>
    </div>
  );
};
export default Head;
