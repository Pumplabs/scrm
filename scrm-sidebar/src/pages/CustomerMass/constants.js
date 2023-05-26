export const NAME_LEN = 10

export const ADVANCE_FILTER = {
  IN: 1,
  AND: 2,
  NONE: 3
}
export const ADVANCE_FILTER_NAMES = {
  [ADVANCE_FILTER.IN]: '标签满足其中之一',
  [ADVANCE_FILTER.AND]: '标签同时满足',
  [ADVANCE_FILTER.NONE]: '无任何标签'
}

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