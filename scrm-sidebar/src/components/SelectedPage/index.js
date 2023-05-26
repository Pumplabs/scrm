import cls from 'classnames'
import { Button, NavBar } from 'antd-mobile'
import styles from './index.module.less'

/**
 * @param {Function} onOk 点击确定按钮
 * @param {Object} okButtonProps 确定按钮的其它属性
 */
export default ({
  children,
  onOk,
  okButtonProps = {},
  title,
  backTitle,
  onCancel,
  nav,
  showNav = true,
}) => {
  return (
    <div
      className={cls({
        [styles['page']]: true,
        [styles['page-nav']]: showNav,
      })}>
      {showNav ? (
        <div className={styles['page-nav']}>
          {nav ? (
            nav
          ) : (
            <NavBar back={backTitle} onBack={onCancel}>
              {title}
            </NavBar>
          )}
        </div>
      ) : null}
      {children}
      <div className={styles['page-footer']}>
        <Button color="primary" fill="solid" onClick={onOk} {...okButtonProps}>
          确定
        </Button>
      </div>
    </div>
  )
}
