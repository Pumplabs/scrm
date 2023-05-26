import { AddCircleOutline } from 'antd-mobile-icons'
import { useNavigate } from 'react-router-dom'
import { Dialog } from 'antd-mobile'
import { useRequest } from 'ahooks'
import PageContent from 'components/PageContent'
import FollowMomentItem from './components/FollowMomentItem'
import InfiniteList from 'components/InfiniteList'
import CustomerText from 'components/CustomerText'
import UserIcon from 'components/UserIcon'
import OpenEle from 'components/OpenEle'
import UserName from './components/UserName'
import { FollowTime } from './components/FollowAction'
import ReplyModal from './components/ReplyModal'
import { actionRequestHookOptions } from 'src/services/utils'
import {
  GetCustomerFollowList,
  RemoveFollow,
  AddFollowReply,
} from 'services/modules/follow'
import FollowItem from './components/FollowItem'
import { TEXT_KEY_BY_VAL } from 'components/MsgSection/constants'
import { useInfiniteHook, useModalHook, useBack } from 'src/hooks'
import styles from './index.module.less'


export default () => {
  const navigate = useNavigate()
  const { visibleMap, openModal, closeModal, modalInfo } = useModalHook([
    'remove',
    'reply',
  ])
  const {
    tableProps,
    params: searchParams,
    runAsync: runList,
    refresh,
  } = useInfiniteHook({
    request: GetCustomerFollowList,
    rigidParams: {
      hasAll: true,
      hasMain: true,
      type: 1,
    },
  })
  const { run: runRemoveFollow } = useRequest(RemoveFollow, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        runList()
      },
    }),
  })
  const { run: runAddFollowReply } = useRequest(AddFollowReply, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '回复',
      successFn: () => {
        runList()
      },
    }),
  })
  useBack({
    backUrl: '/home',
  })

  const onAdd = () => {
    navigate('/addFollow')
  }

  const onFollowDetail = (data) => {
    navigate(`/followDetail/${data.id}`)
  }

  const onRemoveItem = async (data) => {
    const result = await Dialog.confirm({
      content: `确定要删除此跟进吗`,
    })
    if (result) {
      runRemoveFollow({
        id: data.id,
      })
    }
  }

  const onReplyFollow = (item) => {
    openModal('reply', item)
  }

  const onEditFollow = (item) => {
    navigate(`/editFollow/${item.id}`)
  }

  const onReplyOk = ({ text }) => {
    closeModal()
    runAddFollowReply({
      content: {
        text: [
          {
            content: text,
            type: TEXT_KEY_BY_VAL.TEXT,
          },
        ],
      },
      followId: modalInfo.data.id,
      hasReplyFollow: 1,
    })
  }

  return (
    <PageContent footer={<Footer onClick={onAdd} />}>
      <ReplyModal
        visible={visibleMap.replyVisible}
        onCancel={closeModal}
        onOk={onReplyOk}
      />
      <div className={styles['follow-page']}>
        <InfiniteList
          loadNext={runList}
          {...tableProps}
          searchParams={searchParams}
          listItemClassName={styles['follow-list-item']}
          renderItem={(item) => (
            <FollowMomentItem
              key={item.id}
              header={<ListItemHeader data={item} />}
              data={item}
              onDetail={onFollowDetail}
              onRemove={onRemoveItem}
              onReply={onReplyFollow}
              onEdit={onEditFollow}>
              <FollowItem data={item} refresh={refresh} />
            </FollowMomentItem>
          )}></InfiniteList>
      </div>
    </PageContent>
  )
}

const ListItemHeader = ({ data = {} }) => {
  return (
    <div className={styles['follow-moment-header']}>
      <FollowStaffAndCustomer data={data} />
      <span className={styles['follow-time']}>
        <FollowTime createdAt={data.createdAt} />
      </span>
    </div>
  )
}

/**
 *
 * @param {String} staffId 员工id
 * @returns
 */
const FollowStaff = ({ staffId, convertName = true }) => {
  return (
    <div className={styles['follow-staff']}>
      <UserIcon className={styles['staff-avatar']} />
      <span className={styles['staff-name']}>
        {convertName ? (
          <UserName userId={staffId} />
        ) : (
          <OpenEle type="userName" openid={staffId} />
        )}
      </span>
    </div>
  )
}
const FollowStaffAndCustomer = ({ data = {}, convertName }) => {
  const followStaffId = data.staff ? data.staff.name : ''
  return (
    <div className={styles['follow-staff-and-customer']}>
      <FollowStaff staffId={followStaffId} convertName={convertName} />
      跟进了客户
      <CustomerText
        data={data.wxCustomer}
        className={styles['customer-text']}
      />
    </div>
  )
}
export { default as FollowContent } from './components/FollowItem'
export { default as FollowAction } from './components/FollowAction'
export { MentionUser } from './components/FollowItem'
export { default as TaskList, TaskItem } from './components/FollowTaskList'
export { FollowMomentItem, FollowStaff, FollowStaffAndCustomer, FollowTime }
export { default as ReplyModal } from './components/ReplyModal'
export { default as UserName } from './components/UserName'
export const Footer = ({ onClick }) => {
  return (
    <div className={styles['page-footer']}>
      <AddCircleOutline className={styles['add-icon-btn']} onClick={onClick} />
    </div>
  )
}
