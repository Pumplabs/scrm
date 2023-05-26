import cls from 'classnames'
import styles from './index.module.less'
export default ({ className, data = {}, ...rest }) => {
  const src = data.file && data.file[0] ? data.file[0].thumbUrl : ''
  return (
    <div
      className={cls({
        [styles['msg-item']]: true,
        [styles['app-item']]: true,
        [className]: className,
      })}
      {...rest}>
        <span>{data.name}</span>
      <div>
        <img alt="" src={src} className={styles['app-cover']} />
      </div>
    </div>
  )
}
