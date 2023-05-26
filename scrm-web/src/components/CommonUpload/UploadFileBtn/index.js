import { Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
export default (props) => {
  const { title = '上传文件' } = props
  return (
    <Button
      icon={<PlusOutlined />}
      type="primary"
      ghost
    >
      {title}
    </Button>
  )
}