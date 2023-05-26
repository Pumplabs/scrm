import {useContext } from 'react'
import { MobileOutlined } from '@ant-design/icons'
import { observer, MobXProviderContext } from 'mobx-react'
import defaultAvatorUrl from 'assets/images/defaultAvator.jpg'
import styles from './index.module.less'

const UserInfo = observer(() => {
  const { UserStore } = useContext(MobXProviderContext)
  const userData = UserStore.userData
  return (
    <div
      className={styles.card}
    >
      <div className={styles['user-card']}>
        <div className={styles['user-card-content']}>
          <img
            src={userData.avatarUrl ? userData.avatarUrl : defaultAvatorUrl}
            alt="用户头像"
            className={styles['user-avatar']}
          />
          <p className={styles['user-name']}>{userData.name}</p>
          <p className={styles['user-email']}>{userData.name}</p>
        </div>
      </div>
      <div className={styles['info-card']}>
        <ListItem/>
        <ListItem/>
      </div>
    </div>
  )
})
const ListItem = ({ label, value }) => {
  return (
    <div className={styles['list-item']}>
      <p className={styles['list-item-label']}>
        <span className={styles['list-item-icon']}><MobileOutlined /></span>
        手机号
      </p>
      <div className={styles['list-item-content']}>
        18877572922
      </div>
    </div>
  )
}

export default UserInfo