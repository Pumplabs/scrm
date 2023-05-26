import styles from './index.module.less'
export default ({ data = {}}) => {
  return (
    <div className={styles['text-item']}>
      <p className={styles['text-name']}>
        {data.title}
      </p>
      <p className={styles['text-content']}>
        {data.content}
      </p>
    </div>
  )
}