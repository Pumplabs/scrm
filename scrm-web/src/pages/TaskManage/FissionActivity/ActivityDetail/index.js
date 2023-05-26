import { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import CommonDrawer from 'components/CommonDrawer'
import ActivityInfo from './ActivityInfo'
import ActivityStatistics from './ActivityStatistics'

const { TabPane } = Tabs;
export default (props) => {
  const { visible, data, ...rest } = props
  const [tab, setTab] = useState('1')
  
  const onTabChange = (key) => {
    setTab(key)
  }

  useEffect(() => {
    if (visible) {
      setTab('1')
    }
  }, [visible])

  return (
    <CommonDrawer
      visible={visible}
      width={1100}
      footer={null}
      {...rest}
    >
      <Tabs
        activeKey={tab}
        onChange={onTabChange}
      >
        <TabPane
          tab="活动详情"
          key="1"
        >
          <ActivityInfo data={data}/>
        </TabPane>
        <TabPane
          tab="活动数据"
          key="2"
        >
          <ActivityStatistics data={data}/>
        </TabPane>
      </Tabs>
    </CommonDrawer>
  )
}