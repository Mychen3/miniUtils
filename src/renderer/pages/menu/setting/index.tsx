import { useState } from 'react';
import styles from './css/index.module.scss';
import { Spinner } from '@nextui-org/react';
import axios from 'axios';
import { authConfig } from '../../../../../common/const/index';
import { ToastContainer, toast, Bounce, TypeOptions } from 'react-toastify';
import { useMount, useMemoizedFn } from 'ahooks';
import Activate from './components/Activate';
import Icons from '@components/Icons';
import dayjs from 'dayjs';
const Setting = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [activateInfo, setActivateInfo] = useState<{ licenseTime: string; isAuto: boolean }>({
    licenseTime: '',
    isAuto: false,
  });
  const handleToast = (message: string, type: TypeOptions) => {
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
  };

  const initSoftware = useMemoizedFn(async () => {
    try {
      setLoading(true);
      const machineId = await window.electronAPI.getMachineId();
      const url = `${authConfig.url}/software/getSoftwareLicenseStatus`;
      const result = await axios.post(url, {
        machineId,
      });
      setActivateInfo(result.data.data);
    } catch (error) {
      handleToast('获取许可证状态失败', 'error');
    } finally {
      setLoading(false);
    }
  });

  useMount(() => {
    initSoftware();
  });

  return (
    <div className="h-[100%]">
      {loading ? (
        <div className={styles.loadingContainer}>
          <Spinner />
        </div>
      ) : activateInfo.isAuto ? (
        <div className={styles.autoContainer}>
          <div className="flex items-center gap-2">
            <span className="font-bold">激活状态：</span>
            <Icons name="checkCircle" className="text-success" />
            <span>当前已激活！</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold">到期时间：</span>
            <span>{dayjs(activateInfo.licenseTime).format('YYYY-MM-DD')}</span>
          </div>
        </div>
      ) : (
        <Activate handleToast={handleToast} onSuccessActivate={setActivateInfo} />
      )}
      <ToastContainer />
    </div>
  );
};

export default Setting;
