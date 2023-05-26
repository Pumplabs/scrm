import { Button } from 'antd'
import { FrownOutlined } from '@ant-design/icons'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ExceptionCard from '../ExceptionCard'
import { getRedirectUrl } from 'src/pages/Login'
import styles from './index.module.less'

export default () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect')

  const onRefresh = () => {
    navigate(getRedirectUrl(redirect))
  }
  
  return (
    <ExceptionCard icon={<FrownOutlined />}>
      <div className={styles['content']}>
        <p className={styles['tip-text']}>账号未开通席位，请联系管理员开通</p>
        <div className={styles['actions']}>
          <Button type="primary" onClick={onRefresh}>
            刷新
          </Button>
        </div>
      </div>
    </ExceptionCard>
  )
}
