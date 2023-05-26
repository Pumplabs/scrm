import cls from 'classnames'
import styles from './index.module.less'
export default ({title, className, children }) => {
  return (
    <div className={cls({
      [styles['select-section']]: true,
      [className]: className
    })}>
      <p className={styles['select-title']}>
        {title}
      </p>
      <div className={styles['select-content']}>
        {children}
      </div>
    </div>
  )
}