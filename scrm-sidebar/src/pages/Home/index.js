import { useMemo } from 'react'
import cls from 'classnames'
import { useNavigate, Outlet, useLocation } from 'react-router-dom'
import Icon, { SettingFilled, UserOutlined } from '@ant-design/icons'
import HomeIcon from './WorkbenchIcon'
import styles from './index.module.less'

export default () => {

  console.log("home");
  const navigate = useNavigate()
  const location = useLocation()

  const onSelectedMenu = (key) => {
    switch (key) {
      case 'workbench':
        navigate('/home')
        break
      case 'customer':
        navigate('/home/cusotmerList')
        break
      case 'notice':
        navigate('/home/notice')
        break
      default:
        break
    }
  }

  const activeKey = useMemo(() => {
    switch (location.pathname) {
      case '/home/cusotmerList':
        return 'customer'
      case '/home/notice':
        return 'notice'
      default:
        return 'workbench'
    }
  }, [location.pathname])
  return (
    <div className={styles['page']}>
      <div className={styles['page-body']}>
        <Outlet />
      </div>
      <footer className={styles['page-footer']}>
        <ul className={styles['menu-ul']}>
          <li
            className={cls({
              [styles['menu-item']]: true,
              [styles['menu-active-item']]: activeKey === 'workbench',
            })}
            onClick={() => onSelectedMenu('workbench')}>
            <Icon component={HomeIcon} className={cls({
              [styles['workbench-icon']]: true,
              [styles['menu-icon']]: true,
            })} />
            <p className={styles['menu-name']}>工作台</p>
          </li>
          <li
            className={cls({
              [styles['menu-item']]: true,
              [styles['menu-active-item']]: activeKey === 'customer',
            })}
            onClick={() => onSelectedMenu('customer')}>
            <UserOutlined className={styles['menu-icon']} />
            <p className={styles['menu-name']}>客户</p>
          </li>
          <li
            className={cls({
              [styles['menu-item']]: true,
              [styles['menu-active-item']]: activeKey === 'notice',
            })}
            onClick={() => onSelectedMenu('notice')}>
            <SettingFilled className={styles['menu-icon']} />
            <p className={styles['menu-name']}>通知</p>
          </li>
        </ul>
      </footer>
    </div>
  )
}
