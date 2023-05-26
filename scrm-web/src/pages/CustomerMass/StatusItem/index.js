import cls from 'classnames'
import moment from 'moment'
import styles from './index.module.less'
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

export const isWaitStatus = (time, diffCount = 30) => {
  const diff = moment(time).diff(moment(), 'minutes', true)
  return diff > 0 && diff <= diffCount
}
export const getRecordStatus = (record = {}, statusVals) => {
  const { status, sendTime } = record
  let type = STATUS_EN_TYPES.INIT
  if (status === statusVals.SUCCESS) {
    type = STATUS_EN_TYPES.DONE
  } else if (status === statusVals.FAIL) {
    type = STATUS_EN_TYPES.FAIL
  } else if (status === statusVals.CANCEL) {
    type = STATUS_EN_TYPES.CANCEL
  } else if (status === statusVals.WAIT_SEND) {
    type = isWaitStatus(sendTime) ? STATUS_EN_TYPES.WAIT : STATUS_EN_TYPES.INIT
  }
  return {
    type,
    name: STATUS_NAMES[type],
  }
}
const StatusItem = ({ name, type = 'init' }) => {
  return (
    <span
      className={cls({
        [styles['status-item']]: true,
        [styles[`${type}-status`]]: true,
      })}>
      {name}
    </span>
  )
}
export default ({ data = {}, statusVals}) => {
  const { name, type } = getRecordStatus(data, statusVals)
  return <StatusItem name={name} type={type} />
}
export { StatusItem }
