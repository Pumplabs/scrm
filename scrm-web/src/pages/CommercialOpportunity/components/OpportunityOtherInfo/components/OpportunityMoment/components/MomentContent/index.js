import cls from 'classnames'
import styles from './index.module.less'
const Content = ({ header, children, bodyClassName, headerClassName }) => {
  return (
    <div className={styles['moment-content']}>
      <div className={cls({
        [styles['moment-content-header']]: true,
        [headerClassName]: headerClassName
      })}>{header}</div>
      <div className={cls({
        [styles['moment-content-body']]: true,
        [bodyClassName]: bodyClassName
      })}>{children}</div>
    </div>
  )
}
export default Content