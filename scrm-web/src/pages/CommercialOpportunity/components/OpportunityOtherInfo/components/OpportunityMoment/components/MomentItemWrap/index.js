import cls from 'classnames'
import styles from './index.module.less'

/**
 *
 * @param {String} tagName 标签名称
 * @param {String} tagClassName 标签类名
 * @param {ReactNode} extra 顶部其它信息
 * @param {String} className
 * @param {ReactNode} children
 * @param {ReactNode} footer
 */
export default (props = {}) => {
  const { tagName, children, footer, extra, className, tagClassName } = props
  return (
    <div
      className={cls({
        [styles['moment-item']]: true,
        [styles['moment-item-with-footer']]: footer,
        [className]: className,
      })}>
      {tagName || extra ? (
        <div className={styles['moment-item-header']}>
          <span
            className={cls({
              [styles['moment-tag']]: true,
              [tagClassName]: tagClassName,
            })}>
            {tagName}
          </span>
          <div className={styles['moment-item-extra']}>{extra}</div>
        </div>
      ) : null}
      <div className={styles['moment-item-body']}>{children}</div>
      {footer ? (
        <div className={styles['moment-item-footer']}>{footer}</div>
      ) : null}
    </div>
  )
}
