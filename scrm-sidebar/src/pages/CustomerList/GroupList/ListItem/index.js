import { get } from 'lodash'
import moment from 'moment'
import OpenEle from 'components/OpenEle'
import GroupItem from 'components/GroupItem'
import { UNSET_GROUP_NAME } from 'src/utils/constants'
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
    <div className={styles['group-list-item']} onClick={handleClick}>
      <div className={styles['group-info']}>
        <GroupItem
          data={data}
          name={
            <span>
              {data.name || UNSET_GROUP_NAME}<span className={styles['group-count']}>({data.total}人)</span>
            </span>
          }
          extra={
           <>
           <span className={styles['group-owner-label']}>群主</span>
              <OpenEle
                type="userName"
                openid={get(data, 'ownerInfo.name')}
                className={styles['group-owner']}
              />
           </>
          }
        />
      </div>
      <p className={styles['create-time']}>
        <span className={styles['create-time-str']}>{createStr}</span>
        创建
      </p>
    </div>
  )
}
export default CustomerListItem
