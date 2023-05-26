import cls from 'classnames'
import { Tooltip } from 'antd'
import { get } from 'lodash'
import { EditOutlined, DeleteOutlined, SendOutlined } from '@ant-design/icons'
import { UserAvatar } from 'components/UserTag'
import OpenEle from 'components/OpenEle'
import styles from './index.module.less'

const ImgEle = ({ src, isPoster, className }) => {
  return (
    <img
      src={src}
      alt=""
      className={cls({
        [styles['img-ele']]: true,
        [styles['poster-img']]: isPoster,
        [className]: className,
      })}
    />
  )
}

const Footer = ({ className, data = {}, onEdit, onRemove }) => {
  const handleEdit = (e) => {
    e.stopPropagation()
    if (typeof onEdit === 'function') {
      onEdit(data)
    }
  }
  const handleRemove = (e) => {
    e.stopPropagation()
    if (typeof onRemove === 'function') {
      onRemove(data)
    }
  }

  return (
    <div
      className={cls({
        [styles['item-footer']]: true,
        [className]: className,
      })}>
      <p className={styles['item-name']}>
        <Tooltip title={data.title} placement="topLeft">
          {data.title}
        </Tooltip>
      </p>
      <div className={styles['basic-info']}>
        <UserAvatar
          src={get(data, 'creatorInfo.avatarUrl')}
          className={cls(styles['user-icon'])}
          size={28}
        />
        <div className={styles['user-info']}>
          <Tooltip
            title={
              <OpenEle type="userName" openid={get(data, 'creatorInfo.name')} />
            }>
            <span className={styles['user-name']}>
              <OpenEle
                type="userName"
                openid={get(data, 'creatorInfo.name')}
                style={{ color: '#000', fontSize: 12 }}
              />
            </span>
          </Tooltip>
          <p className={styles['create-time']}>{data.createdAt}</p>
        </div>
        <span className={styles['send-stat']}>
          <SendOutlined className={styles['send-icon']} />
          {data.sendNum ? data.sendNum : 0}
        </span>
        <div className={styles['right-actions']}>
          <EditOutlined
            onClick={handleEdit}
            className={cls(styles['action-ele'], styles['edit-action'])}
          />
          <DeleteOutlined
            onClick={handleRemove}
            className={cls(styles['action-ele'], styles['remove-action'])}
          />
        </div>
      </div>
    </div>
  )
}
export default (props) => {
  const {
    src,
    isPoster,
    data = {},
    style,
    onDetail,
    className,
    ...rest
  } = props
  const handleDetail = () => {
    if (typeof onDetail === 'function') {
      onDetail(data)
    }
  }
  return (
    <div
      className={cls({
        'img-item-container': true,
        [styles['img-item']]: true,
        [styles['img-poster-item']]: isPoster,
        [className]: className,
      })}
      style={style}
      onClick={handleDetail}>
      <ImgEle src={data.filePath} isPoster={isPoster} />
      <Footer data={data} {...rest} />
    </div>
  )
}
