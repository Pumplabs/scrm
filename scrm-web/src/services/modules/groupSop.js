import { get, post } from "services/request"
import { handleArray, handleObj, handlePageParams, handleTable } from "services/utils"

// 新增群SOP
export const AddGroupSop = async (params) => {
  return post('/api/brGroupSop/save', params, {needJson: true})
}
// 编辑群SOP
export const EditGroupSop = async (params) => {
  return post("/api/brGroupSop/update", params, {needJson: true})
}
// 群sop详情
export const GetGroupSopById = async (params) => {
  return get(`/api/brGroupSop/${params.id}`).then(res => handleObj(res))
}
// 删除群SOP
export const RemoveGroupSop = async (params) => {
  return post("/api/brGroupSop/delete", params, {needJson: true})
}
// 获取SOP列表
export const GetSopList = async (pager = {}, formVals = {}) => {
  const params = {
    ...formVals,
    ...handlePageParams(pager),
  }
  return post('/api/brGroupSop/pageList', params, {needJson: true}).then(res => handleTable(res))
}
// 更新SOP状态
export const UpdateSopStatus = async (params) => {
  return post("/api/brGroupSop/updateStatus", params, {needJson: true})
}
export const BatchRemoveSop = async (params) => {
  return post("/api/brGroupSop/batchDelete", params, {needJson: true})
}
// 获取规则执行详情
export const GetExecuteRuleDetail = async (params) => {
  return get('/api/brGroupSop/executeDetail', params).then(res => handleArray(res))
}
// 提醒
export const RemindSop = async (params) => {
  return post('/api/brGroupSop/remind', params, {
    needJson: true
  })
}
// 获取符合条件的群聊数量
export const GetGroupCountByFilter = async (params) => {
  return post('/api/brGroupSop/countChat', params, { needJson: true})
}