import { Tabs } from 'antd';
import { PageContent } from 'layout';
import Article from './Article'
import LinkPanle from './Link'
import FilesPanle from './Files'
import VideoPanle from './Video'
import styles from './index.module.less'

const { TabPane } = Tabs;

export default () => {
  return (
    <PageContent>
      <Tabs
        defaultActiveKey="article"
        tabBarStyle={{ background: "none" }}
        className={styles['tabs']}
      >
        <TabPane tab="文章"
          key="article">
          <Article />
        </TabPane>
        <TabPane tab="链接"
          key="link"
        >
          <LinkPanle />
        </TabPane>
        <TabPane tab="视频"
          key="video">
          <VideoPanle />
        </TabPane>
        <TabPane tab="文件"
          key="files">
          <FilesPanle />
        </TabPane>
      </Tabs>
    </PageContent>
  );
}