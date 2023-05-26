import { lazy } from 'react'
import LazyLoad from '../LazyLoad'

// 客户群发
const CustomerMass = lazy(() => import('src/pages/CustomerMass'))
// 新增客户群发
const AddCustomerMass = lazy(() => import('src/pages/CustomerMass/AddCustomerMass'))
// 客户群发成功界面
const CustomerMassSuccess = lazy(() => import('src/pages/CustomerMass/CustomerMassSuccess'))
// 客户群发详情
const CustomerMassDetail = lazy(() => import('src/pages/CustomerMass/CustomerMassDetail'))
// 群发基本信息详情
const CustomerMassInfoDetail = lazy(() => import('src/pages/CustomerMass/CustomerMassInfoDetail'))
// 客户群群发
const GroupMass = lazy(() => import('src/pages/GroupMass'))
// 新增客户群群发
const AddGroupMass = lazy(() => import('src/pages/GroupMass/AddGroupMass'))
const GroupMassDetail = lazy(() => import('src/pages/GroupMass/GroupMassDetail'))
const GroupMassInfoDetail = lazy(() => import('src/pages/GroupMass/GroupMassInfoDetail'))
// 客户群发
const config = [
  {
    path: 'customerMass',
    element: <LazyLoad comp={CustomerMass} meta={{ title: '客户群发' }} />,
  },
  // 新增客户群发
  {
    path: 'addCustomerMass',
    element: <LazyLoad comp={AddCustomerMass} meta={{ title: '新增客户群发' }} />,
  },
  // 发送结果
  {
    path: 'customerMassSuccess',
    element: <LazyLoad comp={CustomerMassSuccess} meta={{ title: '发送结果' }} />,
  },
  // 群发详情
  {
    path: 'customerMassInfoDetail/:id',
    element: <LazyLoad comp={CustomerMassInfoDetail} meta={{ title: '群发详情' }} />,
  },
  {
    path: 'customerMassDetail/:id',
    element: <LazyLoad comp={CustomerMassDetail} meta={{ title: '群发详情' }} />,
  },
  {
    path: 'groupMass',
    element: <LazyLoad comp={GroupMass} meta={{ title: '客户群群发' }} />,
  },
  {
    path: 'addGroupMass',
    element: <LazyLoad comp={AddGroupMass} meta={{ title: '新增客户群群发' }} />,
  },
  {
    path: 'groupMassDetail/:id',
    element: <LazyLoad comp={GroupMassDetail} meta={{ title: '群发详情' }} />,
  },
  {
    path: 'groupMassInfoDetail/:id',
    element: <LazyLoad comp={GroupMassInfoDetail} meta={{ title: '群发详情' }} />,
  }
]
export default config