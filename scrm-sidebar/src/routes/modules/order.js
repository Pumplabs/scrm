import { lazy } from 'react'
import LazyLoad from '../LazyLoad'

// 订单列表
const OrderList = lazy(() => import('src/pages/OrderList'))
// 订单详情
const OrderDetail = lazy(() => import('src/pages/OrderList/Detail'))
// 新增订单
const AddOrder = lazy(() => import('src/pages/OrderList/AddOrder'))

const config = [
  {
    path: 'orderList',
    element: (
      <LazyLoad
        comp={OrderList}
        meta={{
          title: '订单',
        }}
      />
    ),
  }, 
  {
    path: 'orderDetail/:id',
    element: (
      <LazyLoad
        comp={OrderDetail}
        meta={{
          title: '订单详情',
        }}
      />
    ),
  },
  {
    path: 'addOrder',
    element: (
      <LazyLoad
        comp={AddOrder}
        meta={{
          title: '创建订单',
        }}
      />
    ),
  },
  {
    path: 'editOrder/:id',
    element: (
      <LazyLoad
        comp={AddOrder}
        meta={{
          title: '修改订单',
        }}
      />
    ),
  }
]
export default config