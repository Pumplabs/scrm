import { useMemo, useEffect } from 'react'
import { Tabs, Empty } from 'antd-mobile'
import { get } from 'lodash'
import OpenEle from 'components/OpenEle'
import GroupItem from 'components/GroupItem'
import InfiniteList from 'components/InfiniteList'
import CustomerText from 'components/CustomerText'
import StatBox from 'components/StatBox'
import useInfiniteHook from 'src/hooks/useInfiniteHook'
import { GetGroupReceiveList } from 'services/modules/groupMass'
import styles from './index.module.less'
const SEND_STATUS = {
  SEND: 1,
  FAIL: -1,
  NOT_SEND: 0,
}

const GroupStat = ({ data = {} }) => {
  const list = [
    {
      label: '已发送',
      value: data.sendChatCount || 0,
    },
    {
      label: '未发送',
      value: data.noSendChatCount || 0,
    },
  ]
  // const sendStatusDataMap = useMemo(() => {
  //   const customerList = Array.isArray(data.customerList)
  //     ? data.customerList
  //     : []
  //   let res = {}
  //   customerList.forEach((ele) => {
  //     const status = ele.sendStatus
  //     const preArr = res[status] ? res[status] : []
  //     res[status] = [...preArr, ele]
  //   })
  //   return res
  // }, [data.customerList])
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
          <SendListWrap data={data} status={SEND_STATUS.SEND} />
        </Tabs.Tab>
        <Tabs.Tab title="未发送" key="not-send" className={styles['tab-panle']}>
          <SendListWrap data={data} status={SEND_STATUS.NOT_SEND} />
        </Tabs.Tab>
        <Tabs.Tab title="已失败" key="fail" className={styles['tab-panle']}>
          <SendListWrap data={data} status={SEND_STATUS.FAIL} />
        </Tabs.Tab>
      </Tabs>
    </div>
  )
}

const SendListWrap = ({ data = {}, status }) => {
  const {
    tableProps,
    params: fetchParams,
    runAsync: runList,
  } = useInfiniteHook({
    request: GetGroupReceiveList,
    manual: true,
    rigidParams: {
      status,
      // status	状态搜索条件，0->未发送 1->已发送 -1->已失败		fa
      templateId: data.id,
    },
  })
  useEffect(() => {
    if (data.id) {
      runList({})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id])
  const isSend = status === SEND_STATUS.SEND
  return (
    <InfiniteList
      {...tableProps}
      loadNext={runList}
      wrapClassName={styles['group-ul']}
      searchParams={fetchParams}
      listStyle={{
        '--border-bottom': '0 none',
        '--border-inner': 'none'
      }}
      renderItem={(item) => {
        return <SendListItem data={item} />
      }}></InfiniteList>
  )
}
const SendListItem = ({ data = {}, isSend }) => {
  return (
    <li className={styles['send-list-item']}>
      <div className={styles['group-info']}>
        <GroupItem
          data={{
            name: data.name,
          }}
        />
      </div>
      <div className={styles['send-item-extra']}>
        <p className={styles['send-user']}>
          由 <OpenEle type="userName" openid={get(data, 'ownerInfo.name')} />
          发送
        </p>
        {isSend ? <p>{data.sendTime}</p> : null}
      </div>
    </li>
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
export default GroupStat
