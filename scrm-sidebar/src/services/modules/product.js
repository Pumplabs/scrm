import { post, get } from '../request'
import { handleTable, handlePageParams, handleObj } from '../utils'

// 获取产品列表
export const GetProductList = async(pager,formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/brProductInfo/pageList', params, {needJson: true}).then(res => handleTable(res));
}
// 根据id获取产品详情
export const GetProductById = async (params = {}) => {
  return get(`/api/brProductInfo/${params.id}`).then(res => handleObj(res))
}