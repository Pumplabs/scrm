import { InfoCircleOutlined } from '@ant-design/icons'
import ExceptionCard from '../ExceptionCard'
import styles from './index.module.less'

export default () => {
  return (
    <ExceptionCard icon={<InfoCircleOutlined />}>
      <div>
        <p className={styles['error-msg']}>没有查询到您的用户信息</p>
        <div>
          <p className={styles['tip-line']}>
            建议您联系管理员确认当前账号是否已开通席位
          </p>
        </div>
      </div>
    </ExceptionCard>
  )
}
