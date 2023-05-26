import styles from './index.module.less'
const StepItem = ({ title, children }) => {
  return (
    <div className={styles['step-item']}>
      <div className={styles['step-item-left']}>
        <div className={styles['step-item-title']}>{title}</div>
      </div>
      <div className={styles['step-item-content']}>{children}</div>
    </div>
  )
}
export default StepItem
