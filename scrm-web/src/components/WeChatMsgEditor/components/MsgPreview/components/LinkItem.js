import { LinkOutlined } from '@ant-design/icons'
import styles from './item.module.less'
/**
 * 链接
 * @param {string} thumbUrl 链接地址 
 * @param {string} name 链接名称
 * @param {string} info 链接其它信息
 * @returns 
 */
const MsgLinkItem = ({ thumbUrl, name, info }) => {
  return (
    <div className={styles.linkItem}>
      <p className={styles.linkName}>{name}</p>
      <div className={styles.linkContext}>
        <p>{info}</p>
        {thumbUrl ? (
          <img
            src={thumbUrl}
            alt=""
            className={styles.linkCover}
          />
        ) : <LinkOutlined
          className={styles.linkCover}
          style={{ fontSize: 40 }}
        />}
      </div>
    </div>
  )
}
export default MsgLinkItem