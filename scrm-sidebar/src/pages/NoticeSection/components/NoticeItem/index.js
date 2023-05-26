import cls from 'classnames'
import styles from './index.module.less'
const NoticeItem = ({ className, hasRead, header, children, ...rest }) => {
  return (
    <div
      className={cls({
        [styles['notice-item']]:true,
        [styles['unread']]: !hasRead,
        [className]: className,
      })}
      {...rest}>
      <div className={styles['notice-item-header']}>{header}</div>
      {children}
    </div>
  )
}
export default NoticeItem
