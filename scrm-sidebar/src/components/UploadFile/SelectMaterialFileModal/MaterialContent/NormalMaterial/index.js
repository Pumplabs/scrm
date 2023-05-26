import Tabs from 'components/MyTabs'
import { MATERIAL_TYPE_EN_VALS } from 'src/pages/Material/constants'
import ImgPanleList from './ImgPanleList'
import PanleList from '../PanleList'
import styles from './index.module.less'

const { TabPane } = Tabs
const tabOptions = [
  {
    label: '海报',
    isImg: true,
    value: MATERIAL_TYPE_EN_VALS.POSTER,
  },
  {
    label: '图片',
    isImg: true,
    value: MATERIAL_TYPE_EN_VALS.PICTUER,
  }
]
export default ({ onCheck, selectedKeys, paneClassName, baseKey = '' }) => {
  
  return (
    <Tabs
      tabPosition="left"
      defaultActiveKey="poster"
      navUlClassName={styles['tab-nav']}>
      {tabOptions.map((ele) => {
        const eleProps = {
          onCheck,
          selectedKeys,
          type: ele.value
        }
        return (
          <TabPane tab={ele.label} key={ele.value} style={{ paddingLeft: 0 }}>
            <div className={paneClassName}>
              {ele.isImg ? (
                <ImgPanleList {...eleProps} />
              ) : (
                <PanleList {...eleProps} />
              )}
            </div>
          </TabPane>
        )
      })}
    </Tabs>
  )
}
