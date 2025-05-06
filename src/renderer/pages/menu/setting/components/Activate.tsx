import { Input, Button } from '@nextui-org/react';
import styles from '../css/index.module.scss';
import { useState } from 'react';
import { authConfig } from '../../../../../../common/const/index';
import axios from 'axios';
import { TypeOptions } from 'react-toastify';

interface IActivateProps {
  handleToast: (message: string, type: TypeOptions) => void;
  onSuccessActivate: (data: { licenseTime: string; isAuto: boolean }) => void;
}

const Activate = ({ handleToast, onSuccessActivate }: IActivateProps) => {
  const [licenseKey, setLicenseKey] = useState<string>('');
  const [activateLoading, setActivateLoading] = useState<boolean>(false);
  const onActivate = async () => {
    try {
      setActivateLoading(true);
      const machineId = await window.electronAPI.getMachineId();
      const url = `${authConfig.url}/software/activateSoftware`;
      const result = await axios.post(url, {
        licenseKey,
        machineId,
      });
      if (result.data.status !== 200) return handleToast(result.data.message, 'error');
      if (result.data.data) {
        handleToast('激活成功', 'success');
        onSuccessActivate(result.data.data);
      }
    } catch (error) {
      handleToast('激活失败', 'error');
    } finally {
      setActivateLoading(false);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.title}>激活许可证</div>
      <div className={styles.titleTip}>使用您获取的密钥激活软件！</div>
      <div className={styles.inputContainer}>
        <Input type="password" variant="bordered" value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)} />
      </div>
      <div className={styles.subBtn}>
        <Button color="primary" isLoading={activateLoading} className="w-[100px]" onClick={onActivate}>
          激活
        </Button>
      </div>
    </div>
  );
};

export default Activate;
