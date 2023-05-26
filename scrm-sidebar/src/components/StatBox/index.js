import cls from 'classnames'
import styles from './index.module.less'
const StatBox = ({ children, className }) => {
  return (
    <ul
      className={cls({
        [styles['stat-box']]: true,
        [className]: className,
      })}>
      {children}
    </ul>
  )
}
const StatItem = ({ className, label, children }) => {
  return (
    <li
      className={cls({
        [styles['stat-item']]: true,
        [className]: className,
      })}>
      <div className={styles['stat-item-content']}>{children}</div>
      <label className={styles['stat-item-label']}>{label}</label>
    </li>
  )
}
StatBox.Item = StatItem
export default StatBox
