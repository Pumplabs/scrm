import { lazy } from 'react'
import LazyLoad from '../LazyLoad'

// 客户基本信息
const CustomerBaseInfo = lazy(() =>
  import('src/pages/CustomerDetail/CustomerBaseInfo')
)
// 客户群聊
const CustomerGroup = lazy(() =>
  import('src/pages/CustomerDetail/CustomerGroup')
)
// 客户员工
const CustomerUsers = lazy(() =>
  import('src/pages/CustomerDetail/CustomerUsers')
)
// 客户详情
const CustomerDetail = lazy(() => import('src/pages/CustomerDetail'))
// 客户协作员工
const CustomerPartner = lazy(() => import('src/pages/CustomerDetail/CustomerPartner'))
const config = [
  {
    path: 'customerDetail',
    element: <LazyLoad comp={CustomerDetail} />,
  },
  {
    path: 'customerDetail/customerBaseInfo',
    element: <LazyLoad comp={CustomerBaseInfo} meta={{title: '客户信息'}}/>,
  },
  {
    path: 'customerDetail/customerGroup',
    element: <LazyLoad comp={CustomerGroup} meta={{ title: '关联群聊' }} />,
  },
  {
    path: 'customerDetail/customerUsers',
    element: <LazyLoad comp={CustomerUsers} meta={{title: '关联员工'}}/>,
  },
  {
    path: 'customerDetail/partner',
    element: <LazyLoad comp={CustomerPartner} meta={{title: '协作员工'}}/>
  }
]
export default config