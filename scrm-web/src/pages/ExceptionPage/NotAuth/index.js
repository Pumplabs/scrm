import { Button } from 'antd'
import { NavLink } from 'react-router-dom'
import styles from './index.module.less'
export default () => {
  return (
    <div className={styles['page']}>
      非常遗憾，您所在的企业尚未开通权限，请联系管理员进行开通
      <p>
        <Button type="primary">
          <NavLink to="/login">重新登录</NavLink>
        </Button>
      </p>
    </div>
  )
}
