import styles from './index.module.less'

export default (props) => {
  const { description, icon, children} = props
  return (
    <div className={styles['page']}>
      <div className={styles.iconWrap}>{icon}</div>
      {children === undefined ? <p className={styles['description-text']}>{description}</p> : children}
    </div>
  )
}
