import { FrownOutlined } from '@ant-design/icons'
import ExceptionCard from '../ExceptionCard'
import styles from './index.module.less'

export default () => {
  return (
    <ExceptionCard icon={<FrownOutlined />}>
      <div className={styles['tip']}>
      <p>
        非常遗憾，您无权限访问此界面
      </p>
      <p>
      请联系管理员进行开通
      </p>
      </div>
    </ExceptionCard>
  )
}

