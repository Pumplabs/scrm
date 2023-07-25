import React, { useContext } from 'react'
import { Popover } from 'antd'
import { useNavigate } from 'react-router-dom'
import cls from 'classnames'
import OpenEle from "components/OpenEle"
import {
  LogoutOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import { observer, MobXProviderContext } from 'mobx-react'
import LogoSvgUrl from 'assets/images/logo.svg'
import styles from './index.module.less'

const UserSideBar = observer(() => {
  const navigate = useNavigate()
  const { UserStore } = useContext(MobXProviderContext)
  const userData = UserStore.userData

  const onJumpHome = () => {
    navigate(`/home`)
  }

  const content = (
    <div className={styles['user-popover-content']}>
      <div style={{ fontWeight: 500, fontSize: 18, paddingLeft: 12, paddingRight: 12 }}><OpenEle type="userName" openid={userData.name} /></div>
      <p className={styles['menu-item']} onClick={UserStore.logout}>
        <LogoutOutlined className={styles['menu-item-icon']} />
        退出
      </p>
    </div>
  )

  return (
    <div className={styles.userSideBar}>
      <img
        alt=""
        src={LogoSvgUrl}
        className={styles.logoImg}
      />
      <div>
        <MenuOutlined
          className={cls({
            [styles['action-icon']]: true,
            [styles['sys-icon']]: true,
            [styles['active-icon']]: true
          })}
          onClick={onJumpHome}
        />
      </div>
      <div className={styles.userSiderBarFooter}>
        <Popover
          trigger="click"
          content={content}
          placement="rightBottom"
          overlayClassName={styles['user-popover-content-overlay']}
          overlayInnerStyle={{ borderRadius: 8 }}>
          <img alt="" src={userData.avatarUrl} className={styles.userAvatar} />
        </Popover>
      </div>
    </div>
  )
})

export default UserSideBar
