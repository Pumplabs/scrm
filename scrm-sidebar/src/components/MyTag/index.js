import { Tag } from 'antd-mobile'
import cls from 'classnames'
import { CloseOutline } from 'antd-mobile-icons'
import styles from './index.module.less'

export default ({
  closable,
  color,
  onClose,
  children,
  className,
  style = {},
  ...rest
}) => {
  return (
    <Tag
      color={color ? color : '#fafafa'}
      fill={color ? 'outline' : 'solid'}
      className={cls({
        [styles['tags-ele']]: true,
        [className]: className,
      })}
      style={{
        ...(color ? {}: {'--text-color': '#666', '--border-color': '#ddd'}),
        ...style
      }}
      {...rest}
      >
      {children}
      {closable ? (
        <CloseOutline
          className={styles['tag-close-icon']}
          onClick={(e) => {
            e.stopPropagation()
            if (typeof onClose === 'function') {
              onClose(e)
            }
          }}
        />
      ) : null}
    </Tag>
  )
}
