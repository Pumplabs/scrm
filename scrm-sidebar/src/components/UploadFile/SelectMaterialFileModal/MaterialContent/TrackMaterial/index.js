import Tabs from 'components/MyTabs'
import PanleList from '../PanleList'
import { MATERIAL_TYPE_EN_VALS } from 'src/pages/Material/constants'

const { TabPane } = Tabs
const TAB_LIST = [
  {
    title: '文章',
    key: MATERIAL_TYPE_EN_VALS.ARTICLE,
  },
  {
    title: '链接',
    key: MATERIAL_TYPE_EN_VALS.LINK,
  },
  {
    title: '视频',
    needRemoteUrl: false,
    key: MATERIAL_TYPE_EN_VALS.VIDEO,
  },
  {
    title: '文件',
    needRemoteUrl: false,
    key: MATERIAL_TYPE_EN_VALS.FILE,
  },
]

export default ({ onCheck, selectedKeys, baseKey, paneClassName }) => {
  return (
    <Tabs
      tabPosition="left"
      defaultActiveKey="article"
      tabBarStyle={{ marginRight: 0 }}>
      {TAB_LIST.map((item) => (
        <TabPane tab={item.title} key={item.key} style={{ paddingLeft: 0 }}>
          <div className={paneClassName}>
            <PanleList
              onCheck={onCheck}
              type={item.key}
              selectedKeys={selectedKeys}
            />
          </div>
        </TabPane>
      ))}
    </Tabs>
  )
}
