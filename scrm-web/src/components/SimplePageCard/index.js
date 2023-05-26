import { Fragment } from 'react'
import cls from 'classnames'
import styles from './index.module.less'
/**
 * 简单界面
 */
export default (props) => {
  const { name, title, toolBar, children, bodyStyle, style, className } = props
  return (
    <div
      className={cls({
        [styles['pageContent']]: true,
        [className]: true,
      })}
      style={style}>
      <div className={styles['pageHeader']}>
        {title ? (
          title
        ) : (
          <>
            <div className={styles['pageAction']}>
              {toolBar.map((ele, idx) => (
                <Fragment key={idx}>{ele}</Fragment>
              ))}
            </div>
            <div className={styles['page-extra']}>{name}</div>
          </>
        )}
      </div>
      <div style={bodyStyle}>{children}</div>
    </div>
  )
}
