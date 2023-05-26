import { get } from 'lodash'
import moment from 'moment'
import WeChatCell from 'components/WeChatCell'
import OpenEle from 'components/OpenEle'
import styles from './index.module.less'

const CustomerListItem = ({ data = {}, onSelect }) => {
  const handleClick = () => {
    if (typeof onSelect === 'function') {
      onSelect(data)
    }
  }
  const createStr = data.createdAt
    ? moment(data.createdAt).format('YYYY/MM/DD')
    : ''
  return (
    <div className={styles['customer-list-item']} onClick={handleClick}>
      <div className={styles['customer-info']}>
        <WeChatCell
          data={data}
          extra={
            <p className={styles['follow-info']}>
              <span className={styles['follower']}>跟进人</span>
              <OpenEle
                type="userName"
                openid={get(data, 'extCreatorName')}
                className={styles['follow-staff']}
              />
            </p>
          }
        />
      </div>
      <div className={styles['customer-extra']}>
        {data.isAssist ? (
          <span className={styles['cooperation-tag']}>协作</span>
        ): null}
        <p className={styles['create-time']}>
          <span className={styles['create-time-str']}>{createStr}</span>
          添加
        </p>
      </div>
    </div>
  )
}
export default CustomerListItem
