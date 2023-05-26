
import { post, get } from '../request'
import { handleTable, handlePageParams, handleArray } from '../utils'

// 获取标签组列表
export const GetMaterialTagGroupList = async(pager,formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/mediaTagGroup/pageList', params, {needJson: true}).then(res => handleTable(res));
}
// 新增标签组
export const AddMaterialGroup = async (params) => {
  return post('/api/mediaTagGroup/save', params, {needJson: true})
}

// 修改标签组
export const EditMaterialGroup = async (params) => {
  return post("/api/mediaTagGroup/update", params, {needJson: true})
}
// 删除标签组
export const RemoveMaterialGroup = async (params) => {
  return post("/api/mediaTagGroup/delete", {...params}, {needForm: true})
}
// 查询单个标签组
export const GetMaterialGroupDetail = async (params) => {
  return get(`/api/mediaTagGroup/${params.id}`)
}
// 新增标签
export const AddMaterialTag = async (params = {}) => {
  return post('/api/mediaTag/save', params, {needJson: true})
}