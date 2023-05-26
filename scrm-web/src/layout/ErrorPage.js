import { Button } from 'antd'
import { FrownOutlined } from '@ant-design/icons'
export default ({ error, errorInfo }) => {
  const isDev = true
  if (!isDev) {
    console.error(errorInfo.componentStack)
  }
  return (
    <div style={{ paddingTop: 120 }}>
      <div style={{ margin: '0 auto', paddingLeft: 360 }}>
        <p style={{ marginBottom: 14 }}>
          <FrownOutlined style={{ fontSize: 40 }} />
          <span style={{ fontSize: 16, marginLeft: 12, color: '#ff4d4f' }}>
            糟糕，界面出错啦
          </span>
        </p>
        <p style={{ marginBottom: 10 }}>显示此界面出了点问题</p>
        <p style={{ marginBottom: 10 }}>错误代码：1001</p>
        <p>
          <Button
            type="primary"
            onClick={() => window.location.reload()}
            style={{ marginRight: 10 }}>
            刷新试试
          </Button>
          <Button type="primary">联系客服人员</Button>
        </p>
      </div>
      {isDev ? (
        <div>
          {error.toString()}
          {errorInfo ? errorInfo.componentStack : null}
        </div>
      ) : null}
    </div>
  )
}
