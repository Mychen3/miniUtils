import { useRef } from 'react';
import styles from './css/index.module.scss';
import { Button } from '@nextui-org/react';
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

  useMount(() => {
    window.electronAPI.onTimedQueueTask((_, taskName: string) => {
      console.log(taskName);
    });
  });

  return (
    <div className={styles.todoConent}>
      <Button onClick={() => onClick(10000)}>定时10秒</Button>
      <Button onClick={() => onClick(5000)}>定时5秒</Button>
    </div>
  );
};

export default Todo;
