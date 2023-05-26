import { useState } from 'react'
import { Tabs } from 'antd-mobile'
import { useSearchParams }  from 'react-router-dom'
import ShareNoticeItem from './components/ShareNoticeItem'
import ReplyNoticeItem from './components/ReplyNoticeItem'

const TABS = {
  SHARE: 'share',
  REPLY: 'reply'
}
const Content = () => {
  const [searchParams] = useSearchParams()
  const [activeKey, setActiveKey] = useState(() => {
    const tab = searchParams.get('tab') || TABS.SHARE
    return Object.values(TABS).includes(tab) ? tab : TABS.SHARE
  })
  const data = {
    share: 0,
    reply: 0,
  }

  const getNumText = (num = 0) => {
    return num > 0 ? `(${num})` : ''
  }
  const tabChange = (key) => {
    setActiveKey(key)
  }

  return (
    <div style={{ width: '100%' }}>
      <div
        style={{ position: 'sticky', top: 0, zIndex: 2, background: '#fff' }}>
        <Tabs activeKey={activeKey} onChange={tabChange}>
          <Tabs.Tab
            title={`@我${getNumText(data.share)}`}
            key={TABS.SHARE}
          />
          <Tabs.Tab title={`回复${getNumText(data.reply)}`} key={TABS.REPLY} />
        </Tabs>
      </div>
      <TabContent activeKey={activeKey} tab={TABS.SHARE}>
        <ShareNoticeItem />
      </TabContent>
      <TabContent activeKey={activeKey} tab={TABS.REPLY}>
        <ReplyNoticeItem />
      </TabContent>
    </div>
  )
}

const TabContent = ({ tab, activeKey, children }) => {
  if (tab === activeKey) {
    return children
  } else {
    return null
  }
}
export default Content
