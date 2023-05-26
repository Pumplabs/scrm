import { useMemo } from 'react'
import { Tabs, Empty } from 'antd-mobile'
import OpenEle from 'components/OpenEle'
import CustomerText from 'components/CustomerText'
import StatBox from 'components/StatBox'
import { SEND_STATUS } from '../constants'
import styles from './index.module.less'

const UserStat = ({ data = {} }) => {
  const list = [
    {
      label: '已发送',
      value: data.sendCustomer || 0,
    },
    {
      label: '未发送',
      value: data.noSendCustomer || 0,
    },
    {
      label: (
        <>
          已达接收上限
          <br />
          送达失败
        </>
      ),
      value: data.otherSendCustomer || 0,
    },
    {
      label: (
        <>
          已不是好友
          <br />
          送达失败
        </>
      ),
      value: data.noFriendCustomer || 0,
    },
  ]
  const sendList = [
    {
      id: 1,
      customer: {
        name: '曾大大',
      },
      user: 'YaYa',
      time: '2021-02-02 12:12:12',
    },
  ]
  const sendStatusDataMap = useMemo(() => {
    const customerList = Array.isArray(data.customerList)
      ? data.customerList
      : []
    let res = {}
    customerList.forEach((ele) => {
      const status = ele.sendStatus
      const preArr = res[status] ? res[status] : []
      res[status] = [...preArr, ele]
    })
    return res
  }, [data.customerList])
  return (
    <div>
      <StatBox className={styles['stat-info']}>
        {list.map((ele, idx) => (
          <StatBox.Item label={ele.label} key={idx}>
            {ele.value}
          </StatBox.Item>
        ))}
      </StatBox>
      <Tabs className={styles['tabs']}>
        <Tabs.Tab title="已发送" key={'send'} className={styles['tab-panle']}>
          <SendList
            dataSource={sendStatusDataMap[SEND_STATUS.SUCCESS]}
            isSend={true}
          />
        </Tabs.Tab>
        <Tabs.Tab title="未发送" key="not-send" className={styles['tab-panle']}>
          <SendList dataSource={sendStatusDataMap[SEND_STATUS.NOT_SEND]} />
        </Tabs.Tab>
        <Tabs.Tab
          title="接收达上限"
          key="to-limit"
          className={styles['tab-panle']}>
          <SendList dataSource={sendStatusDataMap[SEND_STATUS.OTHER]} />
        </Tabs.Tab>
        <Tabs.Tab
          title="已不是好友"
          key="not-friend"
          className={styles['tab-panle']}>
          <SendList dataSource={sendStatusDataMap[SEND_STATUS.NOT_FRIEND]} />
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
        <li className={styles['send-list-item']} key={item.id}>
          <div className={styles['customer-info']}>
          <CustomerText
            data={{
              corpName: item.corpName,
              name: item.customerName,
            }}
          />
          </div>
          <div className={styles['send-item-extra']}>
            <p className={styles['send-user']}>
              由 <OpenEle type="userName" openid={item.staffName} />
              发送
            </p>
            {isSend ? <p>{item.sendTime}</p> : null}
          </div>
        </li>
      ))}
    </ul>
  )
}
export default UserStat
