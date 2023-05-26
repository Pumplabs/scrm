import { get } from 'lodash'
import { SendOutlined } from '@ant-design/icons'
import styles from './index.module.less'
import miniAppUrl from 'assets/images/circleMinApp.png'
import miniAppIcon2 from 'assets/images/footerMiniApp.svg'

export default ({ data = {}, onSend }) => {
  const appName = get(data, 'appInfo.name')
  return (
    <div className={styles['miniApp-item']}>
      <div className={styles['miniApp-item-header']}>
        <img src={miniAppUrl} alt="" className={styles['miniApp-icon']} />
        {appName}
      </div>
      <div className={styles['miniApp-item-body']}>
        <div>
          <img src={data.filePath} alt="" width="100%" height={217} />
        </div>
      </div>
      <div className={styles['miniApp-item-footer']}>
        <span className={styles['miniApp-symbol']}>
          <img src={miniAppIcon2} className={styles['icon']} alt="" />
          小程序
        </span>
        <SendOutlined className={styles['send-icon']} onClick={onSend} />
      </div>
    </div>
  )
}
