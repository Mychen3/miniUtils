import { useState } from 'react';
import styles from './css/index.module.scss';
import { Input, Button } from '@nextui-org/react';

const Setting = () => {
  const [setting, setSetting] = useState<any>({});
  return (
    <div className={styles.container}>
      <div className={styles.title}>激活许可证</div>
      <div className={styles.titleTip}>使用您获取的密钥激活软件！</div>
      <div className={styles.inputContainer}>
        <Input type="password" variant="bordered"></Input>
      </div>
      <div className={styles.subBtn}>
        <Button color="primary" className="w-[100px]">
          激活
        </Button>
      </div>
    </div>
  );
};

export default Setting;
