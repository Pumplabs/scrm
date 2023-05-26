import { get, post } from '../request'
import { handleObj } from '../utils'

// 获取SOP推送信息
export const GetPushDetail = async (params) => {
  return get(`/api/brGroupSop/pushDetail`, params).then(res => handleObj(res))
}

// 更新发送状态
export const UpdateSendStatus = async (params) => {
  return post('/api/brGroupSop/updateSendStatus', params, {needJson: true})
}