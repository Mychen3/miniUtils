import { Switch } from '@nextui-org/react';
import styles from './css/index.module.scss';
import useTheme from '@hooks/useTheme.ts';
import { Theme } from '@const/publicConst.ts';
import { ChangeEvent, useMemo } from 'react';

const HomePage = () => {
  const [theme, setTheme] = useTheme('app-content');

  const selectedChecked = useMemo(() => theme === Theme.dark, [theme]);

  const onClickChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setTheme(checked ? Theme.dark : Theme.light);
  };

  return (
    <div className={styles.container}>
      <div className="box-border"></div>
      <Switch isSelected={selectedChecked} color="primary" onChange={onClickChange}>
        开关
      </Switch>
    </div>
  );
};

export default HomePage;
