import { useState } from 'react';
import styles from './css/index.module.scss';
import { Button, Input } from '@nextui-org/react';
import axios from 'axios';
import { authConfig } from '../../../../common/const';
import { toast, Bounce, TypeOptions, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Activate = () => {
  const [activateLoading, setActivateLoading] = useState(false);
  const [trialLoading, setTrialLoading] = useState(false);
  const [code, setCode] = useState('');
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
  const onTrial = async () => {
    setTrialLoading(true);
    try {
      const machineId = await window.electronAPI.getMachineId();
      const url = `${authConfig.url}/software/trialSoftware`;
      const res = await axios.post(url, {
        machineId,
      });
      if (res.data.status !== 200) {
        handleToast(res.data.message, 'error');
        return;
      }
      window.electronAPI.enterMain();
    } catch (error) {
      handleToast('获取许可证失败', 'error');
    } finally {
      setTrialLoading(false);
    }
  };

  const onBuy = async () => {
    window.electronAPI.buySoftware();
  };
  const onActivate = async () => {
    setActivateLoading(true);
    try {
      const machineId = await window.electronAPI.getMachineId();
      const url = `${authConfig.url}/software/activateSoftware`;
      const res = await axios.post(url, {
        machineId,
        licenseKey: code,
      });
      if (res.data.status !== 200) {
        handleToast(res.data.message, 'error');
        return;
      }
      handleToast('激活成功，2秒后自动进入软件', 'success');
      setTimeout(() => {
        window.electronAPI.enterMain();
      }, 2000);
    } catch (error) {
      handleToast('激活失败', 'error');
    } finally {
      setActivateLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.title}>如您没有激活码，请先试用！</div>
      <div className="flex flex-col items-center justify-center mt-[50px]">
        <Input label="激活码" type="text" value={code} onChange={(e) => setCode(e.target.value)} />
        <div className={styles.buttonContainer}>
          <Button color="primary" isLoading={activateLoading} onClick={onActivate}>
            激活
          </Button>
          <Button color="primary" isLoading={trialLoading} onClick={onTrial}>
            试用
          </Button>
          <Button color="secondary" onClick={onBuy}>
            购买联系
          </Button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Activate;
