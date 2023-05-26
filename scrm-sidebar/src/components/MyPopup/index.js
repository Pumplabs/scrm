import { Popup } from 'antd-mobile'
import cls from 'classnames'
import styles from './index.module.less'

export default (props = {}) => {
  const { visible, onCancel, onOk, children,okButtonProps = {}, popupBodyClassName, title, ...rest } = props
  return (
    <Popup
      visible={visible}
      onMaskClick={onCancel}
      {...rest}>
      <div className={styles['popup-content']}>
        <div className={styles['popup-header']}>
          <span
            className={cls({
              [styles['btn-text']]: true,
              [styles['cancel-btn']]: true,
            })}
            onClick={onCancel}>
            取消
          </span>
          <p className={styles['popup-title']}>{title}</p>
          <span
            className={cls({
              [styles['btn-text']]: true,
              [styles['submit-btn']]: true,
              [styles['btn-disabled-text']]: okButtonProps.disabled
            })}
            onClick={okButtonProps.disabled ? undefined : onOk}
          >
            确定
          </span>
        </div>
        <div className={cls({
          [styles['popup-body']]: true,
          [popupBodyClassName]: popupBodyClassName
        })}>{children}</div>
      </div>
    </Popup>
  )
}
