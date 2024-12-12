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
  getPageUsers = 'getPageUsers', // 获取分页用户
  deleteUser = 'deleteUser', // 删除用户
  refreshUserStatus = 'refreshUserStatus', // 刷新用户状态
  addRiskDict = 'addRiskDict', // 添加风险字段
  getRiskDictList = 'getRiskDictList', // 获取风险字段列表
  deleteRiskDict = 'deleteRiskDict', // 删除风险字段
  inviteUser = 'inviteUser', // 邀请用户
  onPullHandleMessage = 'onPullHandleMessage', // 监听拉取群组消息
  handleInviteMemberPause = 'onInviteMemberPause', // 设置邀请成员暂停
  handleFlagMemberTell = 'handleFlagMemberTell', // 采集群发言
  onFlagMemberInfo = 'onFlagMemberInfo', // 采集群发言
  handleFlagMemberTellStop = 'handleFlagMemberTellStop', // 停止采集群发言
  exportFlagMember = 'exportFlagMember', // 导出采集群发言
}
