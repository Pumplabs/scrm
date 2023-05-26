import { post } from '../request'
import { handleTable, handlePageParams, handleArray } from '../utils'

// 获取群聊标签组列表
export const GetGroupChatTagGroupList = async(pager,formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/wxGroupChatTagGroup/pageList', params, {needJson: true}).then(res => handleTable(res));
}
// 获取群聊标签组全部列表
export const GetGroupChatTagGroupAllList = async(params = {}) => {
  return post('/api/wxGroupChatTagGroup/list', params, {needJson: true}).then(res => handleArray(res))
}
// 新增群聊标签组
export const AddGroupChatTagGroup = async (params) => {
  return post('/api/wxGroupChatTagGroup/save', params, {needJson: true})
}
// 编辑群聊标签组
export const EditGroupChatTagGroup = async (params) => {
  return post('/api/wxGroupChatTagGroup/update', params, {needJson: true})
}
// 删除标签组
export const DelGroupChatTagGroup = async (params) => {
  return post('/api/wxGroupChatTagGroup/delete', params, {needForm: true})
}
// 新增群聊标签
export const AddGroupChatTag = async (params) => {
  return post("/api/wxGroupChatTag/save", params, {needJson: true})
}
// 批量打群聊标签
export const MarkGroupChatTag = async (params) => {
  return post('/api/wxGroupChatTag/batchMarking', params, {needJson: true})
}
