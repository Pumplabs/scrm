import { useMemo, useState } from 'react'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { get } from 'lodash'
import { useRequest } from 'ahooks'
import { Modal } from 'antd'
import { useModalHook } from 'src/hooks'
import OpenEle from 'components/OpenEle'
import FollowContent from './FollowContent'
import { DateCard, MomentContent, MomentItemWrap } from '../OpportunityMoment'
import AddReply from './AddReply'
import { TEXT_KEY_BY_VAL } from 'components/WeChatMsgEditor/utils'
import { RemoveReply, AddFollowReply } from 'services/modules/commercialOpportunity'
import { covertListByDate } from 'src/utils'
import { actionRequestHookOptions } from 'services/utils'
import styles from './index.module.less'

export default ({ dataSource = [], refresh }) => {
  const followData = useMemo(() => covertListByDate(dataSource), [dataSource])
  const { openModal, closeModal, modalInfo, visibleMap,confirmLoading, requestConfirmProps, } = useModalHook([
    'replyStaff',
    'replyFollow',
  ])
  const { run: runRemoveReply } = useRequest(RemoveReply, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn:() => {
        refresh()
      }
    }),
  })
  const { run: runAddFollowReply } = useRequest(AddFollowReply, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '回复',
      successFn:() => {
        refresh()
        closeModal()
      }
    }),
  })

  const onReplyOk = ({ text }) => {
    let params = {
      content: {
        text: [
          {
            content: text,
            type: TEXT_KEY_BY_VAL.TEXT,
          },
        ],
      }
    }
    if (modalInfo.type === 'replyFollow') {
      params = {
        ...params,
        followId: modalInfo.data.id,
        hasReplyFollow: 1,
      }
    } else {
      params = {
        ...params,
        hasReplyFollow: 0,
        followId: modalInfo.data.followId,
        replyId: modalInfo.data.id,
      }
    }
    runAddFollowReply(params)
  }

  const onReplyStaff = (replyStaffInfo) => {
    openModal('replyStaff', replyStaffInfo)
  }
  const onReplyFollow = (followInfo) => {
    openModal('replyFollow', followInfo)
  }
  const onRemoveReply = (item) => {
    Modal.confirm({
      title: '提示',
      content: '確定要刪除此回复吗',
      onOk: () => {
        runRemoveReply({
          id: item.id
        })
      }
    })
  }
  return (
    <>
      <AddReply
        visible={visibleMap.replyStaffVisible || visibleMap.replyFollowVisible}
        onOk={onReplyOk}
        confirmLoading={confirmLoading}
        title={
          modalInfo.type === 'replyFollow' ? (
            '回复跟进'
          ) : (
            <>
              回复 <OpenEle type="userName" openid={'YaYa'} />
            </>
          )
        }
      />
      {followData.map((ele) => (
        <DateCard
          date={ele.fullDate}
          key={ele.fullDate}
          headerClassName={styles['dateCard-header']}>
          {ele.list.map((item) => (
            <FollowLiItem
              item={item}
              key={item.id}
              refresh={refresh}
              onReplyStaff={onReplyStaff}
              onReplyFollow={onReplyFollow}
              onRemoveReply={onRemoveReply}
            />
          ))}
        </DateCard>
      ))}
    </>
  )
}

const FollowLiItem = ({ item = {}, refresh, onRemoveReply, onReplyStaff, onReplyFollow }) => {
  const [activeKey, setActiveKey] = useState('mention')
  const [collapse, setCollapse] = useState(false)

  const onToggleCollapse = () => {
    setCollapse((val) => !val)
  }
  const onTabChange = (val) => {
    setActiveKey(val)
  }

  const getFollowContent = (data = {}) => {
    const { content = {} } = data
    if (Array.isArray(content.text) && content.text[0]) {
      return content.text[0].content
    }
    return ''
  }
  const getTabList = ({ shareNum, taskNum, attachNum, replyNum }) => {
    let tabList = []
    if (shareNum) {
      tabList.push({
        sign: '@',
        key: 'mention',
        num: shareNum,
      })
    }
    if (taskNum) {
      tabList.push({
        sign: '待办',
        key: 'todo',
        num: taskNum,
      })
    }
    if (attachNum) {
      tabList.push({
        sign: '附件',
        key: 'attach',
        num: attachNum,
      })
    }
    if (replyNum) {
      tabList.push({
        sign: '回复',
        key: 'reply',
        num: replyNum,
      })
    }
    return tabList
  }

  const { shareUsers, taskList, tabList, attachList, replyList } =
    useMemo(() => {
      const { shareExtStaffIds, taskList, content = {}, replyList } = item
      const shareUsers = Array.isArray(shareExtStaffIds) ? shareExtStaffIds : []
      const todoList = Array.isArray(taskList) ? taskList : []
      const attachList = content ? get(item, 'content.media') || [] : []
      const tabList = getTabList({
        shareNum: shareUsers.length,
        taskNum: todoList.length,
        attachNum: attachList.length,
        replyNum: item.replyNum,
      })
      if (tabList[0]) {
        setActiveKey(tabList[0].key)
      }
      return {
        shareUsers,
        taskList: todoList,
        attachList,
        tabList,
        replyList: Array.isArray(replyList) ? replyList : [],
      }
    }, [item])

  return (
    <MomentItemWrap
      className={styles['momentItemWrap']}
      footer={
        <FollowContent
          tabList={tabList}
          data={item}
          collapse={collapse}
          activeKey={activeKey}
          shareUsers={shareUsers}
          taskList={taskList}
          attachList={attachList}
          replyList={replyList}
          onReplyStaff={onReplyStaff}
          onReplyFollow={onReplyFollow}
          onRemoveReply={onRemoveReply}
          onKeyChange={onTabChange}
          refresh={refresh}
        />
      }>
      <MomentContent
        headerClassName={styles['momentContentHeader']}
        header={
          <div className={styles['follow-header']}>
            <span className={styles['staff-name']}>
              <OpenEle type="userName" openid={item.creatorExtId} />
            </span>
            添加了跟进
            <div className={styles['follow-header-extra']}>
              <span className={styles['follow-time']}>
                {item.createdAt ? item.createdAt.slice(0, -3) : ''}
              </span>
              {tabList.length ? (
                <>
                  {collapse ? (
                    <DownOutlined
                      onClick={onToggleCollapse}
                      className={styles['arrow-icon']}
                    />
                  ) : (
                    <UpOutlined
                      onClick={onToggleCollapse}
                      className={styles['arrow-icon']}
                    />
                  )}
                </>
              ) : null}
            </div>
          </div>
        }
        bodyClassName={styles['momentItemBody']}>
        {getFollowContent(item)}
      </MomentContent>
    </MomentItemWrap>
  )
}
