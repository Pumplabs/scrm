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
const Home = lazy(() => import('src/pages/Home'))
// 日报
const SaleDailyReport = lazy(() => import('src/pages/SaleDailyReport'))
// 客户动态
const CustomerMoment = lazy(() => import('src/pages/CustomerMoment'))
// 首页通知
const HomeNotice = lazy(() => import('src/pages/NoticeSection'))
// 工作台
const Workbench = lazy(() => import('src/pages/Workbench'))

const Apps = lazy(() => import('src/pages/Apps'))
// 首页客户列表
const HomeCustomerList = lazy(() => import('src/pages/CustomerList'))
// 话术库
const TalkScript = lazy(() => import('src/pages/TalkScript'))
// 群欢迎语提醒
const GroupWelComeTip = lazy(() => import('src/pages/TaskRemind/GroupWelCome'))
// 待办列表
const TodoList = lazy(() => import('src/pages/TodoList'))
// 客户群详情
const GroupDetail = lazy(() => import('src/pages/GroupDetail'))
// 单聊会话详情
const ChatDetail = lazy(() => import('src/pages/ChatDetail'))
// 选择客户
const SelectCustomer = lazy(() =>
  import('src/pages/SelectPages/SelectedCustomer')
)
// 选择用户
const SelectUser = lazy(() => import('src/pages/SelectPages/SelectUser'))
// 选择标签
const SelectTag = lazy(() => import('src/pages/SelectPages/SelectTag'))
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
  // {
  //   path: '/noAuth',
  //   element: <NoAuthPage />,
  //   meta: {
  //     title: '账号无权限',
  //   },
  // },
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
        path: 'apps',
        element: <LazyLoad comp={Apps} />,
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
      // 话术库
      { path: 'talkScriptList', element: <LazyLoad comp={TalkScript} /> },
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
      // 群欢迎语提醒
      {
        path: 'groupWelComeTip',
        element: <LazyLoad comp={GroupWelComeTip} />,
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
      // 根进
      ...followConfig,
      // 客户
      ...customerConfig,
      // 待办列表
      ...opportunityConfig,
      {
        path: 'todoList',
        element: <LazyLoad comp={TodoList} meta={{ title: '我的待办' }} />,
      },
      // 客户群发
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
        element: <LazyLoad comp={SaleDailyReport} />
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
