import cls from 'classnames'
import { useMemo } from 'react'
import { Tooltip } from 'antd'
import OpenEle from 'components/OpenEle'
import GroupChatCover from 'components/GroupChatCover'
import styles from './index.module.less'
import { UNSET_GROUP_NAME } from 'utils/constants'

/**
 * @typedef {Object} Data
 @property {string} title
 */




/**
 * @param  {Data} data
 * @param {String} name 群组名称
 * @param {Object} ownerInfo 群主信息
 */
export default ({ data, needCount, borded = true, style, needOwner = true }) => {
  if (!data) {
    return null
  }
  const ownerEle = useMemo(() => {
    return <OpenEle type="userName" openid={data.owner} />
  }, [data.owner])
  return (
    <div
      className={cls({
        [styles['group-item']]: true,
        [styles.border]: borded,
      })}
      style={style}>
      <GroupChatCover className={styles['group-avatar']} width={40} size={28} />
      <div
        className={cls({
          [styles['group-name-row']]: true,
          [styles['group-need-count']]: needCount,
        })}>
        <Tooltip title={data.name} placement="topLeft">
          <span className={styles['group-name']}>{data.name || UNSET_GROUP_NAME}</span>
        </Tooltip>
        {needCount ? (
          <span className={styles['user-count']}>({data.total})</span>
        ) : null}
      </div>
      {
        needOwner ? (
          <span className={styles['owner-text']}>
            群主：
            <Tooltip title={ownerEle} placement="topLeft">
              <span className={styles['owner-name']}>{ownerEle}</span>
            </Tooltip>
          </span>
        ) : null
      }
    </div>
  )
}
