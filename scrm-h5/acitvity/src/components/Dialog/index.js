
import styles from './index.module.less';
export default (props) => {
  const {title, children, onClose, visible} = props

  return (
    <div className={styles.dialog} style={{display: visible ? 'block' : "none"}}>
      <div className={styles['dialog-mask']}>
      </div>
      <div className={styles['dialog-content']}>
        <div className={styles['dialog-header']}>
          <span className={styles['dialog-title']}>{title}</span>
          <div className={styles['dialog-header-extra']}>
          <span className={styles['close-icon']} onClick={onClose}>&times;</span>
          </div>
        </div>
        <div className={styles['dialog-body']}>
          {children}
        </div>
      </div>
    </div>
  )
}