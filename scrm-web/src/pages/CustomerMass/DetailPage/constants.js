export const CUSTOMER_STATUS_EN = {
  WAIT_SEND: 0,
  SEND: 1,
  NOT_FRIEND: 2,
  OVER_LIMIT: 3,
}
export const CUSTOMER_STATUS_CN = {
  0: '未发送',
  1: '已发送',
  2: '已不是好友',
  3: '接收达上限',
}
export const MEMBER_STATUS_EN = {
  WAIT_SEND: 0,
  SEND: 1,
  FAIL: 2,
}

export const MEMBER_STATUS_CN = {
  [MEMBER_STATUS_EN.WAIT_SEND]: '未发送',
  [MEMBER_STATUS_EN.SEND]: '已发送',
  [MEMBER_STATUS_EN.FAIL]: '发送失败',
  // 发送状态：0-未发送 1-已发送 2-因客户不是好友导致发送失败 3-因客户已经收到其他群发消息导致发送失败
}
