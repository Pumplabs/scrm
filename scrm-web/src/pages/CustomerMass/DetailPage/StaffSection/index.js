import { Tabs, Button } from 'antd'
import MemberTabPane from './MemberTabPane'
import { MEMBER_STATUS_EN } from '../constants'

const { TabPane } = Tabs
export default ({ massId, onRemindAll, onRemindItem }) => {
  
  return (
    <Tabs defaultActiveKey="1">
      <TabPane tab="全部成员" key="1">
        <MemberTabPane massId={massId} />
      </TabPane>
      <TabPane tab="已发送成员" key="2">
        <MemberTabPane
          status={MEMBER_STATUS_EN.SEND}
          hideAction={true}
          massId={massId}
        />
      </TabPane>
      <TabPane tab="未发送成员" key="3">
        <MemberTabPane
          status={MEMBER_STATUS_EN.WAIT_SEND}
          massId={massId}
          extra={
            <Button
              type="primary"
              style={{ marginLeft: 10 }}
              onClick={onRemindAll}>
              提醒全部成员
            </Button>
          }
          onRemind={onRemindItem}
        />
      </TabPane>
    </Tabs>
  )
}
