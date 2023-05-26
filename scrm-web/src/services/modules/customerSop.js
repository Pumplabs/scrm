
import { get, post } from '../request'
import { handleArray, handleObj, handlePageParams, handleTable } from '../utils'

export const GetSopList = async (pager = {}, formVals = {}) => {
  const params = {
    ...formVals,
    ...handlePageParams(pager),
  }
  return post('/api/brSop/pageList',params, {needJson: true}).then(res => handleTable(res))
}
// 新增Sop
export const AddSop = async (params) => {
  return post('/api/brSop/save', params, {needJson: true})
}
// 获取SOP详情
export const GetSopDetail = async (params) => {
  return get(`/api/brSop/${params.id}`).then(res => handleObj(res))
}
// 编辑SOP
export const EditSop = async (params) => {
  return post("/api/brSop/update", params, {needJson: true})
}
// 删除SOP
export const RemoveSop = async (params) => {
  return post("/api/brSop/delete", params, {needForm: true})
}
// 更新sop状态
export const UpdateSopStatus = async (params) => {
  return post('/api/brSop/updateStatus', params, {needJson: true})
}
// 批量删除
export const BatchRemoveSop = async (params) => {
  return post("/api/brSop/batchDelete", params, {needJson: true})
}
// 获取规则执行详情
export const GetExecuteRuleDetail = async (params) => {
  return get("/api/brSop/executeDetail", params).then(res => handleArray(res))
}
// 提醒
export const RemindSop = async (params) => {
  return post('/api/brSop/remind', params, {
    needJson: true
  })
}
// 获取客户数量
export const GetCustomerCount = async (params) => {
  return post('/api/brSop/countCustomer', params, {needJson: true, })
}
// 获取发送详情
export const GetExecuteDetail = async (params) => {
  return post('/api/brSop/sendDetail', params, {needJson: true}).then(res => handleArray(res))
}