import { useRequest } from 'ahooks'
import { Dialog } from 'antd-mobile'
import InfiniteList from 'src/components/InfiniteList'
import {
  FollowTime,
  FollowMomentItem,
  ReplyModal,
  FollowContent,
  FollowStaff
} from 'src/pages/FollowList'
import { RemoveFollow, AddFollowReply } from 'services/modules/follow'
import { actionRequestHookOptions } from 'src/services/utils'
import { useModalHook } from 'src/hooks'
import { TEXT_KEY_BY_VAL } from 'components/MsgSection/constants'
import styles from './index.module.less'

const Content = ({ onDetail, refresh, ...rest }) => {
  const { openModal, closeModal, visibleMap, modalInfo } = useModalHook([
    'reply',
  ])
  const { run: runRemoveFollow } = useRequest(RemoveFollow, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        refresh()
      },
    }),
  })
  const { run: runAddFollowReply } = useRequest(AddFollowReply, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '评论',
      successFn: () => {
        refresh()
      },
    }),
  })

  const onReply = (item) => {
    openModal('reply', item)
  }

  const onRemove = async (data) => {
    const result = await Dialog.confirm({
      content: `确定要删除此跟进吗`,
    })
    if (result) {
      runRemoveFollow({
        id: data.id,
      })
    }
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
      hasReplyFollow: true,
    })
  }

  return (
    <>
      <ReplyModal
        visible={visibleMap.replyVisible}
        onCancel={closeModal}
        onOk={onReplyOk}
      />
      <InfiniteList
        {...rest}
        listItemClassName={styles['follow-infinite-item']}
        listClassName={styles['follow-infinite-list']}
        borded={false}
        renderItem={(item) => (
          <FollowMomentItem
            data={item}
            className={styles['follow-list-item']}
            onReply={onReply}
            onRemove={onRemove}
            onDetail={onDetail}
            borded={true}
            header={<ItemHeader item={item} />}>
            <FollowContent data={item} refresh={refresh} />
          </FollowMomentItem>
        )}></InfiniteList>
    </>
  )
}

const ItemHeader = ({ item = {} }) => {
  return (
    <div className={styles['follow-item-header']}>
      <div className={styles['user-info']}>
        <FollowStaff staffId={item.creatorExtId}/>
      </div>
      <span className={styles['follow-time']}>
        <FollowTime createdAt={item.createdAt}/>
      </span>
    </div>
  )
}
export default Content
