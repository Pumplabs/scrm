export const STATUS_EN_VAL = {
  END: 2,
  START: 1,
  INIT: 0
}
// 状态，0->未开始，1->进行中，2->已结束
export const STATUS_OPTIONS = [
  {
    label: '未开始',
    status: 'default',
    value: STATUS_EN_VAL.INIT
  },
  {
    label: '已结束',
    status: 'error',
    value: STATUS_EN_VAL.END
  },
  {
    label: '进行中',
    status: 'processing',
    value: STATUS_EN_VAL.START
  }
]
export const MAX_LEVEL = 3