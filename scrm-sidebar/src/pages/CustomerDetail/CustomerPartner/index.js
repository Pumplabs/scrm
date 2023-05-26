import { useMemo, useContext, useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Toast } from 'antd-mobile'
import { MobXProviderContext, observer } from 'mobx-react'
import InfiniteList from 'src/components/InfiniteList'
import OpenEle from 'components/OpenEle'
import { useBack } from 'src/hooks'
import defaultAvatarUrl from 'assets/images/icon/user-icon.svg'
import useGetCurCustomerHook from '../useGetCurCustomerHook'
import styles from './index.module.less'

export default observer(() => {
  const { UserStore } = useContext(MobXProviderContext)
  const [searchParams] = useSearchParams()
  const toastRef = useRef()
  const curUserStaffId = UserStore.userData.id
  const userStaffId = searchParams.get('staffId') || curUserStaffId
  const { customerInfo, loading } = useGetCurCustomerHook({
    staffId: userStaffId,
  })

  const assistStaffList = Array.isArray(customerInfo.assistStaffList) ? customerInfo.assistStaffList : []
  useEffect(() => {
    if (loading) {
      toastRef.current = Toast.show({
        icon: 'loading',
        duration: 0
      })
    } else {
      if (toastRef.current) {
        toastRef.current.close()
        toastRef.current = null
      }
    }
  }, [loading])

  const backUrl = useMemo(() => {
    return `/customerDetail` + window.location.search
  }, [])

  useBack({
    backUrl,
  })

  return (
    <div className={styles['customer-partner-page']}>
      <div className={styles['page-stat-info']}>
        <span className={styles['total-info']}>
          共<span className={styles['total-num']}>{assistStaffList.length}</span>个协作人
        </span>
      </div>
      <div>
      <InfiniteList
        dataSource={assistStaffList}
        searchParams={searchParams}
        wrapClassName={styles['infinite-list']}
        listItemClassName={styles['list-item']}
        bordered={false}
        renderItem={(item) => {
          return <StaffItem key={item.id} data={item} />
        }}></InfiniteList>
      </div>
    </div>
  )
})
const StaffItem = ({ data = {} }) => {
  return (
    <div className={styles['user-item']}>
      <div className={styles['user-item-content']}>
        <img
          src={data.avatarUrl || defaultAvatarUrl}
          className={styles['user-item-icon']}
          alt=""
        />
        <div className={styles['user-item-avatar']}>
          <span>
            <OpenEle type="userName" openid={data.extId} />
          </span>
        </div>
      </div>
    </div>
  )
}
