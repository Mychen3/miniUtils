import { useNavigate } from 'react-router-dom';
import { Button } from '@nextui-org/react';
import styles from './css/index.module.scss';

const HomePage = () => {
  const navigate = useNavigate();

  const onClickToDetail = () => {
    navigate('/detail');
  };
  return (
    <div className={styles.container}>
      <div className="box-border"></div>
      <Button color="primary" onClick={onClickToDetail}>
        跳转到详情
      </Button>
    </div>
  );
};

export default HomePage;
