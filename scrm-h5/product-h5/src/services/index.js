import { get } from './request'

// 获取产品信息
export const GetProductInfo = (params) => {
  return get(
    `/api/brProductInfo/${params.id}`
  )
}
// 增加产品浏览次数
export const AddProductView = (params) => {
  return get('/api/brProductInfo/addViews', params)
}
