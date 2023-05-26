import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { encode } from 'js-base64'
import InfiniteList from 'src/components/InfiniteList'
import { useInfiniteHook } from 'src/hooks'
import { GetOrderList } from 'services/modules/order'
import OrderItem from './components/OrderItem'
import { encodeUrl } from 'src/utils/paths'
import styles from './index.module.less'

export default ({ status = '', searchText, searchCount }) => {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const {
    tableProps,
    run: runGetOrderList,
    params: fetchParams,
  } = useInfiniteHook({
    manual: true,
    request: GetOrderList,
    defaultPageSize: 20,
    rigidParams: {
      status,
    },
  })

  useEffect(() => {
    runGetOrderList({}, 
    {
      orderCode: searchText
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, searchCount])

  const onDetail = (item) => {
    navigate(`/orderDetail/${encode(item.id)}?${encodeUrl({
      backUrl: `${pathname}?tab=${status}`
    })}`)
  }

  return (
    <div className={styles['tab-pane']}>
      <p className={styles['stat-info']}>
        共<span className={styles['order-count']}>{tableProps.pagination.total}</span>个订单
      </p>
      <div className={styles['tab-pane-content']}>
        <InfiniteList
          {...tableProps}
          loadNext={runGetOrderList}
          searchParams={fetchParams}
          bordered={false}
          listItemClassName={styles['list-item']}
          renderItem={(ele) => (
            <OrderItem onDetail={onDetail} data={ele} />
          )}></InfiniteList>
      </div>
    </div>
  )
}
