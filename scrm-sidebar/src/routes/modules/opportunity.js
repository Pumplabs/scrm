import { lazy } from 'react'
import LazyLoad from '../LazyLoad'

const Opportunity = lazy(() => import('src/pages/Opportunity/List'))
const OpportunityDetail = lazy(() => import('src/pages/Opportunity/Detail'))
const OppFollowDetail = lazy(() => import('src/pages/Opportunity/FollowDetail'))
const OppAddFollow = lazy(() => import('src/pages/Opportunity/AddFollow'))
const SelectOppTaskUser = lazy(() =>
  import('src/pages/SelectPages/SelectOppTaskUser')
)
const AddOpp = lazy(() => import('src/pages/Opportunity/AddOpp'))
const config = [
  {
    path: 'opportunity',
    element: (
      <LazyLoad
        comp={Opportunity}
        meta={{
          title: '商机',
        }}
      />
    ),
  },
  {
    path: 'opportunity/:id',
    element: (
      <LazyLoad
        comp={OpportunityDetail}
        meta={{
          title: '商机详情',
        }}
      />
    ),
  },
  {
    path: 'oppFollowDetail/:id',
    element: (
      <LazyLoad
        comp={OppFollowDetail}
        meta={{
          title: '跟进详情',
        }}
      />
    ),
  },
  {
    path: 'oppAddFollow/:oppId',
    element: (
      <LazyLoad
        comp={OppAddFollow}
        meta={{
          title: '新增跟进',
        }}
      />
    ),
  },
  {
    path: 'selectOppTaskUser/:oppId',
    element: <LazyLoad comp={SelectOppTaskUser} />,
  },
  {
    path: 'addOpp',
    element: (
      <LazyLoad
        comp={AddOpp}
        meta={{
          title: '创建商机',
        }}
      />
    ),
  },
  {
    path: 'editOpp/:id',
    element: (
      <LazyLoad
        comp={AddOpp}
        meta={{
          title: '编辑商机',
        }}
      />
    ),
  },
]
export default config
