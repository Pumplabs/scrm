import { InfoCircleFilled } from '@ant-design/icons'
import ExceptionCard from '../ExceptionCard'

export default () => {
  return (
    <ExceptionCard
      icon={<InfoCircleFilled />}
      description="请在企业微信客户端打开链接"
    />
  )
}
