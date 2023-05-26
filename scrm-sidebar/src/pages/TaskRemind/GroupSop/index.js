import { useEffect, useContext, useMemo } from 'react'
import { useRequest } from 'ahooks'
import { isEmpty } from 'lodash'
import { Toast } from 'antd-mobile'
import moment from 'moment'
import { useSearchParams,useNavigate } from 'react-router-dom'
import { MobXProviderContext, observer } from 'mobx-react'
import { toJS } from 'mobx'
import GroupItem from 'components/GroupItem'
import { covertMassMsg } from 'src/utils/covertMsg'
import RemindCard from '../RemindCard'
import { GetPushDetail, UpdateSendStatus } from 'src/services/modules/groupSop'
import styles from './index.module.less'

/**
 * 群SOP
 * @param {String} ruleId 规则id
 * @param {String} executeAt 时间戳（秒）
 * @param {String} jobId 任务id
 */
 const SEND_STATUS = {
  DONE: 1,
  UN_DONE: 0,
  OVERDUE: 2,
}
export const SEND_STATUS_VALS = {
  1: 'done',
  0: 'unDone',
  2: 'overdue'
}
export default observer(() => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { UserStore } = useContext(MobXProviderContext)
  const {
    run: runGetPushDetail,
    data: pushData = {},
    loading,
    mutate
  } = useRequest(GetPushDetail, {
    manual: true
  })
  const ruleId = searchParams.get('ruleId')
  const executeAt = searchParams.get('executeAt')
  const jobId = searchParams.get('jobId')
  const userExtId = UserStore.userData.extId
  const executeAtStr = executeAt ? moment(executeAt * 1000).format('YYYY-MM-DD HH:mm:ss') : ''
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

  const { chatList, customerTitle } = useMemo(() => {
    const chatList = Array.isArray(pushData.chatList)
      ? pushData.chatList
      : []
    const [record] = chatList
    const firstCustomerName = record ? `${record.name}` : ''
    const suffixStr = firstCustomerName ? '等' : ''
    return {
      chatList,
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
      window.wx.invoke("shareToExternalChat", wxMsg, function(res) {
        if (res.err_msg === 'shareToExternalChat:ok') {
          UpdateSendStatus({
            ruleId,
            executeAt: executeAtStr,
            jobId,
            staffId: userExtId,
            // 已发送
            sendStatus: SEND_STATUS.DONE
          })
          mutate({
            ...pushData,
            todoStatus: SEND_STATUS.DONE
          })
        }
      })
    }
  }
 
  const shouldSend = useMemo(() => {
    return loading ? false : pushData.todoStatus === SEND_STATUS.UN_DONE
  }, [pushData.todoStatus, loading])
  return (
    <RemindCard
      title="管理员通知你发送消息给客户群"
      loading={loading}
      footer={shouldSend ? undefined : null}
      status={SEND_STATUS_VALS[pushData.todoStatus]}
      onClick={onSend}
      msg={pushData.msg}
      isEmpty={isEmpty(pushData.msg)}
      receiveTitle={`${customerTitle}${chatList.length}个客户群`}
      receiveContent={
        <>
          {chatList.map((ele) => {
            return (
              <GroupItem
                key={ele.id}
                data={ele}
                className={styles['customer-item']}
                extra={`共${ele.total}位成员`}
              />
            )
          })}
        </>
      }
    />
  )
})
