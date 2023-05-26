import { Result, Button } from 'antd';

export default () => {
  const onRefresh= () => window.location.reload()
  return (
    <Result
      title="当前没有可使用菜单，请尽快联系客服开通"
      extra={
        <Button type="primary" key="console" onClick={onRefresh}>
          刷新试试
        </Button>
      }
    />
  )
}