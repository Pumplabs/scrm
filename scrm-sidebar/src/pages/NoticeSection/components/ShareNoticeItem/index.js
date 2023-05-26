import { get } from 'lodash'
import { useNavigate } from 'react-router-dom'
import InfiniteList from 'components/InfiniteList'
import {
  FollowStaffAndCustomer,
  FollowTime,
  FollowMomentItem,
  FollowContent,
} from 'pages/FollowList'
import { useInfiniteHook } from 'src/hooks'
import { GetFollowNotice } from 'services/modules/follow'
import styles from './index.module.less'

export default () => {
  const navigate = useNavigate()
  const {
    tableProps,
    loading,
    params: searchParams,
    refresh,
    runAsync: runList,
  } = useInfiniteHook({
    request: GetFollowNotice,
    rigidParams: {
      hasReply: false,
    },
  })
  const onDetail = (item) => {
    // 跳转到跟进详情
    navigate(`/noticefollowDetail/${item.id}`)
  }
  return (
    <InfiniteList
      loading={loading}
      loadNext={runList}
      {...tableProps}
      searchParams={searchParams}
      listItemClassName={styles['list-item-wrap']}
      renderItem={(item) => (
        <FollowMomentItem
          key={item.id}
          header={
            <div className={styles['share-item-header']}>
              <FollowStaffAndCustomer data={item.brCustomerFollow} />
              <span className={styles['follow-time']}>
                <FollowTime
                  createdAt={get(item, 'brCustomerFollow.createdAt')}
                />
              </span>
            </div>
          }
          data={item.brCustomerFollow}
          onDetail={onDetail}>
          <FollowContent data={item.brCustomerFollow} refresh={refresh} />
        </FollowMomentItem>
        // <ShareItem data={item} key={item.id} onDetail={onDetail} />
      )}></InfiniteList>
  )
}

// const ShareItem = ({ data = {}, onDetail }) => {
//   const { dateStr, timeStr } = useMemo(() => {
//     return covertNoticeTime(data.createdAt)
//   }, [data.createdAt])

//   const handleDetail = () => {
//     if (typeof onDetail === 'function') {
//       onDetail(data)
//     }
//   }
//   return (
//     <NoticeItem
//       className={cls({
//         [styles['share-item']]: true,
//       })}
//       hasRead={data.hasRead}
//       onClick={handleDetail}
//       header={
//         <div className={styles['share-item-header']}>
//           <FollowStaffAndCustomer data={data.brCustomerFollow} />
//           <span className={styles['follow-time']}>
//             <FollowTime createdAt={get(data, 'brCustomerFollow.createdAt')} />
//           </span>
//         </div>
//       }>
//       <p className={styles['notice-time']}>
//         <span className={styles['notice-date']}>{dateStr}</span>
//         <span className={styles['notice-time']}>{timeStr}</span>
//       </p>
//       <div className={styles['share-item-body']}>
//         <NoticeContent data={get(data, 'brCustomerFollow.content')} />
//       </div>
//     </NoticeItem>
//   )
// }
