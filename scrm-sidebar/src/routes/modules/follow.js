import { lazy } from 'react'
import LazyLoad from '../LazyLoad'

// 编辑跟进
const EditFollow = lazy(() => import('src/pages/FollowList/EditFollow'))
// 跟进详情
const FollowDetail = lazy(() => import('src/pages/FollowDetail'))
// 跟进
const GlobalCustomerFollow = lazy(() => import('src/pages/FollowList'))
// 添加客户跟进
const AddCustomerFollow = lazy(() => import('src/pages/FollowList/AddCustomerFollow'))
// 创建任务
const AddFollowTask = lazy(() => import('src/pages/FollowList/AddCustomerFollow/AddTask'))
const config = [
  {
    path: 'followList',
    element: (
      <LazyLoad
        comp={GlobalCustomerFollow}
        meta={{
          title: '客户跟进',
        }}
      />
    ),
  },
  {
    path: 'addFollow',
    element: <LazyLoad comp={EditFollow} meta={{ title: '添加跟进' }} />,
  },
  {
    path: 'addCustomerFollow',
    element: <LazyLoad comp={AddCustomerFollow} meta={{title: '跟进'}}/>,
  },
  {
    path: 'addCustomerTask',
    element: <LazyLoad comp={AddFollowTask} meta={{title: '创建任务'}}/>
  },
  {
    path: 'editCustomerTask/:id',
    element: <LazyLoad comp={AddFollowTask} meta={{title: '修改任务'}}/>
  },
  {
    path: 'addOppFollowTask',
    element: <LazyLoad comp={AddFollowTask} meta={{title: '创建任务'}}/>
  },
  {
    path: 'editOppFollowTask/:id',
    element: <LazyLoad comp={AddFollowTask} meta={{title: '创建任务'}}/>
  },
  {
    path: 'editCustomerFollow/:id',
    element: <LazyLoad comp={EditFollow} meta={{ title: '编辑跟进' }} />,
  },
  {
    path: 'editFollow/:id',
    element: <LazyLoad comp={EditFollow} meta={{ title: '编辑跟进' }} />,
  },
  {
    path: 'editNoticeFollow/:id',
    element: <LazyLoad comp={EditFollow} meta={{ title: '编辑跟进' }} />,
  },
  {
    path: 'customerfollowDetail/:id',
    element: <LazyLoad comp={FollowDetail} meta={{ title: '跟进详情' }} />,
  },
  {
    path: 'followDetail/:id',
    element: <LazyLoad comp={FollowDetail} meta={{ title: '跟进详情' }} />,
  },
  {
    path: 'momentfollowDetail/:id',
    element: <LazyLoad comp={FollowDetail} meta={{ title: '跟进详情' }} />,
  },
  {
    path: 'noticefollowDetail/:id',
    element: <LazyLoad comp={FollowDetail} meta={{ title: '跟进详情' }} />,
  },
  {
    path: 'noticeReplyfollowDetail/:id',
    element: <LazyLoad comp={FollowDetail} meta={{ title: '跟进详情' }} />,
  }
]
export default config
