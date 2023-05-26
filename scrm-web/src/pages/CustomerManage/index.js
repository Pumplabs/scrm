import { Tabs } from 'antd'
import { PageContent } from 'src/layout'
import CustomerTags from './CustomerTags'
import CustomerList from './CustomerList'
import styles from './index.module.less'

const { TabPane } = Tabs

export default () => {
  return (
    <PageContent>
      <Tabs defaultActiveKey="customerManage" className={styles['tabs']}>
        <TabPane tab="客户管理" key="customerManage">
          <CustomerList />
        </TabPane>
        <TabPane tab="客户标签" key="customerTag">
          <CustomerTags />
        </TabPane>
      </Tabs>
    </PageContent>
  )
}
