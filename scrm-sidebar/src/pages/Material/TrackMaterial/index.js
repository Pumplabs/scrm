import MyTabs from 'components/MyTabs'
import PaneList from '../components/PaneList'
import { MATERIAL_TYPE_EN_VALS } from '../constants'
import styles from './index.module.less'

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

export default ({ sendMetial, defaultKey, onDetail }) => {
  return (
    <MyTabs
      className={styles['tabs-content']}
      dataSource={TAB_LIST}
      defaultKey={defaultKey}
    >
      {TAB_LIST.map((tabItem) => (
        <MyTabs.TabPane tab={tabItem.title} key={tabItem.key}>
          <PaneList
            type={tabItem.key}
            onSend={sendMetial}
            onDetail={onDetail}
          />
        </MyTabs.TabPane>
      ))}
    </MyTabs>
  )
}
