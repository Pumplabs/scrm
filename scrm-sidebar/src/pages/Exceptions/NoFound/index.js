
import { CloseCircleOutlined } from '@ant-design/icons'
import ExceptionCard from '../ExceptionCard'

export default () => {
  return (
    <ExceptionCard
      icon={<CloseCircleOutlined />}
      description={'很抱歉，您所访问的界面不存在'}
    />
  )
}
