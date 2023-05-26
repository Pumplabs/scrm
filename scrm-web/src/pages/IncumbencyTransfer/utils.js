import { Modal, message } from 'antd'
import moment from 'moment'
import { getRequestError } from 'services/utils'
import { SUCCESS_CODE } from 'src/utils/constants'

export const handleHandleStatus = (record) => {
  const {status, createTime } = record
  const createDate = moment(createTime)
  const isSameDate = moment().isSame(createDate, 'days')
  switch (status) {
    case 1:
      return '已转接'
    case 2:
      return `${isSameDate ? '明天': '今天'}${createDate.format('HH:mm')}接替`
    case 3:
      return '客户已拒绝'
    case 4:
      return '接替成员客户达到上限'
    case 5:
      return '无接替记录'
    default:
      return '-'
  }
}

export const transferRequestData = ({ successFn }) => {
  return {
    onSuccess: (res) => {
      if (res.code === SUCCESS_CODE && res.data) {
        const { succeedTotal, failTotal } = res.data
        const total = succeedTotal + failTotal
        if (total > 1 && failTotal) {
          Modal.info({
            title: '提示',
            content: `操作成功:${succeedTotal}条,操作失败:${failTotal}条`,
            onOk: () => {
              if (succeedTotal > 0 && typeof successFn === 'function') {
                successFn()
              }
            },
          })
        } else {
          if (succeedTotal > 0) {
            message.success('分配成功')
            if (typeof successFn === 'function') {
              successFn()
            }
          } else {
            message.error('分配失败')
          }
        }
      } else {
        message.error(res.msg || '分配失败')
      }
    },
    onError: (e) => getRequestError(e, `分配失败`)
  }
}
