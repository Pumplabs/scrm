import { LinkOutlined } from '@ant-design/icons'
import cls from 'classnames'
import styles from '../index.module.less'

const LinkCell = ({ style, data = {} }) => {
  const src = data.file && data.file[0] ? data.file[0].thumbUrl : ''
  return (
    <div
      className={cls({
        [styles['linkMsg-cell']]: true,
        [styles['content-cell']]: true,
      })}
      style={style}>
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
export default LinkCell