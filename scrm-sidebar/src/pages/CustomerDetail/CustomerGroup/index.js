import { useContext } from 'react'
import cls from 'classnames'
import { useSearchParams } from 'react-router-dom'
import { MobXProviderContext, observer } from 'mobx-react'
import GroupItem from 'components/GroupItem'
import InfiniteList from 'src/components/InfiniteList'
import OpenEle from 'components/OpenEle'
import { useBack } from 'src/hooks'
import useGetCurCustomerHook from '../useGetCurCustomerHook'
import styles from './index.module.less'

export default observer(() => {
  const { UserStore } = useContext(MobXProviderContext)
  const [searchParams] = useSearchParams()
  const curUserStaffId = UserStore.userData.id
  const userStaffId = searchParams.get('staffId') || curUserStaffId
  const { customerInfo, loading } = useGetCurCustomerHook({
    staffId: userStaffId,
  })

  useBack({
    backUrl: `/customerDetail` + window.location.search,
  })

  const list = Array.isArray(customerInfo.groupChatList)
    ? customerInfo.groupChatList
    : []

  return (
    <div
      className={cls({
        [styles['page-content']]: true,
        [styles['empty-page']]: list.length === 0,
      })}>
      <InfiniteList
        loading={loading}
        dataSource={list}
        searchParams={searchParams}
        bordered={false}
        listItemClassName={styles['list-item']}
        renderItem={(item) => {
          return <GroupListItem key={item.id} data={item} />
        }}></InfiniteList>
    </div>
  )
})

const GroupListItem = ({ data }) => {
  return (
    <div className={styles['group-list-item']}>
      <div className={styles['group-list-item-body']}>
        <div className={styles['group-avatar']}>
          <GroupItem key={data.id} data={data} />
        </div>
        <div className={styles['group-item-owner']}>
          群主：
          <span>
            <OpenEle type="userName" openid={data.owner} />
          </span>
        </div>
      </div>
      <p className={styles['group-item-footer']}>
        <span>添加时间</span>
        <span className={styles['group-item-time']}>{data.createTime}</span>
      </p>
    </div>
  )
}
