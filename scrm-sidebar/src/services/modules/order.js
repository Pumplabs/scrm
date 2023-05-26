import { post, get } from '../request'
import { handleTable, handlePageParams, handleObj } from '../utils'

// 新增订单
export const AddOrder = async(params) => {
  return post('/api/BrOrder/save', params, {needJson: true})
}
// 订单列表
export const GetOrderList = async(pager,formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/BrOrder/pageList', params, {needJson: true}).then(res => handleTable(res));
}
// 获取订单详情
export const GetOrderDetail = async (params) => {
  return get(`/api/BrOrder/${params.id}`).then(res => handleObj(res))
}
// 编辑订单
export const EditOrder = async (params) => {
  return post('/api/BrOrder/update', params, { needJson: true})
}