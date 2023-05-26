export const SEND_STATUS = {
  UN_SEND: 0,
  SEND: 1,
  NOT_FRIEND_FAIL: 2,
  RECEIVE_FAIL: 3
}
export const SEND_STATUS_CN = {
  [SEND_STATUS.UN_SEND]: '未发送',
  [SEND_STATUS.SEND]: '已发送',
  [SEND_STATUS.NOT_FRIEND_FAIL]: '因客户不是好友导致发送失败',
  [SEND_STATUS.RECEIVE_FAIL]: '因客户已经收到其他群发消息导致发送失败'
}
export const TODO_STATUS = {
  // 1:已完成 0:未完成 2:已逾期
  NOT_DONE: 0,
  DONE: 1,
  OVERDUE: 2
}
