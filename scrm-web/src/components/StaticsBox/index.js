import cls from 'classnames'
import styles from './index.module.less'
export default (props) => {
  const { dataSource = [], className, ...rest } = props
  const width = dataSource.length ? 100 / dataSource.length : 100
  return (
    <div className={cls({
      [styles.box]: true,
      [styles.clear]: true,
      [className]: className
    })}
      {...rest}
    >
      {
        dataSource.map((ele, idx) => (
          <div key={idx}
            className={styles.boxItem}
            style={{ width: `${width}%` }}
          >
            <div className={styles.label}>
              {ele.label}
            </div>
            <p className={styles.desc}>
              {ele.desc}
            </p>
          </div>
        ))
      }
    </div>
  )
}