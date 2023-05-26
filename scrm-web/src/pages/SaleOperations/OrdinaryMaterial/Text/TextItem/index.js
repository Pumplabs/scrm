import { EditOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons'
import { Typography, Tooltip } from 'antd'
import { get } from 'lodash'
import cls from 'classnames'
import { UserAvatar } from 'components/UserTag'
import OpenEle from 'components/OpenEle'
import styles from './index.module.less'

const { Paragraph } = Typography
export default ({ onEdit, onRemove, onDetail, data = {} }) => {
  const handleDetail = () => {
    if (typeof onDetail === 'function') {
      onDetail(data)
    }
  }
  const handleRemove = (e) => {
    e.stopPropagation()
    if (typeof onDetail === 'function') {
      onRemove(data)
    }
  }
  const handleEdit = (e) => {
    e.stopPropagation()
    if (typeof onDetail === 'function') {
      onEdit(data)
    }
  }
  return (
    <div className={styles['text-item']} onClick={handleDetail}>
      <div className={styles['text-item-header']}>{data.title}</div>
      <div className={styles['text-item-body']}>
        <Paragraph
          ellipsis={{
            rows: 3,
          }}>
          {data.content}
        </Paragraph>
      </div>
      <div className={styles['text-item-footer']}>
        <Tooltip
          title={
            <OpenEle type="userName" openid={get(data, 'creatorInfo.name')} />
          }>
          <UserAvatar
            className={cls(
              styles['text-item-action'],
              styles['text-item-user-icon']
            )}
            src={get(data, 'creatorInfo.avatarUrl')}
          />
        </Tooltip>
        {data.createdAt}
        <SendOutlined className={styles['send-icon']} />
        {data.sendNum ? data.sendNum : 0}
        <EditOutlined
          onClick={handleEdit}
          className={cls(
            styles['text-item-action'],
            styles['text-item-edit-icon']
          )}
        />
        <DeleteOutlined
          onClick={handleRemove}
          className={cls(
            styles['text-item-action'],
            styles['text-item-remove-icon']
          )}
        />
      </div>
    </div>
  )
}
