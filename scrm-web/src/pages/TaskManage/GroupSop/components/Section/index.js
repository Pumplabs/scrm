import styles from './index.module.less'

export default ({title, children }) => {
  return (
    <div className={styles['section']}>
      <div className={styles['section-header']}>
       {title}
      </div>
      <div className={styles['section-body']}>
    {children}
</div>
    </div>
  )
}