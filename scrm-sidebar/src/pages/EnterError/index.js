import { InfoCircleFilled } from '@ant-design/icons'
import styles from './index.module.less'

export default () => {
  return (
    <div className={styles['page']}>
      <div className={styles.iconWrap}>
      <InfoCircleFilled className={styles.icon}/>
      </div>
      <p>
        请在企业微信客户端打开链接
      </p>
    </div>
  )
}