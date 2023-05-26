// 执行方式 1:仅提醒 2:群发 3:朋友圈	
export const EXECUTE_WAY_OPTIONS = [
  {
    label: '群发',
    value: 1
  },
  {
    label: '一键群发',
    value: 2
  },
  {
    label: '朋友圈',
    value: 3
  },
]
export const EXECUTE_WAY_EN = {
  REMAIND: 1,
  MASS: 2,
  USER_MOMENT: 3
}

export const TRIGGER_TYPES = {
  TIME: 1,
  ADD_USER: 2
}
export const TRIGGER_OPTIONS = [
  {
    label: '时间',
    value: TRIGGER_TYPES.TIME
  },
  {
    label: '添加好友',
    value: TRIGGER_TYPES.ADD_USER
  }
]

export const REPEAT_TYPES = {
  DATE: 1,
  WEEK: 2,
  TWO_WEEK: 3,
  MONTH: 4,
  NEVER: 5,
  DEFINED: 6
}

export const REPEAT_OPTIONS = [
  {
    label: '每日',
    value: REPEAT_TYPES.DATE
  },
  {
    label: '每周',
    value: REPEAT_TYPES.WEEK
  },
  {
    label: '每两周',
    value: REPEAT_TYPES.TWO_WEEK
  },
  {
    label: '每月',
    value: REPEAT_TYPES.MONTH
  },
  {
    label: '永不',
    value: REPEAT_TYPES.NEVER
  },
  {
    label: '自定义',
    value: REPEAT_TYPES.DEFINED
  },
]
export const STATUS_EN = {
  DISABLED: 0,
  ENABLED: 1
}