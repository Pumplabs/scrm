import { Tabs } from 'antd'
import { PageContent } from 'src/layout'
import StageConfiguration from './StageConfiguration'

const { TabPane } = Tabs
export default () => {
  return (
    <PageContent>
      <Tabs>
        <TabPane tab="商机阶段配置" key="stage">
          <StageConfiguration/>
        </TabPane>
      </Tabs>
    </PageContent>
  )
}
