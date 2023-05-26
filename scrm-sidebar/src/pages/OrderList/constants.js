export const STATUS_VALS = {
  WAIT_CHECK: 1,
  CONFIRM: 2,
  DONE: 3,
  REJECT:4 
}
export const STATUS_NAMES = {
  [STATUS_VALS.WAIT_CHECK]: '审核中',
  [STATUS_VALS.CONFIRM]: '已确认',
  [STATUS_VALS.DONE]: '已完成',
  [STATUS_VALS.REJECT]: '不通过'
}