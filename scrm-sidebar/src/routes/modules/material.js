import { lazy } from 'react'
import LazyLoad from '../LazyLoad'

// 素材库
const MaterialLib = lazy(() => import('src/pages/Material'))
// 素材列表
const MaterialList = lazy(() => import('src/pages/Material/MaterialList'))
// 新增素材
const AddMaterial = lazy(() => import('src/pages/Material/AddMaterial'))
// 素材详情
const MaterialDetail = lazy(() => import('src/pages/Material/MaterialDetail'))
const config = [
  { path: 'material', element: <LazyLoad comp={MaterialLib} /> },
  { path: 'materialList', element: <LazyLoad comp={MaterialList} /> },
  {
    path: 'addMaterial',
    element: <LazyLoad comp={AddMaterial}
    />,
  },
  {
    path: 'materialInfo/:id',
    element: <LazyLoad comp={MaterialDetail}/>
  }
]
export default config
