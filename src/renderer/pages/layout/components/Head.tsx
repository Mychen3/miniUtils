import styles from '../css/head.module.scss';
import Icons from '@src/renderer/components/Icons.tsx';
import { useState, useMemo } from 'react';
import type { IconSetType } from '@const/iconSet.ts';
import { useCreation, useMemoizedFn } from 'ahooks';
import { systemKey } from '@const/publicConst.ts';

type IConsItem = {
  name: IconSetType;
  hoverClass: string;
  icon: IconSetType;
};

const Head = () => {
  const [isMax, setIsMax] = useState(false);
  const [onTop, setOnTop] = useState(false);
  const isMac = useCreation(() => {
    // 实验性特性 https://developer.mozilla.org/zh-CN/docs/Web/API/NavigatorUAData
    /* @ts-ignore */
    const platform = navigator.userAgentData.platform;
    return platform === systemKey.mac;
  }, []);
  const containerClass = `${styles.container} ${!isMac ? 'justify-end' : ''}`;
  const dragClass = `${styles.drag} ${!isMac ? styles.macDrag : ''}`;

  const handIcons = useMemo<Array<IConsItem>>(
    () => [
      {
        name: 'windowPin',
        icon: 'windowPin',
        hoverClass: onTop ? `${styles.onTop} ${styles.scale}` : styles.scale,
      },
      {
        name: 'windowMinimize',
        icon: 'windowMinimize',
        hoverClass: styles.scale,
      },
      {
        name: 'windowMaximize',
        icon: isMax ? 'windowRestore' : 'windowMaximize',
        hoverClass: styles.scale,
      },
      {
        name: 'close',
        icon: 'close',
        hoverClass: styles.closeBox,
      },
    ],
    [isMax, onTop],
  );

  const onClickIcon = useMemoizedFn((target: IConsItem) => {
    const actionMap: Record<string, () => void> = {
      close: () => window.electronAPI.windowHide(),
      windowMinimize: () => window.electronAPI.windowMinimize(),
      windowMaximize: () => {
        window.electronAPI.changeWindowSize(isMax);
        setIsMax(!isMax);
      },
      windowPin: () => {
        window.electronAPI.setWinPin(!onTop);
        setOnTop(!onTop);
      },
    };
    actionMap[target.name]?.();
  });

  return (
    <div className={containerClass}>
      <div className={dragClass}></div>
      {isMac && (
        <div className={styles.iconsBox}>
          {handIcons.map((item) => (
            <div key={item.name} className={item.hoverClass} onClick={() => onClickIcon(item)}>
              <Icons name={item.icon}></Icons>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default Head;
