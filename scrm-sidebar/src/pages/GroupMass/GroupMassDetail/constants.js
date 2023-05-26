export const SEND_STATUS = {
  // 已发送
  SUCCESS: 1,
  // 未发送
  NOT_SEND: 0,
  // 因客户不是好友导致发送失败
  NOT_FRIEND: 2,
  // 因客户已经收到其他群发消息导致发送失败
  OTHER: 3,
}