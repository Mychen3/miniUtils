import styles from '../css/head.module.scss';
import Icons from '@src/renderer/components/Icons.tsx';
import { useState, useMemo } from 'react';
import type { IconSetType } from '@const/iconSet.ts';
import { useCreation, useMemoizedFn } from 'ahooks';
import { systemKey } from '@const/publicConst.ts';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import { useMount } from 'ahooks';
import useStore from '@src/renderer/store/index';
import { applayUserStatus } from '@src/../common/const/index';
import 'react-toastify/dist/ReactToastify.css';

type IConsItem = {
  name: IconSetType;
  hoverClass: string;
  icon: IconSetType;
};

const Head = () => {
  const [isMax, setIsMax] = useState(false);
  const [onTop, setOnTop] = useState(false);
  const { addMsgList, setUserCount, setServeStatus } = useStore();
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

  // 全局监听邀请信息
  const onPullHandleMessage = useMemoizedFn(() => {
    window.electronAPI.onPullHandleMessage((_event, params) => {
      const { type } = params;
      if (type === 'end') setServeStatus(applayUserStatus.pullWait);
      if (['error', 'success'].includes(type)) {
        setUserCount((userCount) => ({
          total: userCount.total,
          success: type === 'success' ? userCount.success + 1 : userCount.success,
          error: type === 'error' ? userCount.error + 1 : userCount.error,
        }));
      }
      addMsgList(params);
    });
  });

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

  const onToastMessage = useMemoizedFn(() => {
    window.electronAPI.onToastMessage((_event, message, type) => {
      toast(message, {
        type,
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
        transition: Bounce,
      });
    });
  });

  useMount(() => {
    onToastMessage();
    onPullHandleMessage();
  });

  return (
    <>
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
      <ToastContainer />
    </>
  );
};
export default Head;
