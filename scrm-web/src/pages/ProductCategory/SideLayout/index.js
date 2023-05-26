import cls from 'classnames'
import styles from './index.module.less'
export default ({ left, children, leftClassName }) => {
  return (
    <div className={styles['side-layout']}>
      <div
        className={cls({
          [styles['side-layout-left']]: true,
          [leftClassName]: leftClassName,
        })}>
        {left}
      </div>
      <div className={styles['side-layout-right']}>{children}</div>
    </div>
  )
}
