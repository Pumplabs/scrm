import cls from 'classnames'
import WeChatCell from 'components/WeChatCell'
import OpenEle from 'components/OpenEle'
import { CUSTOMER_STATUS_CN, CUSTOMER_STATUS_EN } from '../../constants'
import styles from './index.module.less'

const CustomerListItem = ({ data = {} }) => {
  return (
    <div className={cls({
      [styles.customerListItem]: true,
      [styles['unsend']]: CUSTOMER_STATUS_EN.WAIT_SEND === data.sendStatus,
      [styles['send']]: data.sendStatus === CUSTOMER_STATUS_EN.SEND,
      [styles['fail']]: data.sendStatus === CUSTOMER_STATUS_EN.NOT_FRIEND || data.sendStatus === CUSTOMER_STATUS_EN.OVER_LIMIT,
    })}>
      <div>
        <WeChatCell
          data={{
            avatarUrl: data.customerAvatarUrl,
            name: data.customerName,
            corpName: data.corpName,
          }}
          extra={
            <span className={cls({
              [styles['status-item']]: true,
            })}>
              {CUSTOMER_STATUS_CN[data.sendStatus]}
            </span>
          }
        />
      </div>
      <p className={styles['desc-text']}>
        通过
        <span style={{ marginLeft: 2 }}>
          <OpenEle type="userName" openid={data.staffName} />
        </span>
        发送
      </p>
    </div>
  )
}
export default CustomerListItem