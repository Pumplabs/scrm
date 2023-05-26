import { useContext } from 'react'
import moment from 'moment'
import cls from 'classnames'
import { get } from 'lodash'
import {
  DeleteOutline,
  EditSOutline,
  MessageOutline,
  LinkOutline,
} from 'antd-mobile-icons'
import { MobXProviderContext, observer } from 'mobx-react'
import iconMsgUrl from 'src/assets/images/icon/icon_msg.png'
import styles from './index.module.less'
/**
 * @param {Object} data 数据
 * @param {Function(data)}  onReply 点击回复
 * @param {Function(data)} onRemove 点击删除
 *
 */
export default observer(
  ({ onReply, className, data = {}, onRemove, onEdit }) => {
    const { UserStore } = useContext(MobXProviderContext)
    const handleRemove = (e) => {
      e.stopPropagation()
      if (typeof onRemove === 'function') {
        onRemove(data)
      }
    }
    const handleEdit = (e) => {
      e.stopPropagation()
      if (typeof onEdit === 'function') {
        onEdit(data)
      }
    }
    const handleReply = (e) => {
      e.stopPropagation()
      if (typeof onReply === 'function') {
        onReply(data)
      }
    }
    const mediaList = get(data, 'content.media') || []
    return (
      <div
        className={cls({
          [styles['follow-moment-footer']]: true,
          [className]: className,
        })}>
        <div className={styles['footer-actions']}>
          {data.staff &&
          data.staff.extId &&
          data.staff.extId === UserStore.userData.extId ? (
            <>
              <DeleteOutline
                className={styles['moment-del']}
                onClick={handleRemove}
              />
            </>
          ) : null}
          <NumItem icon={<LinkOutline className={styles['num-icon']} />}>
            {mediaList.length}
          </NumItem>
          <NumItem
            icon={<MessageOutline className={styles['num-icon']} />}
            onClick={handleReply}>
            {data.replyNum || 0}
          </NumItem>
        </div>
      </div>
    )
  }
)

const NumItem = ({ icon, children, onClick }) => {
  return (
    <span className={styles['num-item']} onClick={onClick}>
      {icon}
      <span className={styles['num-text']}>{children}</span>
    </span>
  )
}
const handleTime = (timeStr) => {
  if (timeStr) {
    const time = moment(timeStr)
    const yesterday = moment().subtract(1, 'days')
    const today = moment()
    const dateTimeStr = `${time.format('HH:mm')}`
    if (today.isSame(time, 'days')) {
      return {
        date: '今天',
        time: dateTimeStr,
      }
    } else if (yesterday.isSame(time, 'days')) {
      return {
        date: '昨天',
        time: dateTimeStr,
      }
    } else {
      return {
        date: time.format('MM-DD'),
        time: dateTimeStr,
      }
    }
  } else {
    return {
      date: '',
      time: '',
    }
  }
}

export const FollowTime = ({ createdAt }) => {
  const { date, time } = handleTime(createdAt)
  return (
    <span className={styles['send-time']}>
      <span className={styles['send-time-date']}>{date}</span>
      <span className={styles['send-time-time']}>{time}</span>
    </span>
  )
}
