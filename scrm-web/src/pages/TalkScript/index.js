import { Tabs } from 'antd'
import { PageContent } from 'src/layout'
import CompanyTalkScript, { DetailTalkScriptDrawer } from './CompanyTalkScript'
import styles from './index.module.less'

const { TabPane } = Tabs

export default () => {
  return (
    <PageContent>
      <Tabs defaultActiveKey="company" className={styles['tabs']}>
        <TabPane key={'company'} tab="企业话术">
          <CompanyTalkScript />
        </TabPane>
        <TabPane key={'user'} tab="个人话术">
          <CompanyTalkScript isPerson={true} />
        </TabPane>
      </Tabs>
    </PageContent>
  )
}
export { DetailTalkScriptDrawer }