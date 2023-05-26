export const HANDLE_STATUS = {
  // 接替完毕
  DONE: 1,
  // 等待接替
  WAIT: 2,
  // 客户拒绝
  REJECT: 3,
  // 接替成员客户达到上限
  IS_LIMIT: 4,
  // 无接替记录
  NONE: 5
}

// 接替状态
export const TRANSFER_STATUS_OPTIONS = [
  {
    label: '接替完毕',
    value: HANDLE_STATUS.DONE,
  },
  {
    label: '等待接替',
    value: HANDLE_STATUS.WAIT
  },
  {
    label: '客户拒绝',
    value: HANDLE_STATUS.REJECT
  },
  {
    label: '接替成员客户达到上限',
    value: HANDLE_STATUS.IS_LIMIT
  },
  {
    label: '无接替记录',
    value: HANDLE_STATUS.NONE
  }
]