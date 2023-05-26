import { FrownOutlined } from '@ant-design/icons'
import ExceptionCard from '../ExceptionCard'
import styles from './index.module.less'

export default () => {
  return (
    <ExceptionCard icon={<FrownOutlined />}>
      <div className={styles['content']}>
        <p className={styles['tip-text']}>
          您不在可见范围或没有开通席位，请联系管理员处理
        </p>
      </div>
    </ExceptionCard>
  )
}
