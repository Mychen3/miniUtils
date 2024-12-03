enum systemKey {
  win = 'win32',
  mac = 'darwin',
  linux = 'linux',
}

enum tgLoginHandle {
  loginStart = 'loginStart',
  loginEnd = 'loginEnd',
}

const TgErrorConst: Record<string, string> = {
  PHONE_CODE_INVALI: '验证码不正确，重新输入',
};

export { systemKey, TgErrorConst, tgLoginHandle };
