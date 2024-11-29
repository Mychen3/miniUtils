export type QueueItem = {
  // 时间戳
  time: number;
  taskName: string;
  callback: (taskName: string) => void;
};

export class TimedQueue {
  private static instance: TimedQueue | null = null;
  private queue: QueueItem[] = [];
  private timer: NodeJS.Timeout | null = null;
  private interval: number;

  public static getInstance(interval?: number): TimedQueue {
    if (!TimedQueue.instance) TimedQueue.instance = new TimedQueue(interval ?? 3000);
    return TimedQueue.instance;
  }

  constructor(interval?: number) {
    this.interval = interval ?? 3000;

    if (!TimedQueue.instance) TimedQueue.instance = this;
    return TimedQueue.instance;
  }

  public add(target: QueueItem) {
    this.queue.push(target);
    if (this.queue.length > 1) this.queue.sort((a, b) => a.time - b.time);
    if (this.queue.length === 1) this.start();
  }

  public clear() {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.queue = [];
  }

  private start() {
    this.timer = setInterval(() => {
      const target = this.queue[0];
      if (target && target.time <= Date.now()) {
        const current = this.queue.shift();
        current?.callback(current.taskName);
      }
      if (this.queue.length === 0) this.clear();
    }, this.interval);
  }
}

export default TimedQueue;
