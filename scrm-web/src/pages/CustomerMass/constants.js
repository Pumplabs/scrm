// export const SEND_TYPE_VAL = {
//   // 定时发送
//   SEND_TIMER: 1,
//   // 立即发送
//   IMMEDIATE_SEND: 2
// }

// export const SEND_TYPE_NAMES = {
//   [SEND_TYPE_VAL.SEND_TIMER]: '定时发送',
//   [SEND_TYPE_VAL.IMMEDIATE_SEND]: '立即发送',
// }

export const SEND_STATUS_VAL = {
  // 已取消
  CANCEL: 2,
  // 待发送
  WAIT_SEND: 0,
  // 发送成功
  SUCCESS:  1,
  // 创建失败
  FAIL: -1
}
// 0->待发送，1->发送成功，2->已取消，-1->创建失败，	
export const SEND_STATUS_NAMES = {
  // 已取消
  [SEND_STATUS_VAL.CANCEL]: '已取消',
  // 待发送
  [SEND_STATUS_VAL.WAIT_SEND]: '待发送',
  // 发送成功
  [SEND_STATUS_VAL.SUCCESS]: '发送成功',
  // 创建失败
  [SEND_STATUS_VAL.FAIL]: '创建失败'
}
export const GENDER_VALS = {
  ALL: -1,
  MALE: 1,
  FAMALE: 2,
  UNKNOWN: 0
}

export const NAME_LEN = 10