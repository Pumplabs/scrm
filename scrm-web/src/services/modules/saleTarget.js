

import {  post, get } from '../request'
import { handleArray } from '../utils'

// 获取销售目标列表
export const GetSaleTargetList = async (params = {}) => {
  const { time} = params
  return post('/api/brSaleTarget/list', {
    month: time ? time.format('YYYY-MM') : ''
  }, { needJson: true}).then(res => handleArray(res))
}
// 新增销售目标
export const AddSaleTarget = async (params) => {
  return post('/api/brSaleTarget/save', params, {needJson: true})
}
// 删除销售目标
export const RemoveSaleTarget = async (params) => {
  return post('/api/brSaleTarget/delete', params, { needForm: true})
}
// 修改目标
export const EditSaleTarget = async (params) => {
  return post('/api/brSaleTarget/update', params, {needJson: true})
}
export const GetSaleTargetDetail = async (params) => {
  return get(`/api/brSaleTarget/${params.id}`).then(res => handleArray(res))
}