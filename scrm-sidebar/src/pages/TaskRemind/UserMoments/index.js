import { useEffect, useContext, useMemo, useState } from 'react'
import { useRequest } from 'ahooks'
import { isEmpty } from 'lodash'
import moment from 'moment'
import { toJS } from 'mobx'
import { Toast } from 'antd-mobile'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { MobXProviderContext, observer } from 'mobx-react'
import { convertMomentMsg } from 'src/utils/covertMsg'
import WeChatCell from 'components/WeChatCell'
import RemindCard, { Footer } from '../RemindCard'
import {
  GetPushDetail,
  UpdateSendStatus,
} from 'src/services/modules/customerSop'
import { SEND_STATUS_VALS } from '../CustomerSop'
import styles from './index.module.less'

const SEND_STATUS = {
  DONE: 1,
  UN_DONE: 0,
  OVERDUE: 2,
}
export default observer(() => {
  const [searchParams] = useSearchParams()
  const { UserStore } = useContext(MobXProviderContext)
  const [isAllowSend, setIsAllowSend] = useState(false)
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
  const checkApi = () => {
    window.wx.checkJsApi({
      jsApiList: ['shareToExternalMoments'], // 需要检测的JS接口列表
      success: function (res) {
        if (res.checkResult) {
          setIsAllowSend(res.checkResult['shareToExternalMoments'])
        }
      },
    })
  }
  useEffect(() => {
    if (!ruleId || !executeAt || !jobId) {
      navigate('/missingParam')
    } else {
      if (userExtId) {
        checkApi()
        // document.title = '群发助手'
        runGetPushDetail({
          ruleId,
          executeAt: executeAtStr,
          jobId,
          staffId: userExtId,
          sendStatus: SEND_STATUS.DONE,
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

  const shareMoments = () => {
    const msg = convertMomentMsg(pushData.msg, toJS(UserStore.userData))
    window.wx.invoke('shareToExternalMoments', msg, function (res) {
      if (res.err_msg === 'shareToExternalMoments:ok') {
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
      } else {
        console.log('发送失败', res)
      }
    })
  }

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
    shareMoments()
  }

  const shouldSend = useMemo(() => {
    return loading ? false : pushData.todoStatus === SEND_STATUS.UN_DONE
  }, [pushData.todoStatus, loading])

  return (
    <RemindCard
      title="管理员通知你发布内容到客户的朋友圈"
      receiveTitle={`${customerTitle}${customerList.length}名客户`}
      loading={loading}
      msg={pushData.msg}
      status={SEND_STATUS_VALS[pushData.todoStatus]}
      isEmpty={isEmpty(pushData.msg)}
      footer={
        shouldSend ? (
          <>
            {isAllowSend ? (
              <Footer onClick={onSend} text="前往发布" />
            ) : (
              <Footer>如需发布内容,请在手机端中打开提醒</Footer>
            )}
          </>
        ) : null
      }
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
