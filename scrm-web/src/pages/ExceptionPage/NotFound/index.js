import { useNavigate } from 'react-router'
import { Result, Button } from 'antd'

const NotFound = () => {
  const navigate = useNavigate()
  const toHome = () => {
    navigate(`/home`)
  }
  return (
    <Result
      status="404"
      title="404"
      subTitle="抱歉，你访问的界面不存在"
      extra={
        <Button type="primary" ghost onClick={toHome}>
          返回首页
        </Button>
      }
    />
  )
}

export default NotFound