import { post, get } from '../request'
import { handleArray, handlePageParams, handleTable } from '../utils'

// 获取话术组列表
export const GetTaskScriptGroupList = async (params) => {
  return post('/api/brMediaSayGroup/list', params, {needJson: true}).then(res => handleArray(res))
}

// 查询话术
export const GetTalkScript = async (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post("/api/brMediaSay/pageList", params, {
    needJson: true,
  }).then(res => handleTable(res))
}
