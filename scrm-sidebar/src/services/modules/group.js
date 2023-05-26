import { get, post } from '../request'
import { handleObj, handlePageParams, handleTable } from '../utils'

export const GetGroupByExtId = async (params) => {
  return get(`/api/wxGroupChat/getByExtId`, params).then((res) => handleObj(res))
}
// 批量打群聊标签
export const MarkGroupChatTag = async (params) => {
  return post('/api/wxGroupChatTag/batchMarking', params, {needJson: true})
}

// 获取群聊标签组列表
export const GetGroupChatTagGroupList = async(pager,formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/wxGroupChatTagGroup/pageList', params, {needJson: true}).then(res => handleTable(res));
}
/**
 * 获取群聊列表
 */
 export const GetGroupList = async (pager = {}, formVals = {}) => {
  const { tags = [], ...rest } = formVals
  const params = {
    ...handlePageParams(pager),
    tagIdList: tags.map((ele) => ele.id),
    ...rest,
  }
  return post('/api/wxGroupChat/pageList', params, { needJson: true }).then(
    (res) => handleTable(res)
  )
}
// 获取群统计
export const GetGroupStatics = async (params) => {
  return get('/api/wxGroupChat/getTodayStatics', params).then(res => handleObj(res))
}