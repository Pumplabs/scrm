import cls from 'classnames'
import { LinkOutlined } from '@ant-design/icons'
import styles from './index.module.less'
export default ({ className, data = {}, ...rest }) => {
  const src = data.file && data.file[0] ? data.file[0].thumbUrl : ''
  return (
    <div
      className={cls({
        [styles['msg-item']]: true,
        [styles['link-item']]: true,
        [className]: className,
      })}
      {...rest}>
      <div
        className={cls({
          [styles['linkMsg-cover']]: true,
        })}>
        {src ? (
          <img src={src} alt="" className={styles['link-img']} />
        ) : (
          <div className={styles['link-icon']}>
            <LinkOutlined />
          </div>
        )}
      </div>
      <div className={styles['link-info']}>
        <p
          className={cls({
            [styles['link-text']]: true,
            [styles['link-title']]: true,
          })}>
          {data.name}
        </p>
        <p
          className={cls({
            [styles['link-text']]: true,
            [styles['link-desc']]: true,
          })}>
          {data.info}
        </p>
      </div>
    </div>
  )
}
