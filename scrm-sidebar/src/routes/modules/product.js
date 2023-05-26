import { lazy } from 'react'
import LazyLoad from '../LazyLoad'

const ProductList = lazy(() => import('src/pages/ProductList'))
const ProductDetail = lazy(() => import('src/pages/ProductList/Detail'))

const config = [
  {
    path: 'productList',
    element: (
      <LazyLoad
        comp={ProductList}
        meta={{
          title: '产品',
        }}
      />
    ),
  },
  {
    path: 'productDetail/:id',
    element: (
      <LazyLoad
        comp={ProductDetail}
        meta={{
          title: '产品详情',
        }}
      />
    ),
  },
]
export default config