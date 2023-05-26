import { lazy } from 'react'
import {
  InvidEntry,
  MissingParam,
  NoInstallApp,
  NoFound,
  NotInVisibleRange,
  NoSeat,
  SysError,
  NoUserInfo,
} from 'src/pages/Exceptions'
import Layout from 'src/layout'
import LazyLoad from './LazyLoad'
// 本地登录界面
import LocalLogin, { LoginSuccess } from 'src/pages/Login'
import followConfig from './modules/follow'
import customerConfig from './modules/customer'
import material from './modules/material'
import opportunityConfig from './modules/opportunity'
import product from './modules/product'
import order from './modules/order'
import massRoutes from './modules/mass'
const Home = lazy(() => import('src/pages/Home'))
const SaleDailyReport = lazy(() => import('src/pages/SaleDailyReport'))
const CustomerMoment = lazy(() => import('src/pages/CustomerMoment'))
const HomeNotice = lazy(() => import('src/pages/NoticeSection'))
const Workbench = lazy(() => import('src/pages/Workbench'))
const HomeCustomerList = lazy(() => import('src/pages/CustomerList'))
const TalkScript = lazy(() => import('src/pages/TalkScript'))
const CustomerSopRemind = lazy(() => import('src/pages/TaskRemind/CustomerSop'))
const UserMomentsRemind = lazy(() => import('src/pages/TaskRemind/UserMoments'))
const GroupSopRemind = lazy(() => import('src/pages/TaskRemind/GroupSop'))
const GroupWelComeTip = lazy(() => import('src/pages/TaskRemind/GroupWelCome'))
const TodoList = lazy(() => import('src/pages/TodoList'))
const GroupDetail = lazy(() => import('src/pages/GroupDetail'))
const ChatDetail = lazy(() => import('src/pages/ChatDetail'))
const SelectCustomer = lazy(() =>
  import('src/pages/SelectPages/SelectedCustomer')
)
// 选择用户
const SelectUser = lazy(() => import('src/pages/SelectPages/SelectUser'))
// 选择标签
const SelectTag = lazy(() => import('src/pages/SelectPages/SelectTag'))

const config = [
  {
    path: '/login',
    element: <LocalLogin />,
  },
  {
    path: '/loginSuccess',
    element: <LoginSuccess />,
  },
  {
    path: '/enterError',
    element: <InvidEntry />,
  },
  {
    path: '/sysError',
    element: <SysError />,
    meta: {
      title: '系统异常',
    },
  },
  {
    path: '/missingParam',
    element: <MissingParam />,
  },
  {
    path: '/noInstallApp',
    element: <NoInstallApp />,
    meta: {
      title: '应用无权限',
    },
  },
  {
    path: '/noInViewRange',
    element: <NotInVisibleRange />,
    meta: {
      title: '账号无权限',
    },
  },
  {
    path: '/noSeat',
    element: <NoSeat />,
    meta: {
      title: '账号未开通席位',
    },
  },
  {
    path: '/noUser',
    element: <NoUserInfo />,
    meta: {
      title: '用户信息不存在',
    },
  },
  {
    path: '/home',
    element: <LazyLoad comp={Home} />,
    children: [
      {
        index: true,
        element: <LazyLoad comp={Workbench} />,
      },
      {
        path: 'cusotmerList',
        element: <LazyLoad comp={HomeCustomerList} />,
      },
      {
        path: 'notice',
        element: <LazyLoad comp={HomeNotice} />,
      },
      {
        path: '*',
        element: <NoFound />,
      },
    ],
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'talkScript', element: <LazyLoad comp={TalkScript} /> },
      {
        path: 'selectCustomer',
        element: <LazyLoad comp={SelectCustomer} />,
      },
      {
        path: 'selectUser',
        element: <LazyLoad comp={SelectUser} />,
      },
      {
        path: 'selectTag',
        element: <LazyLoad comp={SelectTag} />,
      },
      {
        path: 'groupWelComeTip',
        element: <LazyLoad comp={GroupWelComeTip} />,
      },
      {
        path: 'groupSopRemind',
        element: <LazyLoad comp={GroupSopRemind} />,
      },
      {
        path: 'userMomentsRemind',
        element: <LazyLoad comp={UserMomentsRemind} />,
      },
      {
        path: 'customerSopRemind',
        element: <LazyLoad comp={CustomerSopRemind} />,
      },
      {
        path: 'customerMoment',
        meta: {
          title: '客户动态',
        },
        element: (
          <LazyLoad
            comp={CustomerMoment}
            meta={{
              title: '客户动态',
            }}
          />
        ),
      },
      ...material,
      // 跟进
      ...followConfig,
      // 客户
      ...customerConfig,
      // 待办列表
      ...opportunityConfig,
      // 客户群发、客户群群发
      ...massRoutes,
      {
        path: 'todoList',
        element: <LazyLoad comp={TodoList}  meta={{ title: '我的待办' }}/>,
      },
      {
        path: 'groupDetail',
        element: <LazyLoad comp={GroupDetail} />,
      },
      {
        path: 'chatDetail',
        element: <LazyLoad comp={ChatDetail} />,
      },
      ...product,
      ...order,
      {
        path: 'saleReport',
        element: <LazyLoad comp={SaleDailyReport}/>
      },
      {
        path: '*',
        element: <NoFound />,
      },
    ],
  },
  {
    path: '*',
    element: <NoFound />,
  },
]
export default config
export const WHITE_LIST = [
  '/login',
  '/noUser',
  '/enterError',
  '/noSeat',
  '/noInViewRange',
  '/noInstallApp',
  '/missingParam',
  '/sysError',
  '/loginSuccess',
]
