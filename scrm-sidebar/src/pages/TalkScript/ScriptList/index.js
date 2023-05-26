import { useState, useEffect, useMemo } from 'react'
import { useRequest } from 'ahooks'
import InfiniteList from 'src/components/InfiniteList'
import MyTabs from 'components/MyTabs'
import ScriptItem from './ScriptItem'
import useInfiniteHook from 'src/hooks/useInfiniteHook'
import { convertChatAttachment } from 'src/utils/covertMsg'
import {
  GetTaskScriptGroupList,
  GetTalkScript,
} from 'src/services/modules/talkScript'
import { AddSendCount } from 'src/services/modules/material'
import { useGetCurrentExtId } from 'src/hooks/wxhook'
import styles from './index.module.less'

export default ({ hasPerson = false, userData, searchParams }) => {
  const [selectedGroupKey, setSelectedGroupKey] = useState('')
  const { data: groupList = [] } = useRequest(GetTaskScriptGroupList, {
    defaultParams: [
      {
        hasPerson,
      },
    ],
    onSuccess: (res) => {
      if (Array.isArray(res) && res.length > 0) {
        setSelectedGroupKey(res[0].id)
      }
    },
  })

  const onTabChange = (key) => {
    setSelectedGroupKey(key)
  }

  return (
    <div className={styles['script-content']}>
      <MyTabs
        className={styles['tabs-content']}
        dataSource={groupList}
        activeKey={selectedGroupKey}
        onChange={onTabChange}>
        {groupList.map((groupItem) => (
          <MyTabs.TabPane tab={groupItem.name} key={groupItem.id}>
            <TalkList
              groupId={groupItem.id}
              hasPerson={hasPerson}
              userData={userData}
              isActive={selectedGroupKey === groupItem.id}
              searchParams={searchParams}
            />
          </MyTabs.TabPane>
        ))}
      </MyTabs>
    </div>
  )
}

const TalkList = ({ groupId, hasPerson, userData, searchParams, isActive }) => {
  const curExtId = useGetCurrentExtId()
  const {
    tableProps,
    loading,
    params: fetchParams,
    runAsync: runList,
  } = useInfiniteHook({
    request: GetTalkScript,
    manual: true,
    rigidParams: {
      groupId: groupId,
      hasPerson,
    },
  })

  const onSend = (content, data) => {
    window.wx.invoke('sendChatMessage', content, function (res) {
      if (res.err_msg === 'sendChatMessage:ok' && curExtId) {
        AddSendCount({
          sendCount: 1,
          extCustomerId: curExtId,
          type: 2,
          typeId: data.id,
        })
      }
    })
  }

  const jsonStr = useMemo(() => {
    return JSON.stringify(searchParams)
  }, [searchParams])

  useEffect(() => {
    if (isActive) {
      runList(
        {
          current: 1,
          pageSize: 20,
        },
        {
          code: searchParams.text,
          tagList: searchParams.selectedTags,
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonStr, isActive])

  const onSendAll = (arr = [], scriptData) => {
    arr.forEach((item) => {
      onSendSingle(item, scriptData)
    })
  }

  const onSendSingle = (msg, scriptData) => {
    const covertRes = convertChatAttachment(msg, userData)
    const content = {
      msgtype: covertRes.type, //消息类型，必填
      enterChat: false, //为true时表示发送完成之后顺便进入会话，仅移动端3.1.10及以上版本支持该字段
      ...covertRes.data,
    }
    onSend(content, scriptData)
  }

  return (
    <div className={styles['group-item-content']}>
      <InfiniteList
        loading={loading}
        {...tableProps}
        loadNext={runList}
        searchParams={fetchParams}
        renderItem={(ele) => (
          <div key={ele.id} className={styles['msg-item']}>
            <ScriptItem
              data={ele}
              onSendAll={onSendAll}
              onSendSingle={onSendSingle}
            />
          </div>
        )}></InfiniteList>
    </div>
  )
}
