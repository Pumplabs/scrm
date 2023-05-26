import { ApartmentOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import cls from 'classnames'
import OpenEle from 'components/OpenEle'
import defaultAvatorUrl from 'assets/images/defaultAvator.jpg'
import styles from './index.module.less'
export default ({ data = {} }) => {
  const userData = data ? data : {}
  const { name } = userData
  const type = userData.isDep ? 'departmentName' : 'userName'
  return (
    <div className={styles['cell-item']}>
      <Tooltip title={name} placement="topLeft">
        {userData.isUser ? (
          <img
            alt=""
            src={userData.avatarUrl ? userData.avatarUrl : defaultAvatorUrl}
            className={cls({
              [styles['cell-avatar']]: true,
              [styles['img-avatar']]: true,
            })}
          />
        ) : (
          <ApartmentOutlined
            className={cls({
              [styles['cell-avatar']]: true,
              [styles['icon-avatar']]: true,
            })}
          />
        )}
        <span className={styles['cell-title']}>
          <OpenEle type={type} openid={userData.name} />
        </span>
      </Tooltip>
    </div>
  )
}
