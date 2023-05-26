import { useRef, useState } from 'react'
import { Tabs } from 'antd'
import { PageContent } from 'layout'
import TabPaneContent from './TabPaneContent'
import { ORDER_STATUS_VALS } from './constants'

const { TabPane } = Tabs

const TABS_OPTIONS = [
  {
    label: '全部订单',
    value: ORDER_STATUS_VALS.ALL
  },
  {
    label: '已完成',
    value: ORDER_STATUS_VALS.DONE
  }
]
export default () => {
  const [activeKey, setActiveKey] = useState(ORDER_STATUS_VALS.ALL)
  const statInfo = useRef({})

  const onRefresh = (tab) => {
    statInfo.current[tab] = 1
  }

  const onTabsChange = (tab) => {
    statInfo.current[activeKey] = 0
    setActiveKey(tab)
  }
  return (
    <PageContent>
      <Tabs activeKey={`${activeKey}`} onChange={onTabsChange}>
        {TABS_OPTIONS.map((ele) => {
          const isActive = `${activeKey}` === `${ele.value}`
          return (
            <TabPane tab={ele.label} key={`${ele.value}`}>
              <TabPaneContent
                status={ele.value}
                onRefresh={onRefresh}
                needRefresh={
                  isActive && statInfo.current[ele.value]
                }
              />
            </TabPane>
          )
        })}
      </Tabs>
    </PageContent>
  )
}
