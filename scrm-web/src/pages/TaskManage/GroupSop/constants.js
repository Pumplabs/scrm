export const EXECUTE_WAY_OPTIONS = [
  {
    label: '群发',
    value: 1,
  },
]
export const EXECUTE_WAY_VAL_EN = {
  REMIND: 1
}

export const TRIGGER_TYPES = {
  TIME: 1,
  CREAT_CHAT: 3
}
export const TRIGGER_OPTIONS = [
  {
    label: '时间',
    value: TRIGGER_TYPES.TIME
  },
  {
    label: '创建群聊',
    value: TRIGGER_TYPES.CREAT_CHAT
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

export const SOP_TYPE = {
  GROUP: 2,
  CUSTOMER: 1
}
export const STATUS_EN = {
  DISABLED: 0,
  ENABLED: 1
}