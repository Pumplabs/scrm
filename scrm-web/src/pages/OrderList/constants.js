export const ORDER_STATUS_VALS = {
  // 已完成
  DONE: 3,
  // 已确认
  CONFIRM: 2,
  // 审核不通过
  REJECT: 4,
  // 已取消
  CANCEL: 5,
  // 待审核
  INIT: 1,
  // 全部
  ALL: 'all',
}
export const ORDER_STATUS_NAMES = {
  [ORDER_STATUS_VALS.INIT]: '待审核',
  [ORDER_STATUS_VALS.CANCEL]: '已取消',
  [ORDER_STATUS_VALS.REJECT]: '审核不通过',
  [ORDER_STATUS_VALS.CONFIRM]: '已确认',
  [ORDER_STATUS_VALS.DONE]: '已完成',
}
// 订单状态 1:待审核 2:已确定 3:已完成 4:审核不通过
export const ORDER_STATUS_OPTIONS = [
  {
    label: ORDER_STATUS_NAMES[ORDER_STATUS_VALS.INIT],
    value: ORDER_STATUS_VALS.INIT,
  },
  {
    label: ORDER_STATUS_NAMES[ORDER_STATUS_VALS.CONFIRM],
    value: ORDER_STATUS_VALS.CONFIRM,
  },
  {
    label: ORDER_STATUS_NAMES[ORDER_STATUS_VALS.DONE],
    value: ORDER_STATUS_VALS.DONE,
  },
  {
    label: ORDER_STATUS_NAMES[ORDER_STATUS_VALS.REJECT],
    value: ORDER_STATUS_VALS.REJECT,
  }
]
