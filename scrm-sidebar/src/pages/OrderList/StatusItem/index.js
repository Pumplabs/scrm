import cls from 'classnames'
import styles from './index.module.less'
const StatusItem = ({ children, className, color }) => {
  return (
    <span
      className={cls({
        [styles['status-item']]: true,
        [styles[`status-color-${color}`]]: color,
        [className]: className,
      })}>
      {children}
    </span>
  )
}
export default StatusItem