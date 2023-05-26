import { get, post } from '../request'
import { handleObj } from '../utils'

// 获取SOP推送信息
export const GetPushDetail = async (params) => {
  return get(`/api/brSop/pushDetail`, params).then(res => handleObj(res))
}

// 更新状态
export const UpdateSendStatus = async params => {
  return post(`/api/brSop/updateSendStatus`, params, { needJson: true})
}