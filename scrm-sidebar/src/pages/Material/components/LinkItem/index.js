import cls from 'classnames'
import { SendOutlined } from '@ant-design/icons'
import MaterialIcon from '../MaterialIcon'
import styles from './index.module.less'
export default (props) => {
  const { title, info, onClick, onSend, data, className, coverSize = 40 } = props

  const hasSendIcon = typeof onSend === 'function'
  const handleSend = () => {
    if (hasSendIcon) {
      onSend(data)
    }
  }

  return (
    <div
      className={cls({
        [styles['link-item-box']]: true,
        [styles['link-box-with-send']]: hasSendIcon,
        [className]: className,
      })}>
      <div
        onClick={onClick}
        className={cls({
          [styles['link-item-wrap']]: true,
          [styles['link-item-hide-cover']]: false,
        })}
        style={{
          paddingLeft: `${(coverSize + 10)/3.75}vw`,
          minHeight: `${coverSize/3.75}vw`
        }}
      >
        <MaterialIcon
          data={data}
          className={styles['link-cover']}
          size={coverSize}
          style={{
            width: `${coverSize/3.75}vw`,
            height: `${coverSize/3.75}vw`
          }}
        />
        <div className={styles.linkItem}>
          <p className={styles.linkName}>
            <span className={styles['title-text']}>{title}</span>
          </p>
          <div className={styles.linkContext}>
            <p className={styles['link-content-text']}>{info}</p>
          </div>
        </div>
      </div>
      {hasSendIcon ? (
        <SendOutlined className={styles['send-icon']} onClick={handleSend} />
      ) : null}
    </div>
  )
}
