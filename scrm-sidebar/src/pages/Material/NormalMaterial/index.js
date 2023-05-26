import MyTabs from 'components/MyTabs'
import ImgPaneList from './ImgPaneList'
import PaneList from '../components/PaneList'
import { MATERIAL_TYPE_EN_VALS } from '../constants'
import styles from './index.module.less'

const { TabPane } = MyTabs

export default ({ sendMetial, defaultKey, onDetail }) => {
  return (
    <MyTabs
      tabPosition="left"
      className={styles['tabs']}
      defaultKey={defaultKey}>
      <TabPane tab="海报" key={MATERIAL_TYPE_EN_VALS.POSTER}>
        <div className={styles['tab-pane']}>
          <ImgPaneList
            type={MATERIAL_TYPE_EN_VALS.POSTER}
            onSend={sendMetial}
          />
        </div>
      </TabPane>
      <TabPane tab="图片" key={MATERIAL_TYPE_EN_VALS.PICTUER}>
        <div className={styles['tab-pane']}>
          <ImgPaneList
            type={MATERIAL_TYPE_EN_VALS.PICTUER}
            onSend={sendMetial}
          />
        </div>
      </TabPane>
      <TabPane tab="文本" key={MATERIAL_TYPE_EN_VALS.TEXT}>
        <div className={styles['tab-pane']}>
          <PaneList
            type={MATERIAL_TYPE_EN_VALS.TEXT}
            onSend={sendMetial}
            onDetail={onDetail}
            needRemoteUrl={false}
          />
        </div>
      </TabPane>
    </MyTabs>
  )
}
