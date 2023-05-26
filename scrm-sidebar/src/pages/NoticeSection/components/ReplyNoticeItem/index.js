import { useNavigate } from 'react-router-dom'
import { get } from 'lodash'
import InfiniteList from 'components/InfiniteList'
import { useInfiniteHook } from 'src/hooks'
import NoticeContent from '../NoticeContent'
import NoticeItem from '../NoticeItem'
import { UserName, FollowTime } from 'src/pages/FollowList'
import { GetFollowNotice } from 'services/modules/follow'
import styles from './index.module.less'

export default () => {
  const navigate = useNavigate()
  const {
    tableProps,
    loading,
    params: searchParams,
    runAsync: runList,
  } = useInfiniteHook({
    request: GetFollowNotice,
    rigidParams: {
      hasReply: true,
    },
  })
  const onDetail = (item) => {
    // 跳转到跟进详情
    navigate(`/noticeReplyfollowDetail/${item.followId}?encode`)
  }
  return (
    <InfiniteList
      loading={loading}
      loadNext={runList}
      {...tableProps}
      searchParams={searchParams}
      listItemClassName={styles['list-item-wrap']}
      renderItem={(item) => (
        <ReplyNoticeItem data={item} key={item.id} onDetail={onDetail} />
      )}></InfiniteList>
  )
}
const ReplyNoticeItem = ({ data = {}, onDetail }) => {
  const handleDetail = () => {
    if (typeof onDetail === 'function') {
      onDetail(data)
    }
  }

  // 回复信息
  const brCustomerFollowReply = data.brCustomerFollowReply  ? data.brCustomerFollowReply : {}
  // 是否为回复跟进
  const isReplyFollow = brCustomerFollowReply.hasReplyFollow
  // 回复人： 回复创建人
  const replyExtId = get(data, 'brCustomerFollowReply.creatorExtId')
  // 被回复人： 如果是回复跟进，被回复人为跟进创建人，否则被回复人为被回复消息的创建人
  const beReplyExtId = isReplyFollow ? get(data, 'brCustomerFollow.creatorExtId') : get(brCustomerFollowReply, 'beReplyStaff.name')

  return (
    <NoticeItem
      className={styles['reply-item']}
      onClick={handleDetail}
      hasRead={data.hasRead}>
      <div className={styles['reply-item-header']}>
        {/* 回复创建人 */}
        <span className={styles['replyer']}>
          <UserName userId={replyExtId} />
        </span>
        回复了
        <UserName userId={beReplyExtId} /> ：
      </div>
      <p className={styles['reply-text']}>
        {get(data, 'brCustomerFollowReply.content.text[0].content')}
      </p>
      <p className={styles['reply-time']}>
        <FollowTime createdAt={data.createdAt}/>
      </p>
      <div className={styles['reply-item-content']}>
        <NoticeContent data={get(data, 'brCustomerFollow.content')} />
      </div>
    </NoticeItem>
  )
}
