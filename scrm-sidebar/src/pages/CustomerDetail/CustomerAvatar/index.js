import cls from 'classnames'
import UserIcon from 'components/UserIcon'
import styles from './index.module.less'

/**
 *
 * @param {String} avatarUrl 用户头像
 * @param {String} corpName 企业名称
 * @param {String} ninkname 昵称
 * @param {String} remark 备注
 * @returns
 */
const CustomerAvatar = (props) => {
  const { avatarUrl, corpName = '', ninkname = '', remark = '' } = props
  const companyName = corpName ? corpName : '微信'
 
  return (
    <div className={styles['customer-avatar']}>
      <UserIcon
        src={avatarUrl}
        className={styles['avatar-img']}
        size="middle"
      />
      <div>
        <p
          className={cls({
            [styles['user-name-row']]: true,
            [styles['wechat']]: !corpName,
            [styles['company']]: corpName,
          })}>
          <span className={styles['user-remark']}>{remark}</span>
          {`@${companyName}`}
        </p>
        <p>昵称:{ninkname}</p>
      </div>
    </div>
  )
}
export default CustomerAvatar
