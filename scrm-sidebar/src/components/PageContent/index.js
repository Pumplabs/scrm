import cls from 'classnames'
import { Skeleton } from 'antd-mobile'
import styles from './index.module.less'
/**
 * @param {Number} headerHeight 顶部高度
 * @param {Number} footerHeight 底部高度
 */
export default ({
  header,
  footer,
  className,
  headerClassName,
  footerClassName,
  bodyClassName,
  style = {},
  children,
  loading,
  ...rest
}) => {
  const hasFooter = footer
  return (
    <div
      className={cls({
        [styles['page']]: true,
        [styles['has-footer']]: hasFooter,
        [styles['page-with-header']]: header,
        [className]: className,
      })}
      {...rest}>
      {header ? (
        <div
          className={cls({
            [styles['page-header']]: true,
            [headerClassName]: headerClassName
          })}>
          {header}
        </div>
      ) : null}
      <div
        className={cls({
          [styles['page-body']]: true,
          [bodyClassName]: bodyClassName,
        })}
        style={{
          ...style,
        }}>
        {loading ? (
          <div className={styles['skeleton-body']}>
            <Skeleton.Title animated />
            <Skeleton.Paragraph lineCount={5} animated />
          </div>
        ) : (
          children
        )}
      </div>
      {hasFooter ? (
        <div
          className={cls({
            [styles['page-footer']]: true,
            [footerClassName]: footerClassName,
          })}>
          {footer}
        </div>
      ) : null}
    </div>
  )
}
