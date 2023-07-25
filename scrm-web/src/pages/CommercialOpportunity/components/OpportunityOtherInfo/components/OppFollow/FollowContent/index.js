import { useMemo } from 'react'
import cls from 'classnames'
import { Button, Tabs } from 'antd'
import { get } from 'lodash'
import moment from 'moment'
import {
  CheckCircleOutlined,
  DeleteOutlined,
  MessageOutlined,
} from '@ant-design/icons'

import OpenEle from 'components/OpenEle'
import { TASK_STATUS } from '../../OppTask/constants'
import AttachList from 'components/AttachList'

import styles from './index.module.less'

const TAB_KEYS = {
  MENTION: 'mention',
  TODO: 'todo',
  ATTACH: 'attach',
  REPLY: 'reply',
}
const { TabPane } = Tabs
export default ({
  data,
  collapse,
  activeKey,
  onDoneTask,
  onKeyChange,
  tabList,
  shareUsers,
  taskList,
  replyList,
  attachList,
  onReplyStaff,
  onReplyFollow,
  onRemoveReply,
}) => {
  const onSetTab = (val) => {
    if (typeof onKeyChange === 'function') {
      onKeyChange(val)
    }
  }

  const handleReplyFollow = () => {
    if (typeof onReplyFollow === 'function') {
      onReplyFollow(data)
    }
  }

  return (
    <div
      className={cls({
        [styles['follow-content-footer']]: true,
        [styles['content-with-tabs']]: tabList.length > 0,
      })}>
      <ul className={styles['tabs-ul']}>
        {tabList.map((ele) => (
          <li className={styles['tabs-li']} key={ele.key}>
            <FollowTab
              sign={ele.sign}
              num={ele.num}
              isActive={ele.key === activeKey}
              onClick={() => {
                onSetTab(ele.key)
              }}
            />
          </li>
        ))}
      </ul>
      {tabList.length > 0 ? (
        <div
          className={cls({
            [styles['follow-tab-content']]: true,
            [styles['hide']]: collapse,
          })}>
          <Tabs activeKey={activeKey} tabBarStyle={{ display: 'none' }}>
            <TabPane key={TAB_KEYS.MENTION}>
              <UserPane list={shareUsers} />
            </TabPane>
            <TabPane key={TAB_KEYS.TODO}>
              <TodoPane list={taskList} onDone={onDoneTask} />
            </TabPane>
            <TabPane key={TAB_KEYS.ATTACH}>
              <AttachList list={attachList} 
              fieldNames={{
                id: 'file.id',
                fileName: 'file.fileName'
              }}/>
            </TabPane>
            <TabPane key={TAB_KEYS.REPLY}>
              <ReplyPane
                list={replyList}
                followCreatorExtId={data.creatorExtId}
                onReplyStaff={onReplyStaff}
                onReplyFollow={handleReplyFollow}
                onRemoveReply={onRemoveReply}
              />
            </TabPane>
          </Tabs>
        </div>
      ) : null}
    </div>
  )
}

// 用户
const UserPane = ({ list = [] }) => {
  return (
    <div className={styles['user-pane']}>
      {list.map((ele) => (
        <span className={styles['user-item']} key={ele}>
          <OpenEle type="userName" openid={ele} />
        </span>
      ))}
    </div>
  )
}

// 待办
const TodoPane = ({ list = [], onDone }) => {
  return (
    <ul className={styles['todo-pane']}>
      {list.map((ele) => (
        <TodoListItem data={ele} key={ele.id} onDone={onDone} />
      ))}
    </ul>
  )
}

const TodoListItem = ({ data = {}, onDone }) => {
  const handleDone = () => {
    if (typeof onDone === 'function') {
      onDone(data)
    }
  }
  return (
    <li
      className={cls({
        [styles['todo-li-item']]: true,
        [styles['done-li-item']]: TASK_STATUS.DONE === data.status,
        [styles['overdue-li-item']]: TASK_STATUS.OVERDUE === data.status,
      })}>
      <div className={styles['todo-icon']}>
        {TASK_STATUS.DONE === data.status ? (
          <CheckCircleOutlined />
        ) : (
          <span className={styles['circle-icon']} onClick={handleDone}></span>
        )}
      </div>
      <p className={styles['todo-title']}>{data.name}</p>
      <p className={styles['todo-footer']}>
        <span>
          <span className={styles['todo-item-label']}>负责人</span>
          <OpenEle type="userName" openid={data.owner} />
        </span>
        <span className={styles['todo-time']}>
          <span className={styles['todo-item-label']}>截止时间</span>
          <span className={styles['todo-time-str']}>
            {data.finishAt
              ? moment(data.finishAt).format('YYYY-MM-DD HH:mm')
              : null}
          </span>
        </span>
      </p>
    </li>
  )
}


// 回复
const ReplyPane = ({
  list = [],
  followCreatorExtId,
  onReplyStaff,
  onReplyFollow,
  onRemoveReply,
}) => {
  return (
    <div className={styles['reply-pane']}>
      <ul className={styles['reply-content']}>
        {list.map((ele) => (
          <ReplyItem
            key={ele.id}
            data={ele}
            followCreatorExtId={followCreatorExtId}
            onReply={onReplyStaff}
            onRemoveReply={onRemoveReply}
          />
        ))}
      </ul>
      <Button size="small" type="primary" onClick={onReplyFollow}>
        回复
      </Button>
    </div>
  )
}
const ReplyItem = ({
  data = {},
  followCreatorExtId,
  onReply,
  onRemoveReply,
}) => {
  const getReplyContent = () => {
    const textMsg = get(data, 'content.text') || []
    if (Array.isArray(textMsg) && textMsg[0]) {
      return textMsg[0].content
    } else {
      return ''
    }
  }

  const handleReply = () => {
    if (typeof onReply === 'function') {
      onReply(data)
    }
  }

  const handleRemove = () => {
    if (typeof onRemoveReply === 'function') {
      onRemoveReply(data)
    }
  }

  const { replyContent, replyExtId, beReplyExtId } = useMemo(() => {
    return {
      replyContent: getReplyContent(),
      // 回复人
      replyExtId: data.creatorExtId,
      // 被回复人： 如果是跟进，被回复人就是跟进创建人， 否则
      beReplyExtId: data.hasReplyFollow
        ? followCreatorExtId
        : data.beReplyStaff.extId,
    }
  }, [data.id])

  return (
    <li className={styles['reply-list-item']}>
      <div className={styles['reply-item-header']}>
        <span
          className={cls({
            [styles['staff-name']]: true,
            [styles['reply-staff']]: true,
          })}>
          <OpenEle type="userName" openid={replyExtId} />
        </span>
        回复
        <span
          className={cls({
            [styles['staff-name']]: true,
            [styles['toReply-staff']]: true,
          })}>
          <OpenEle type="userName" openid={beReplyExtId} />
        </span>
        ：
        <span className={styles['header-extra']}>
          <span>{data.createdAt}</span>
          <DeleteOutlined
            className={styles['remove-action']}
            onClick={handleRemove}
          />
        </span>
      </div>
      <div className={styles['reply-item-content']}>{replyContent}</div>
      <p className={styles['reply-item-footer']}>
        <span className={styles['msg-action']} onClick={handleReply}>
          <MessageOutlined className={styles['msg-icon']} />
          回复
        </span>
      </p>
    </li>
  )
}
const FollowTab = ({ sign, num = 0, isActive, onClick }) => {
  return (
    <span
      className={cls({
        [styles['follow-tab']]: true,
        [styles['follow-tab-active']]: isActive,
      })}
      onClick={onClick}>
      <span className={styles['follow-sign']}>{sign}</span>
      <span className={styles['follow-num']}>{num}</span>
    </span>
  )
}