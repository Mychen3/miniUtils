import { useState } from 'react';
import styles from './css/index.module.scss';

const Setting = () => {
  const [setting, setSetting] = useState<any>({});
  return (
    <div className={styles.container}>
      <div className={styles.title}>激活许可证</div>
      <div className={styles.titleTip}>使用您获取的密钥激活软件！</div>
    </div>
  );
};

export default Setting;
