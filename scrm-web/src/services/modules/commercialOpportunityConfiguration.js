import { post } from '../request'
import { handleTable, handlePageParams, handleArray } from '../utils'

// 获取分组列表
export const GetGroupList = async (params) => {
  return post('/api/brOpportunityGroup/list', params, { needJson: true }).then(res => handleArray(res))
}

// 增加状态
export const AddStatus = async (params) => {
  return post('/api/brCommonConf/save', params, {needJson: true})
}

// 修改状态
export const EditStatus = async (params) => {
  return post('/api/brCommonConf/update', params, {needJson: true})
}

// 删除状态
export const RemoveStatus = async (params) => {
  return post('/api/brCommonConf/delete', params, {needForm: true})
}
// 配置
export const GetConfigList = async (pager, formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/brCommonConf/pageList', params, {needJson: true}).then(res => handleTable(res))
}
export const GetConfigAllList = async (params) => {
  return post('/api/brCommonConf/list', params, {needJson: true}).then(res => handleArray(res))
}