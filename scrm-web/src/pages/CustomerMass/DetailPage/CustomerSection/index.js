import { Tabs } from 'antd'
import CustomerTabPane from './CustomerTabPane'
import { CUSTOMER_STATUS_EN } from '../constants'

const { TabPane } = Tabs
export default ( { customerList = []}) => {
  return (
    <Tabs defaultActiveKey="1">
    <TabPane tab="全部客户" key="1">
      <CustomerTabPane list={customerList} />
    </TabPane>
    <TabPane tab="已发送" key="2">
      <CustomerTabPane
        hideAction={true}
        list={customerList}
        status={CUSTOMER_STATUS_EN.SEND}
      />
    </TabPane>
    <TabPane tab="未送达" key="3">
      <CustomerTabPane
        list={customerList}
        hideAction={true}
        status={CUSTOMER_STATUS_EN.WAIT_SEND}
      />
    </TabPane>
    <TabPane tab="接收达上限" key="7">
      <CustomerTabPane
        list={customerList}
        hideAction={true}
        status={CUSTOMER_STATUS_EN.OVER_LIMIT}
      />
    </TabPane>
    <TabPane tab="已不是好友" key="8">
      <CustomerTabPane
        list={customerList}
        hideAction={true}
        status={CUSTOMER_STATUS_EN.NOT_FRIEND}
      />
    </TabPane>
  </Tabs>
  )
}