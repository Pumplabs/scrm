import moment from 'moment'
import { SEND_STATUS_VAL } from './constants'

const STATUS_EN_TYPES = {
  CANCEL: 'cancel',
  INIT: 'init',
  DONE: 'done',
  WAIT: 'wait',
  FAIL: 'fail',
}
const STATUS_NAMES = {
  cancel: '已取消',
  done: '已结束',
  wait: '待发送',
  fail: '创建失败',
  init: '未开始',
}
const isWaitStatus = (time, diffCount = 30) => {
  const diff = moment(time).diff(moment(), 'minutes', true)
  return diff > 0 && diff <= diffCount
}
export const getRecordStatus = (record = {}) => {
  const { status, sendTime } = record
  let type = STATUS_EN_TYPES.INIT
  if (status === SEND_STATUS_VAL.SUCCESS) {
    type = STATUS_EN_TYPES.DONE
  } else if (status === SEND_STATUS_VAL.FAIL) {
    type = STATUS_EN_TYPES.FAIL
  } else if (status === SEND_STATUS_VAL.CANCEL) {
    type = STATUS_EN_TYPES.CANCEL
  } else if (status === SEND_STATUS_VAL.WAIT_SEND) {
    type = isWaitStatus(sendTime) ? STATUS_EN_TYPES.WAIT : STATUS_EN_TYPES.INIT
  }
  return {
    type,
    name: STATUS_NAMES[type],
  }
}