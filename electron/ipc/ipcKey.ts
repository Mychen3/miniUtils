export enum IpcKey {
  close = 'close', // 关闭
  windowHide = 'windowHide', // 隐藏
  windowMinimize = 'windowMinimize', // 最小化
  changeWindowSize = 'changeWindowSize', // 改变窗口大小
  setWindowPin = 'setWindowPin', // 窗口置顶
  addTimedQueue = 'addTimedQueue', // 添加定时任务
  onTimedQueueTask = 'onTimedQueueTask', // 定时任务
  searchApp = 'searchApp', // 搜索App
}
