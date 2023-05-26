import { UserOutlined } from '@ant-design/icons'
import { Typography } from 'antd'
import styles from './index.module.less'
const { Paragraph, Text } = Typography;
export default ({ data = {} }) => {
  const { coverUrl, title } = data
  return (
    <div className={styles['msg-warp']}>
      <div className={styles['msg-header']}>
        <span className={styles['account-icon']}>
          <UserOutlined />
        </span>
        <span>订阅号名称</span>
      </div>
      <div className={styles['msg-body']}>
        <div className={styles['msg-cover']}>
          <img
            src={coverUrl}
            alt=""
            className={styles['msg-cover-img']}
          />
        </div>
        <div className={styles['msg-title']}>
          <Paragraph
            ellipsis={{ rows: 2 }}
            style={{ marginBottom: 0 }}
          >
            {title}
          </Paragraph>
        </div>
      </div>
    </div>
  )
}