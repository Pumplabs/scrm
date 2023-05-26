import { LinkOutlined } from '@ant-design/icons'
import styles from './index.module.less'
export default (props) => {
  const { title, info, coverUrl, cover, coverStyle, onClick } = props
  const renderCover = () => {
    if (cover) {
      return (
        <div
          className={styles.linkCover}
          style={coverStyle}
        >
          {cover}
        </div>
      )
    } else if (coverUrl) {
      return (
        <img
          src={coverUrl}
          alt=""
          className={styles.linkCover}
        />
      )
    } else {
      return (
        <LinkOutlined
          className={styles.linkCover}
          style={{ fontSize: 40 }}
        />
      )
    }
  }
  return (
    <div
    onClick={onClick}
    className={styles['link-item-wrap']}
    >
      {renderCover()}
      <div className={styles.linkItem}>
        <p className={styles.linkName}>{title}</p>
        <div className={styles.linkContext}>
          <p>{info}</p>
        </div>
      </div>
    </div>
  )
}