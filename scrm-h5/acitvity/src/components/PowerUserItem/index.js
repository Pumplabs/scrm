import cls from 'classnames'
import infoCircle from 'src/assets/image/info-circle.png'
import styles from './index.module.less'
const STATUS_EN = {
  // 助力成功
  SUCCESS: 1,
  // 不是首次添加
  NOT_FIRST: 2,
  // 删掉了
  REMOVE: 3,
}
const ERROR_TIP = {
  [STATUS_EN.NOT_FIRST]: '该好友已经是企业员工的客户了',
  [STATUS_EN.REMOVE]: '该好友已经删除企业员工了',
}
const PowerUserItem = ({ data = {} }) => {
  const isSuccess = data.hasFirst && !data.hasDeleted
  return (
    <div className={styles['power-user-item']}>
      <div className={styles['power-user-avatar']}>
        <img alt="" src={data.customer ? data.customer.avatar : ''} />
        <span>{data.customer ? data.customer.name : ''}</span>
      </div>
      <div className={styles['power-user-status']}>
        <span
          className={cls({
            [styles['power-status']]: true,
            [styles['power-success-status']]: isSuccess,
            [styles['power-fail-status']]: !isSuccess,
          })}>
          {data.status === STATUS_EN.SUCCESS ? '助力成功' : '助力失败'}
        </span>
        {!isSuccess && ERROR_TIP[data.status] ? (
          <p className={styles['error-text']}>
            <img src={infoCircle} alt="" className={styles['info-icon']} />
            <span>{ERROR_TIP[data.status]}</span>
          </p>
        ) : null}
        <p className={styles['power-time']}>{data.createdAt}</p>
      </div>
    </div>
  )
}
export default PowerUserItem
