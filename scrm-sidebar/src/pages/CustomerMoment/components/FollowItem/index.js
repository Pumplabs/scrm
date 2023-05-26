import styles from './index.module.less'
export default ({ data = {}, onDetail }) => {
  return (
    <div className={styles['follow-item']} onClick={onDetail}>
      <div className={styles['follow-text']}>
        {data.followContent}
      </div>
    </div>
  )
}
