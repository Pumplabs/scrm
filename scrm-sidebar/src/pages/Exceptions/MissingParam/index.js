import { Button } from 'antd'
import { WarningOutlined } from '@ant-design/icons'
import ExceptionCard from '../ExceptionCard'

export default () => {
  const onRefresh = () => {
    window.location.reload()
  }
  return (
    <ExceptionCard icon={<WarningOutlined />}>
      <div style={{ textAlign: 'center' }}>
        <p style={{ marginBottom: 20 }}>
          很可惜，界面缺失必要参数
        </p>
        <Button onClick={onRefresh}>刷新试试</Button>
      </div>
    </ExceptionCard>
  )
}
