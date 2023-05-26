import { useMemo } from 'react'
import cls from 'classnames'
import { get } from 'lodash'
import moment from 'moment'
import OpenEle from 'components/OpenEle'
import CustomerText from 'components/CustomerText'
import MaterialItem from '../MaterialItem'
import FollowItem from '../FollowItem'
import { MOMENT_STATUS } from '../../constants'
import { getDiffStr } from 'src/utils'
import styles from './index.module.less'

const getTypeName = (type) => {
  switch (type) {
    case MOMENT_STATUS.CUSTOMER_ADD_STAFF:
    case MOMENT_STATUS.STAFF_ADD_CUSTOMER:
      return '添加好友'
    case MOMENT_STATUS.CUSTOMER_DELETE:
    case MOMENT_STATUS.DELETE_CUSTOMER:
      return '删除好友'
    case MOMENT_STATUS.JOIN_GROUP_CHAT:
      return '加入群聊'
    case MOMENT_STATUS.EXIT_GROUP_CHAT:
      return '退出群聊'
    case MOMENT_STATUS.STAGE_ADD:
      return '阶段添加'
    case MOMENT_STATUS.STAGE_UPDATE:
      return '阶段变化'
    case MOMENT_STATUS.STAGE_DELETE:
      return '阶段移除'
    case MOMENT_STATUS.MARK_TAG:
      return '打标签'
    case MOMENT_STATUS.CHECK:
      return '查看素材'
    case MOMENT_STATUS.FISSION_FRIENDS:
      return '参加好友裂变'
    case MOMENT_STATUS.FOLLOW:
      return '客户跟进'
    default:
      return '未知类型'
  }
}

const MomentWrap = ({ children, time, type }) => {
  return (
    <div className={styles['moment-item-wrap']}>
      <div className={styles['moment-wrap-header']}>
        <label
          className={cls({
            [styles['moment-tag']]: true,
            [styles['add-user']]:
              type === MOMENT_STATUS.CUSTOMER_ADD_STAFF ||
              type === MOMENT_STATUS.STAFF_ADD_CUSTOMER,
            [styles['remove-user']]:
              type === MOMENT_STATUS.CUSTOMER_DELETE ||
              type === MOMENT_STATUS.DELETE_CUSTOMER,
            [styles['join-group']]: type === MOMENT_STATUS.JOIN_GROUP_CHAT,
            [styles['exit-group']]: type === MOMENT_STATUS.EXIT_GROUP_CHAT,
            [styles['add-stage']]: type === MOMENT_STATUS.STAGE_ADD,
            [styles['change-stage']]: type === MOMENT_STATUS.STAGE_UPDATE,
            [styles['remove-stage']]: type === MOMENT_STATUS.STAGE_DELETE,
            [styles['remark-tag']]: type === MOMENT_STATUS.MARK_TAG,
            [styles['look-material']]: type === MOMENT_STATUS.CHECK,
            [styles['join-activity']]: type === MOMENT_STATUS.FISSION_FRIENDS,
            [styles['follow-customer']]: type === MOMENT_STATUS.FOLLOW,
          })}>
          {getTypeName(type)}
        </label>
        <span className={styles['moment-time']}>{time}</span>
      </div>
      <div className={styles['moment-wrap-content']}>{children}</div>
    </div>
  )
}
const MomentContent = ({ momentData }) => {
  const info = momentData.info ? momentData.info : {}
  const groupName = (
    <span style={{ margin: '0 4px' }}>
      {info.chatName ? `"${info.chatName}"` : ''}
    </span>
  )
  const customerEle = (
    <CustomerText
      className={styles['customer-text']}
      data={momentData.wxCustomer}
    />
  )
  const staffEle = (
    <OpenEle
      type="userName"
      openid={momentData.extStaffId}
      style={{ fontWeight: 600 }}
    />
  )
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
          {customerEle}被{staffEle}
          打了
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
          {customerEle}在
          <span className={styles['new-text']}>{momentData.taskName}</span>
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

export default ({ data = {}, onFollowDetail }) => {
  const timeStr = useMemo(() => {
    return data.createdAt
      ? moment(data.createdAt).format('YYYY/MM/DD HH:mm')
      : ''
  }, [data.createdAt])

  const handleFollowDetail = () => {
    if (typeof onFollowDetail === 'function') {
      onFollowDetail(data)
    }
  }
  return (
    <MomentWrap type={data.type} time={timeStr}>
      <MomentContent momentData={data} />
      {data.type === MOMENT_STATUS.CHECK ? (
        <div className={styles['moment-material']}>
          <MaterialItem data={get(data, 'info.mediaInfo')} />
        </div>
      ) : null}
      {data.type === MOMENT_STATUS.FOLLOW ? (
        <FollowItem data={get(data, 'info')} onDetail={handleFollowDetail} />
      ) : null}
      {/* 素材 */}
    </MomentWrap>
  )
}
