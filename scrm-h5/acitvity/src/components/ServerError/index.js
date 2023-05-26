import styles from './index.module.less'
export default ({code}) => {
  return (
    <div className={styles.page}>
     <div className={styles['page-body']}>
     <h2 className={styles['error-code']}>{code}</h2>
      <div>
        服务器内部错误
      </div>
     </div>
    </div>
  )
}