import cls from 'classnames'
import { Empty } from 'antd'
import styles from './index.module.less'

const TransferCol = (props) => {
  const { className, title, titleExtra, list = [], renderItem, footer, children, contentProps = {} } = props
  const { className: contentCls, ...contentRest } = contentProps
  return (
    <div
      className={
        cls({
          [styles.transferCol]: true,
          'wy-transfer': true,
          [className]: className
        })
      }
    >
      <div
        className={styles.transferHeader}
      >
        <div
          className={styles.transferTitle}
        >
          {title}
        </div>
        <div
          className={styles.transferExtra}
        >
          {titleExtra}
        </div>
      </div>
      <ul
        className={cls({
          [styles.transferContent]: true,
          [styles.emptyContent]: !list.length,
          [contentCls]: contentCls
        })}
        {...contentRest}
      >
        {
          children ? (
            children
          ) : (
            <>
              {list.map((ele, idx) => {
                if (typeof renderItem === 'function') {
                  return renderItem(ele, idx)
                } else {
                  return null
                }
              })}
              {
                !list.length && (
                  <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                )
              }
            </>
          )
        }
      </ul>
      {footer ? (
        <div className={styles.transferFooter}>
        {footer}
      </div>
      ): null} 
    </div>
  )
}

export default TransferCol
export { default as LeftCol } from './LeftCol'
export { default as RightCol } from './RightCol'
export { default as LeftItem } from './LeftItem'