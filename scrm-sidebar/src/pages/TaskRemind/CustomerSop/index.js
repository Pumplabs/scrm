import { useEffect, useContext, useMemo } from 'react'
import { useRequest } from 'ahooks'
import { isEmpty } from 'lodash'
import { Toast } from 'antd-mobile'
import moment from 'moment'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { MobXProviderContext, observer } from 'mobx-react'
import { toJS } from 'mobx'
import WeChatCell from 'components/WeChatCell'
import RemindCard from '../RemindCard'
import { covertMassMsg } from 'src/utils/covertMsg'
import {
  GetPushDetail,
  UpdateSendStatus,
} from 'src/services/modules/customerSop'
import styles from './index.module.less'

const SEND_STATUS = {
  DONE: 1,
  UN_DONE: 0,
  OVERDUE: 2,
}
export const SEND_STATUS_VALS = {
  [SEND_STATUS.DONE]: 'done',
  [SEND_STATUS.UN_DONE]: 'unDone',
  [SEND_STATUS.OVERDUE]: 'overdue',
}
export default observer(() => {
  const [searchParams] = useSearchParams()
  const { UserStore } = useContext(MobXProviderContext)
  const navigate = useNavigate()
  const {
    run: runGetPushDetail,
    data: pushData = {},
    loading,
    mutate,
  } = useRequest(GetPushDetail, {
    manual: true,
  })
  const ruleId = searchParams.get('ruleId')
  const executeAt = searchParams.get('executeAt')
  const jobId = searchParams.get('jobId')
  const userExtId = UserStore.userData.extId
  const executeAtStr = executeAt
    ? moment(executeAt * 1000).format('YYYY-MM-DD HH:mm:ss')
    : ''
  useEffect(() => {
    if (!ruleId || !executeAt || !jobId) {
      navigate('/missingParam')
    } else {
      if (userExtId) {
        runGetPushDetail({
          ruleId,
          jobId,
          executeAt: executeAtStr,
          staffId: userExtId,
        })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userExtId])

  const { customerList, customerTitle } = useMemo(() => {
    const customerList = Array.isArray(pushData.customerList)
      ? pushData.customerList
      : []
    const [record] = customerList
    const firstCustomerName = record ? `${record.name}` : ''
    const suffixStr = firstCustomerName ? '等' : ''
    return {
      customerList,
      customerTitle: firstCustomerName
        ? `${firstCustomerName}${suffixStr}`
        : '',
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pushData.sopName])

  const onSend = () => {
    const isBeforeTime = moment().isBefore(moment(pushData.todoDeadlineTime))
    if(!isBeforeTime) {
      Toast.show({
        content: '糟糕，任务已经过期啦'
      })
      mutate({
        ...pushData,
        todoStatus: SEND_STATUS.OVERDUE
      })
      return
    }
    if (typeof window.wx.invoke === 'function') {
      const wxMsg = covertMassMsg(pushData.msg, toJS(UserStore.userData))
      window.wx.invoke(
        'shareToExternalContact',
        wxMsg,
        function (res) {
          if (res.err_msg === 'shareToExternalContact:ok') {
            UpdateSendStatus({
              ruleId,
              executeAt: executeAtStr,
              jobId,
              staffId: userExtId,
              sendStatus: SEND_STATUS.DONE,
            })
            mutate({
              ...pushData,
              todoStatus: SEND_STATUS.DONE,
            })
          }
        }
      )
    }
  }
  const shouldSend = useMemo(() => {
    return loading ? false : pushData.todoStatus === SEND_STATUS.UN_DONE
  }, [pushData.todoStatus, loading])

  return (
    <RemindCard
      title="管理员通知你发送消息给客户"
      onClick={onSend}
      status={SEND_STATUS_VALS[pushData.todoStatus]}
      footer={shouldSend ? undefined : null}
      loading={loading}
      msg={pushData.msg}
      isEmpty={isEmpty(pushData.msg)}
      receiveTitle={`${customerTitle}${customerList.length}名客户`}
      receiveContent={
        <>
          {customerList.map((ele) => {
            return (
              <WeChatCell
                key={ele.id}
                data={ele}
                className={styles['customer-item']}
              />
            )
          })}
        </>
      }
    />
  )
})
