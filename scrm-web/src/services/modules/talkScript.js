import { post } from '../request'
import { handleArray, handlePageParams, handleTable } from '../utils'

// 获取话术组列表
export const GetTaskScriptGroupList = async (params) => {
  return post('/api/brMediaSayGroup/list', params, {needJson: true}).then(res => handleArray(res))
}
// 新增话术组
export const AddTalkScriptGroup = async (params) => {
  return post("/api/brMediaSayGroup/save", params, {
    needJson: true
  })
}
// 编辑话术组
export const EditTalkScriptGroup = async params => {
  return post("/api/brMediaSayGroup/update", params, {
    needJson: true
  })
}
// 删除话术组
export const RemoveTalkScriptGroup = async params => {
  return post('/api/brMediaSayGroup/delete', params, {
    needForm: true
  })
}
// 新增话术
export const AddTalkScript = async params => {
  return post("/api/brMediaSay/save", params, {
    needJson: true,
  })
}

// 编辑话术
export const EditTalkScript = async params => {
  return post("/api/brMediaSay/update", params, {
    needJson: true,
  })
}

// 删除话术
export const RemoveTalkScript = async params => {
  return post("/api/brMediaSay/batchDelete", params, {
    needJson: true,
  })
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