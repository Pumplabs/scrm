import { Tabs } from 'antd';

import { PageContent } from 'layout';
import Poster from './Poster'
import Images from './Images'
import Text from './Text'
import MiniApp from './MiniApp'
import styles from './index.module.less'

const { TabPane } = Tabs;

export default () => {
  return (
    <PageContent>
      <Tabs
        defaultActiveKey="poster"
        tabBarStyle={{ background: "none" }}
        className={styles['tabs']}
      >
        <TabPane
          tab="海报"
          key="poster"
        >
          <Poster />
        </TabPane>
        <TabPane
          tab="图片"
          key="images"
        >
          <Images />
        </TabPane>
        <TabPane
          tab="文本"
          key="text"
        >
          <Text />
        </TabPane>
        <TabPane
          tab="小程序"
          key="miniApp"
        >
          <MiniApp />
        </TabPane>
      </Tabs>
    </PageContent>
  );
}