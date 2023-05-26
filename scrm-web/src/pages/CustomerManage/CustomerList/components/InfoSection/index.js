import styles from './index.module.less'
export default ({ children, title }) => {
  return (
    <div className={styles['info-section']}>
      <p className={styles['info-section-title']}>{title}</p>
      <div className={styles['info-section-body']}>{children}</div>
    </div>
  )
}
