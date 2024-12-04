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

const TgErrorConst: Record<string, string> = {
  PHONE_CODE_INVALI: '验证码不正确，重新输入',
};

export { systemKey, TgErrorConst, tgLoginHandle, passKey, applayUserStatus };
