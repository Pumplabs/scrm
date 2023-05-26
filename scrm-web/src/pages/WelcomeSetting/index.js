import { Tabs } from 'antd'
import { PageContent } from 'layout'
import FriendWelcome from './FriendWelcome'
import GroupWelcome from './GroupWelcome'
import styles from './index.module.less'

const { TabPane } = Tabs

export default () => {
  return (
    <PageContent>
      <Tabs
        defaultActiveKey={'friend'}
        className={styles['tabs']}
      >
        <TabPane tab="好友欢迎语" key={'friend'}>
          <FriendWelcome />
        </TabPane>
        <TabPane tab="入群欢迎语" key={'group'}>
          <GroupWelcome />
        </TabPane>
      </Tabs>
    </PageContent>
  )
}
