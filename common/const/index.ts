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

enum GatherStatus {
  gather = 'Gather', // 采集中
  awaitGather = 'awaitGather', // 待采集
}

enum GatherTime {
  day = 'day', // 1天
  threeDay = 'threeDay', // 3天
  monday = 'Monday', // 1周
}

const regex = {
  isUserExist: /^No user has "([^"]+)" as username$/,
};

const apiId = Number(import.meta.env.VITE_TG_API_ID);
const apiHash = import.meta.env.VITE_TG_API_HASH;

enum IErrorType {
  PHONE_CODE_INVALI = 'PHONE_CODE_INVALI',
  CHECK_USER_RISK = 'CHECK_USER_RISK',
  PHONE_PASSWORD_FLOOD = 'PHONE_PASSWORD_FLOOD',
  PHONE_NUMBER_BANNED = 'PHONE_NUMBER_BANNED',
  PHONE_NUMBER_UNAVAILABLE = 'PHONE_NUMBER_UNAVAILABLE',
  USERNAME_INVALID = 'USERNAME_INVALID',
  CHAT_WRITE_FORBIDDEN = 'CHAT_WRITE_FORBIDDEN',
  PHONE_CODE_INVALID = 'PHONE_CODE_INVALID',
  INVITE_HASH_EXPIRED = 'INVITE_HASH_EXPIRED',
  CHANNEL_PRIVATE = 'CHANNEL_PRIVATE',
  PEER_FLOOD = 'PEER_FLOOD',
  USER_NOT_MUTUAL_CONTACT = 'USER_NOT_MUTUAL_CONTACT',
  CHAT_MEMBER_ADD_FAILED = 'CHAT_MEMBER_ADD_FAILED',
  PHONE_NUMBER_INVALID = 'PHONE_NUMBER_INVALID',
  CHAT_INVALID = 'CHAT_INVALID',
  USER_ALREADY_PARTICIPANT = 'USER_ALREADY_PARTICIPANT',
  Missing_Invitee = 'MissingInvitee',
  YOU_BLOCKED_USER = 'YOU_BLOCKED_USER',
}

export type PullHandleMessage = {
  type: 'success' | 'error' | 'info' | 'stop' | 'end';
  message: string;
};

const TgErrorConst: Record<IErrorType, string> = {
  [IErrorType.PHONE_CODE_INVALI]: '验证码不正确，重新输入',
  [IErrorType.CHECK_USER_RISK]: '当前账号无法判断是否存在风险，请添加词典！',
  [IErrorType.PHONE_PASSWORD_FLOOD]: '您尝试登录的次数过多',
  [IErrorType.PHONE_NUMBER_BANNED]: '当前账号已被封禁',
  [IErrorType.PHONE_NUMBER_UNAVAILABLE]: '电话号码无效',
  [IErrorType.USERNAME_INVALID]: '用户名无效',
  [IErrorType.CHAT_WRITE_FORBIDDEN]: '当前账号无法发送消息',
  [IErrorType.PHONE_CODE_INVALID]: '验证码不正确，重新输入',
  [IErrorType.INVITE_HASH_EXPIRED]: '邀请链接已过期',
  [IErrorType.CHANNEL_PRIVATE]: '未加入此频道/超级组',
  [IErrorType.PEER_FLOOD]: '请求过于频繁，请稍后再试',
  [IErrorType.USER_NOT_MUTUAL_CONTACT]: '不是互相关注用户',
  [IErrorType.CHAT_MEMBER_ADD_FAILED]: '邀请失败，用户隐私设置',
  [IErrorType.PHONE_NUMBER_INVALID]: '电话号码无效',
  [IErrorType.CHAT_INVALID]: '邀请失败！',
  [IErrorType.USER_ALREADY_PARTICIPANT]: '用户已经是群成员',
  [IErrorType.Missing_Invitee]: '用户设置了隐私，无法邀请',
  [IErrorType.YOU_BLOCKED_USER]: '您已将该用户（或机器人）拉黑',
};

export {
  systemKey,
  TgErrorConst,
  tgLoginHandle,
  passKey,
  applayUserStatus,
  IErrorType,
  regex,
  GatherStatus,
  GatherTime,
  apiId,
  apiHash,
};
