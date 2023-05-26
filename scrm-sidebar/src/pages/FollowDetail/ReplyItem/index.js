import { useMemo, useContext } from 'react'
import { get } from 'lodash'
import moment from 'moment'
import cls from 'classnames'
import { observer, MobXProviderContext } from 'mobx-react'
import { UserName } from 'src/pages/FollowList'
import styles from './index.module.less'

const getContentText = (data = {}) => {
  const textArr = data.text || []
  return textArr[0] ? textArr[0].content : ''
}

const ReplyItem = observer(
  ({ data = {}, followCreatorId, onRemove, onClick }) => {
    const { UserStore } = useContext(MobXProviderContext)

    const handleRemove = (e) => {
      e.stopPropagation()
      if (typeof onRemove === 'function') {
        onRemove(data)
      }
    }
    const handleClick = () => {
      if (typeof onClick === 'function') {
        onClick(data)
      }
    }
    const { dateStr, timeStr } = useMemo(() => {
      let dateStr = ''
      let timeStr = ''
      if (data.createdAt) {
        const time = moment(data.createdAt)
        dateStr = time.format('M-DD')
        timeStr = time.format('HH:mm')
      }
      return {
        timeStr,
        dateStr,
      }
    }, [data.createdAt])
    // 如果是回复跟进，则被回复人则为创建人
    const beReplyExtId = data.hasReplyFollow
      ? followCreatorId
      : get(data, 'beReplyInfo.creatorExtId')
    return (
      <li className={styles['follow-reply-item']} onClick={handleClick}>
        <p className={styles['follow-reply-item-header']}>
          <span className={styles['reply-info']}>
            <span
              className={cls({
                [styles['user-name']]: true,
                [styles['reply-staff']]: true,
              })}>
              <UserName userId={data.creatorExtId} />
            </span>
            回复
            <span className={styles['be-reply-staff']}>
              <UserName userId={beReplyExtId} />
            </span>
          </span>
          <span className={styles['reply-time']}>
            <span className={styles['reply-date']}>{dateStr}</span>
            <span className={styles['reply-time']}>{timeStr}</span>
          </span>
        </p>
        <div className={styles['follow-reply-text']}>
          {getContentText(data.content)}
        </div>
        {data.creatorExtId === UserStore.userData.extId ? (
          <p className={styles['follow-reply-actions']}>
            <span className={styles['remove-action']} onClick={handleRemove}>
              删除
            </span>
          </p>
        ) : null}
      </li>
    )
  }
)
export default ReplyItem