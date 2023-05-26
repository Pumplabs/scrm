import cls from 'classnames'
import { useMemo, useContext } from 'react'
import { useSearchParams } from 'react-router-dom'
import { MobXProviderContext, observer } from 'mobx-react'
import InfiniteList from 'src/components/InfiniteList'
import DetailCard from 'components/DetailCard'
import OpenEle from 'components/OpenEle'
import { useBack } from 'src/hooks'
import defaultAvatarUrl from 'assets/images/icon/user-icon.svg'
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
  
  const backUrl = useMemo(() => {
    return `/customerDetail` + window.location.search
  }, [])

  useBack({
    backUrl
  })

  const list = Array.isArray(customerInfo.followStaffList)
    ? customerInfo.followStaffList
    : []
  return (
    <DetailCard title="关联员工" backUrl={backUrl} loading={loading}
    bodyClassName={styles['page-body']}>
      <div
        className={cls({
          [styles['page-content']]: true,
          [styles['empty-page']]: list.length === 0,
        })}>
        <InfiniteList
          dataSource={list}
          searchParams={searchParams}
          listItemClassName={styles['list-item']}
          renderItem={(item) => {
            return <GroupItem key={item.id} data={item} />
          }}></InfiniteList>
      </div>
    </DetailCard>
  )
})

const GroupItem = ({ data = {} }) => {
  return (
    <div className={styles['user-item']}>
      <div className={styles['user-item-content']}>
        <div className={styles['user-item-avatar']}>
          <img
            src={data.avatarUrl || defaultAvatarUrl}
            className={styles['user-item-icon']}
            alt=""
          />
          <span>
            <OpenEle type="userName" openid={data.extId} />
          </span>
        </div>
      </div>
      <p className={styles['user-item-footer']}>
        <span>添加时间</span>
        <span className={styles['user-item-time']}>{data.createdAt}</span>
      </p>
    </div>
  )
}
