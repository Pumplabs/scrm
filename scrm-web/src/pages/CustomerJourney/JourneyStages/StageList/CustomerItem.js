import { Tooltip } from 'antd'
import cls from 'classnames'
import { get } from 'lodash'
import { DeleteOutlined } from '@ant-design/icons'
import WeChatCell from 'components/WeChatCell'
import OpenEle from 'components/OpenEle'
import defaultAvatorUrl from 'assets/images/defaultAvator.jpg'
import styles from './index.module.less'

const CustomerItem = ({ data, onRemove, removeable }) => {
  const userAvatar = get(data, 'creatorStaff.avatarUrl') || defaultAvatorUrl
  const handleRemove = () => {
    if (typeof onRemove === 'function') {
      onRemove(data)
    }
  }
  return (
    <div className={styles['customer-item']}>
      <div
        className={cls({
          [styles['customer-item-content']]: true,
        })}>
        <WeChatCell data={data.customer} />
        {data.customer && data.customer.isDeletedStaff ? (
          <span className={styles['customer-item-status']}>已流失</span>
        ) : null}
      </div>
      <div className={styles['customer-item-footer']}>
        <Tooltip
          title={
            <OpenEle
              type="userName"
              openid={get(data, 'creatorStaff.name') || ''}
            />
          }
          placement="topLeft">
          <div className={styles['creator-info']}>
            <img alt="" src={userAvatar} className={styles['creator-img']} />
            <span>
              <OpenEle
                type="userName"
                openid={get(data, 'creatorStaff.name') || ''}
              />
            </span>
          </div>
        </Tooltip>
        <p className={styles['customer-item-createTime']}>{data.createdAt}</p>
        {removeable ? (
          <span className={styles['customer-item-action']}>
            <DeleteOutlined
              onClick={handleRemove}
              onPointerDown={(e) => {
                e.stopPropagation()
                e.preventDefault()
              }}
            />
          </span>
        ) : null}
      </div>
    </div>
  )
}

export default CustomerItem
