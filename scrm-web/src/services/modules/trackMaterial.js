import { post, get } from '../request'
import { handleTable, handlePageParams, handleObj } from '../utils'

// 获取素材列表
export const GetTrackMaterialList = async(pager,formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post('/api/mediaInfo/pageList', params, {needJson: true}).then(res => handleTable(res));
}
// 新增素材
export const AddTrackMaterial = async (params) => {
  return post('/api/mediaInfo/save', params, {needJson: true})
}
// 编辑素材
export const EditTrackMaterial = async (params) => {
  return post('/api/mediaInfo/update', params, {needJson: true})
}
// 删除素材
export const RemoveTrackMaterial = async (params) => {
  return post('/api/mediaInfo/batchDelete', params, {needJson: true})
}
// 获取素材详情
export const GetMaterialDetail = async (params) => {
  return get(`/api/mediaInfo/${params.id}`).then(res => handleObj(res))
}
// 获取轨迹素材数据
export const GetMaterialData = async (pager,formVals = {}) => {
  const params = {
    ...handlePageParams(pager),
    ...formVals
  }
  return post(`/api/wxDynamicMedia/listLookRemark`, params, { needJson: true}).then(res => handleTable(res))
}