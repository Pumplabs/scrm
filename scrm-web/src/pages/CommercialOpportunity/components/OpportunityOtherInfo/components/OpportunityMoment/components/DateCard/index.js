import cls from 'classnames'
import styles from './index.module.less'
export default ({ children, headerClassName, date }) => {
  return (
    <div className={styles['date-item']}>
      <div className={cls({
        [styles['date-item-header']]: true,
        [headerClassName]: headerClassName
      })}>
        {date}
      </div>
      <div className={styles['date-item-body']}>{children}</div>
    </div>
  )
}
