import { get, post } from '../request'
import { handleTable, handlePageParams, handleObj } from '../utils'

// 获取订单列表
export const GetOrderList = async (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/BrOrder/pageList', params, {needJson: true}).then(res => handleTable(res))
}
// 新增订单
export const SaveOrder = async (params) => {
  return post('/api/BrOrder/save', params, {needJson: true})
}
// 编辑订单
export const EditOrder = async (params) => {
  return post('/api/BrOrder/update', params, {needJson: true})
}
// 删除订单
export const RemoveOrder = async (params) => {
  return post('/api/BrOrder/batchDelete', params, {needJson: true})
}
// 订单详情
export const GetOrderDetail = async (params) => {
  return get(`/api/BrOrder/${params.id}`).then(res => handleObj(res))
}