import { useMemo } from 'react'
import { Tabs, Empty } from 'antd-mobile'
import OpenEle from 'components/OpenEle'
import StatBox from 'components/StatBox'
import styles from './index.module.less'

const SEND_STATUS = {
  // 已发送
  SUCCESS: 1,
  // 未发送
  NOT_SEND: 0,
  // 因客户不是好友导致发送失败
  NOT_FRIEND: 2,
  // 因客户已经收到其他群发消息导致发送失败
  OTHER: 3,
}
const UserStat = ({ data = {} }) => {
  const { sendStaffCount = 0, noSendStaffCount = 0 } = data
  const list = [
    {
      label: '执行员工总数',
      value: sendStaffCount + noSendStaffCount,
    },
    {
      label: '已发送',
      value: sendStaffCount,
    },
    {
      label: '未发送',
      value: noSendStaffCount,
    },
  ]
  const { sendStaffList, noSendStaffList } = useMemo(() => {
    const arr = Array.isArray(data.staffList) ? data.staffList : []
    let sendStaffList = []
    let noSendStaffList = []
    arr.forEach((item) => {
      if (item.status === SEND_STATUS.SUCCESS) {
        sendStaffList = [...sendStaffList, item]
      } else {
        noSendStaffList = [...noSendStaffList, item]
      }
    })
    return {
      sendStaffList,
      noSendStaffList,
    }
  }, [data.staffList])
  return (
    <div>
      <StatBox className={styles['stat-info']}>
        {list.map((item) => (
          <StatBox.Item label={item.label} key={item.label}>
            {item.value}
          </StatBox.Item>
        ))}
      </StatBox>
      <Tabs className={styles['tabs']}>
        <Tabs.Tab title="已发送" key={'send'} className={styles['tab-panle']}>
          <SendList dataSource={sendStaffList} isSend={true} />
        </Tabs.Tab>
        <Tabs.Tab title="未发送" key="not-send" className={styles['tab-panle']}>
          <SendList dataSource={noSendStaffList} />
        </Tabs.Tab>
      </Tabs>
    </div>
  )
}

const SendList = ({ dataSource = [], isSend }) => {
  if (dataSource.length === 0) {
    return (
      <div className={styles['empty-section']}>
        <Empty description="暂无数据" />
      </div>
    )
  }
  return (
    <ul className={styles['send-list']}>
      {dataSource.map((item) => (
        <li className={styles['send-list-item']} key={item.name}>
          <span>
            <OpenEle type="userName" openid={item.name} />
          </span>
          <span className={styles['send-item-extra']}>
            {isSend ? `共发送${item.customerCount}位客户`: `共${item.customerCount}位客户`}
          </span>
        </li>
      ))}
    </ul>
  )
}
export default UserStat
