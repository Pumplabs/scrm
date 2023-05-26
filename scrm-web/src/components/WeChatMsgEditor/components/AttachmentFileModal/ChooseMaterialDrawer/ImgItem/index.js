import cls from 'classnames'
import { Tooltip } from 'antd'
import styles from './index.module.less'
export default (props) => {
  const { className, src, title, isPoster, imgClassName } = props
  return (
    <div
      className={cls({
        [styles['img-item']]: true,
        [styles['poster-img-item']]: isPoster,
        [className]: className,
      })}>
      <img
        src={src}
        alt=""
        className={cls({
          [styles['img-ele']]: true,
          [styles['poster']]: isPoster,
          [imgClassName]: imgClassName
        })}
      />
      <div className={styles['img-item-footer']}>
        <Tooltip title={title} placement="topLeft">
          <span className={styles['img-item-name']}>{title}</span>
        </Tooltip>
      </div>
    </div>
  )
}
