import styles from './index.module.less'
export default ({ onClick, name }) => {
  return (
    <div className={styles['footer']}>
      <div className={styles['btn']} onClick={onClick}>
        {name}
      </div>
    </div>
  )
}
