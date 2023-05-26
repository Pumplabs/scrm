import { useEffect, useState } from 'react'
import { get, isEmpty } from 'lodash'
import StepItem from '../StepItem'
import OpenEle from 'components/OpenEle'
import CustomerText from 'components/CustomerText'
import { LinkCell } from 'components/WeChatMsgEditor/MsgCell'
import { MOMENT_STATUS } from '../constants'
import { getFileUrl } from 'src/utils'
import { getDiffStr } from 'src/utils/times'
import styles from './index.module.less'

const getMarkTagActionName = (info, staffEle) => {
  // 轨迹素材
  if (info.tagOrigin === 'media') {
    return `因查看素材被打上`
  } else if (info.tagOrigin === 'joinTask') {
    // 参加任务宝的活动
    return `因参加活动被打上`
  } else if (info.tagOrigin === 'finishTask') {
    // 完成任务宝的活动
    return `因完成活动被打上`
  } else if (info.tagOrigin === 'contact') {
    // 渠道活码
    return `通过扫描渠道码被打上`
  } else if (info.tagOrigin === 'manual') {
    // 人打的
    return <>被{staffEle}打了</>
  } else {
    return '被系统打上'
  }
}
const getMomentTitle = (momentData, avatarData) => {
  const info = momentData.info ? momentData.info : {}
  const groupName = (
    <span style={{ margin: '0 4px' }}>
      {info.chatName ? `"${info.chatName}"` : ''}
    </span>
  )
  const customerEle = (
    <CustomerText
      className={styles['customer-text']}
      data={isEmpty(avatarData) ? momentData.wxCustomer : avatarData}
    />
  )
  const staffEle = <OpenEle type="userName" openid={momentData.extStaffId} />
  switch (momentData.type) {
    case MOMENT_STATUS.CUSTOMER_ADD_STAFF:
      return (
        <>
          {customerEle}
          添加了
          {staffEle}
          为好友
        </>
      )
    case MOMENT_STATUS.STAFF_ADD_CUSTOMER:
      return (
        <>
          {staffEle}
          添加了{customerEle}
          为好友
        </>
      )
    case MOMENT_STATUS.CUSTOMER_DELETE:
      return (
        <>
          {customerEle}
          删除了{staffEle}
          好友
        </>
      )
    case MOMENT_STATUS.DELETE_CUSTOMER:
      return (
        <>
          {staffEle}
          删除了{customerEle}
          好友
        </>
      )
    case MOMENT_STATUS.JOIN_GROUP_CHAT:
      return (
        <>
          {customerEle}
          进入了群聊{groupName}
        </>
      )
    case MOMENT_STATUS.EXIT_GROUP_CHAT:
      return (
        <>
          {customerEle}
          退出了群聊{groupName}
        </>
      )
    case MOMENT_STATUS.STAGE_ADD:
      return (
        <>
          {customerEle}被{staffEle}
          添加"<span className={styles['new-text']}>{info.journeyName}</span>
          "客户旅程的
          <span className={styles['new-text']}>{info.newStageName}</span>阶段
        </>
      )
    case MOMENT_STATUS.STAGE_UPDATE:
      return (
        <>
          {customerEle}从
          <span className={styles['new-text']}>{info.journeyName}</span>旅程的
          <span className={styles['old-text']}>{info.oldStageName}</span>
          阶段进入
          <span className={styles['new-text']}>{info.newStageName}</span>阶段
        </>
      )
    case MOMENT_STATUS.STAGE_DELETE:
      return (
        <>
          {customerEle}被{staffEle}从{info.journeyName}旅程的
          {info.newStageName}阶段移除
        </>
      )
    case MOMENT_STATUS.MARK_TAG:
      return (
        <>
          {customerEle}
          {getMarkTagActionName(info, staffEle)}
          {Array.isArray(info.tags)
            ? info.tags.map((tagItem, idx) => (
                <span key={tagItem.id}>
                  {idx === 0 ? '' : ','}
                  <span className={styles['new-text']}>"{tagItem.name}"</span>
                </span>
              ))
            : ''}
          标签
        </>
      )
    case MOMENT_STATUS.CHECK:
      return (
        <>
          {customerEle}
          查看
          <span className={styles['new-text']}>
            {get(info, 'mediaInfo.title')}
          </span>
          素材，
          {getDiffStr(momentData.mediaSeconds)}
        </>
      )
    case MOMENT_STATUS.FISSION_FRIENDS:
      return (
        <>
          {customerEle}在 "
          <span className={styles['new-text']}>{info.taskName}</span>"
          活动中生成了海报
        </>
      )
    case MOMENT_STATUS.FOLLOW:
      return (
        <>
          {staffEle}跟进了{customerEle}
        </>
      )
    default:
      return ''
  }
}

const DateDynamicCard = ({ data = {}, avatarData }) => {
  return (
    <div key={data.date} className={styles['date-dynamic']}>
      <p className={styles['date']}>{data.date}</p>
      {data.list.map((ele) => (
        <StepItem key={ele.id} data={ele} title={ele.actionName}>
          <div className={styles['moment-content']}>
            <p className={styles['moment-content-operation']}>
              {getMomentTitle(ele, avatarData)}
            </p>
            {/* 如果为素材类型 */}
            {ele.type === MOMENT_STATUS.CHECK ? <FileItem data={ele} /> : null}
            {ele.type === MOMENT_STATUS.FOLLOW ? (
              <FollowItem data={get(ele, 'info')} />
            ) : null}
          </div>
        </StepItem>
      ))}
    </div>
  )
}

const FileItem = ({ data = {} }) => {
  const [coverUrl, setCoverUrl] = useState('')
  const fileId = get(data, 'info.mediaInfo.fileId')
  const getCoverUrl = async () => {
    const urls = await getFileUrl({ ids: [fileId] })
    setCoverUrl(urls[fileId])
  }
  useEffect(() => {
    if (fileId) {
      getCoverUrl()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId])

  return (
    <div className={styles['metrial-item']}>
      <LinkCell
        data={{
          file: coverUrl
            ? [
                {
                  thumbUrl: coverUrl,
                },
              ]
            : [],
          name: get(data, 'info.mediaInfo.title'),
          info:
            get(data, 'info.mediaInfo.description') ||
            get(data, 'info.mediaInfo.summary'),
        }}
      />
    </div>
  )
}
const FollowItem = ({ data = {} }) => {
  const followInfo = data ? data : {}
  return (
    <div className={styles['follow-item']}>
      <div className={styles['follow-text']}>{followInfo.followContent}</div>
      跟进内容
    </div>
  )
}
export default DateDynamicCard
