import styles from './index.module.less';
export default ({label, children}) => {
  return (
    <div className={styles['description-item']}>
      <p className={styles['item-label']}>
        {label}
      </p>
      <div className={styles['item-content']}>
        {children}
      </div>
    </div>
  )
}