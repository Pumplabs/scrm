import { useRef, useState } from 'react'
import { Tabs } from 'antd'
import { PageContent } from 'layout'
import TabPaneContent from './TabPaneContent'
import { PRODUCT_STATUS_VALS } from './constants'

const { TabPane } = Tabs

const TABS_OPTIONS = [
  {
    title: '销售中',
    value: PRODUCT_STATUS_VALS.SALF,
  },
  { title: '草稿', value: PRODUCT_STATUS_VALS.DRAFT },
  {
    title: '已下架',
    value: PRODUCT_STATUS_VALS.OFF,
  },
]
export default () => {
  const [activeKey, setActiveKey] = useState(PRODUCT_STATUS_VALS.SALF)
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
            <TabPane tab={ele.title} key={`${ele.value}`}>
              <TabPaneContent
                status={ele.value}
                onRefresh={onRefresh}
                needRefresh={
                  isActive && statInfo.current[ele.value]
                }
                changeTab={onTabsChange}
              />
            </TabPane>
          )
        })}
      </Tabs>
    </PageContent>
  )
}
