import { Tabs } from 'antd'
import { PageContent } from 'layout'
import CustomerRemoveUserHistory from './CustomerRemoveUserHistory'
import UserRemoveCustomerHistory from './UserRemoveCustomerHistory'
import DataStatistics from './DataStatistics'
const { TabPane } = Tabs;

export default () => {
  return (
    <PageContent>
      <Tabs defaultActiveKey={'1'}>
        <TabPane
          tab="数据统计"
          key="1"
        >
          <DataStatistics/>
        </TabPane>
        <TabPane
          tab="客户删除员工"
          key="2"
        >
          <CustomerRemoveUserHistory/>
        </TabPane>
        <TabPane
          tab="员工删除客户"
          key="3"
        >
          <UserRemoveCustomerHistory/>
        </TabPane>
      </Tabs>
    </PageContent>
  )
}