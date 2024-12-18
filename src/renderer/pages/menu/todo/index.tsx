import { useRef, useState } from 'react';
import styles from './css/index.module.scss';
import { Button, Input } from '@nextui-org/react';
import { useMount } from 'ahooks';

const Todo = () => {
  const count = useRef(0);
  const onClick = (time: number) => {
    count.current++;
    window.electronAPI.addTimedQueue({
      taskName: `定时${time}秒,${count.current}`,
      time: Date.now() + time,
    });
  };

  const [searchApp, setSearchApp] = useState<string>('');

  const onClickSearch = async (value: string) => {
    setSearchApp(value);
    const result = await window.electronAPI.searchApp(value);
    console.log(result);
  };

  useMount(() => {
    window.electronAPI.onTimedQueueTask((_, taskName: string) => {
      console.log(taskName);
    });
  });

  return (
    <div className={styles.todoConent}>
      <Input placeholder="请输入搜索关键字" value={searchApp} onChange={(e) => onClickSearch(e.target.value)} />
      <Button onClick={() => onClick(5000)}>定时5秒</Button>
    </div>
  );
};

export default Todo;
