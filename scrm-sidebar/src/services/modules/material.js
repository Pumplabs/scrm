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

// 获取素材详情
export const GetMaterialDetail = async (params) => {
  return get(`/api/mediaInfo/${params.id}`).then(res => handleObj(res))
}

// 增加发送次数
export const AddSendCount = async (params) => {
  return post('/api/brMediaCount/addSendCount', params, {needJson: true})
}
// 新增素材
export const AddTrackMaterial = async (params) => {
  return post('/api/mediaInfo/save', params, {needJson: true})
}
// 获取文件预览
export const GetFilePreview = async (params) => {
  return get('/api/common/getPreviewInfo', params).then(res => handleObj(res))
}