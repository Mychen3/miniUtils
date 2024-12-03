export enum IpcKey {
  close = 'close', // 关闭
  windowHide = 'windowHide', // 隐藏
  windowMinimize = 'windowMinimize', // 最小化
  changeWindowSize = 'changeWindowSize', // 改变窗口大小
  setWindowPin = 'setWindowPin', // 窗口置顶
  addTimedQueue = 'addTimedQueue', // 添加定时任务
  onTimedQueueTask = 'onTimedQueueTask', // 定时任务
  loginTg = 'loginTg', // 登录TG
  confirmPhoneCode = 'confirmPhoneCode', // 确认手机验证码
  onTgLoginHandle = 'onTgLoginHandle', //  监听tg登录相关事件
  onToastMessage = 'onToastMessage', // 提示
}
