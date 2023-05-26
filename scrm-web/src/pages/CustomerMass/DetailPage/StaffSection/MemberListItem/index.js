import cls from 'classnames'
import { Button } from 'antd'
import OpenEle from 'components/OpenEle'
import defaultAvatorUrl from 'assets/images/defaultAvator.jpg'
import { MEMBER_STATUS_CN, MEMBER_STATUS_EN } from '../../constants'
import styles from './index.module.less'
const MemberListItem = ({ onRemind, data }) => {
  const handleRemind = () => {
    if (typeof onRemind === 'function') {
      onRemind(data)
    }
  }
  return (
    <div className={cls({
      [styles.memberListItem]: true,
      [styles['unsend']]: MEMBER_STATUS_EN.WAIT_SEND === data.status,
      [styles['send']]: data.status === MEMBER_STATUS_EN.SEND,
      [styles['fail']]: data.status === MEMBER_STATUS_EN.FAIL
    })}>
      <img
        src={data.avatarUrl ? data.avatarUrl : defaultAvatorUrl}
        className={styles.memberAvatar}
        alt=""
      />
      <div className={styles['nickname-box']}>
        <p className={styles['nickname-text']}>
          <span className={styles['nickname']}>
            <OpenEle type="userName" openid={data.name} />
          </span>
          <span
            className={cls({
              [styles['status-item']]: true,
            })}>
            {MEMBER_STATUS_CN[data.status]}
          </span>
        </p>
        <p className={styles['desc-text']}>共{data.customerCount}个好友</p>
      </div>
      {typeof onRemind === 'function' ? (
        <Button
          type="primary"
          ghost
          className={styles['remind-btn']}
          onClick={handleRemind}>
          提醒
        </Button>
      ) : null}
    </div>
  )
}

export default MemberListItem