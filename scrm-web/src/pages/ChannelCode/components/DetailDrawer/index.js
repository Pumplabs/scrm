import { useEffect, useState } from 'react'
import { Tabs } from 'antd'
import CustomerDrawer from 'components/CommonDrawer'
import BaseInfo from './BaseInfo'
import DataOverview from './DataOverview'

const { TabPane } = Tabs

export default (props) => {
  const [activeKey, setActiveKey] = useState('1')
  const { visible, data, groupName, ...rest } = props
  useEffect(() => {
    if (visible) {
      setActiveKey('1')
    }
  }, [visible])
  const onKeyChange = (key) => {
    setActiveKey(key)
  }
  return (
    <CustomerDrawer
      footer={false}
      visible={visible}
      width={800}
      {...rest}
      bodyStyle={{
        paddingTop: 0,
      }}>
      <Tabs activeKey={activeKey} onChange={onKeyChange}>
        <TabPane tab="基本信息" key="1">
          <BaseInfo data={data} groupName={groupName} />
        </TabPane>
        <TabPane tab="数据总览" key="2">
          <DataOverview data={data} />
        </TabPane>
      </Tabs>
    </CustomerDrawer>
  )
}
