enum systemKey {
  win = 'win32',
  mac = 'darwin',
  linux = 'linux',
}

enum tgLoginHandle {
  loginStart = 'loginStart',
  loginEnd = 'loginEnd',
  verifyPhoneCode = 'verifyPhoneCode',
  loginError = 'loginError',
}

enum passKey {
  pass = 'pass',
  warn = 'warn',
}

enum applayUserStatus {
  pull = 'pull', // 邀请中
  pullPause = 'pullPause', // 暂停邀请
  pullWait = 'pullWait', // 待拉取
}

enum IErrorType {
  PHONE_CODE_INVALI = 'PHONE_CODE_INVALI',
  CHECK_USER_RISK = 'CHECK_USER_RISK',
  PHONE_PASSWORD_FLOOD = 'PHONE_PASSWORD_FLOOD',
  PHONE_NUMBER_BANNED = 'PHONE_NUMBER_BANNED',
  PHONE_NUMBER_UNAVAILABLE = 'PHONE_NUMBER_UNAVAILABLE',
  USERNAME_INVALID = 'USERNAME_INVALID',
  CHAT_WRITE_FORBIDDEN = 'CHAT_WRITE_FORBIDDEN',
}

export type PullHandleMessage<T = any> = {
  type: 'success' | 'error' | 'info';
  message: string;
  data?: T;
};

const TgErrorConst: Record<IErrorType, string> = {
  [IErrorType.PHONE_CODE_INVALI]: '验证码不正确，重新输入',
  [IErrorType.CHECK_USER_RISK]: '当前账号无法判断是否存在风险，请添加词典！',
  [IErrorType.PHONE_PASSWORD_FLOOD]: '您尝试登录的次数过多',
  [IErrorType.PHONE_NUMBER_BANNED]: '当前账号已被封禁',
  [IErrorType.PHONE_NUMBER_UNAVAILABLE]: '电话号码无效',
  [IErrorType.USERNAME_INVALID]: '用户名无效',
  [IErrorType.CHAT_WRITE_FORBIDDEN]: '当前账号无法发送消息',
};

export { systemKey, TgErrorConst, tgLoginHandle, passKey, applayUserStatus, IErrorType };
