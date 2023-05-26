import axios from "axios"

// 根据code获取客户信息
export const GetUserInfoByCode = async (params) => {
  return axios.get('/api/mp/auth/getCustomerByCode', { params }).then(res => res.data)
}
// 获取海报
export const GetPoster = async (params) => {
  return axios.post("/api/wxFissionH5/getPoster", params).then(res => res.data)
}
// 根据cropId获取公众号信息
export const GetAppIdByCropId = async (params) => {
  return axios.get('/api/mp/auth/getAppIdIdByCorpId', { params }).then(res => res.data)
}

// 获取任务完成情况
export const GetStageFinishDetail = async (params) => {
  return axios.post('/api/wxFissionH5/getFinishDetails', params, {
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.data)
}
// 获取客户助力详情
export const GetCustomerPowerList = async (params) => {
  return axios.post('/api/wxFissionH5/getCustomerDetails', params, {
    headers: {
      "Content-Type": "application/json"
    }
  }).then(res => res.data)
}
// 获取任务剩余时间
export const GetTaskTimeInfo = async (params) => {
  return axios.get('/api/wxFissionH5/getTaskInfo', { params }).then(res => res.data)
}
// 获取客户信息
export const GetCustomerById = async (params) => {
  return axios.get('/api/wxFissionH5/getCustomerInfo', { params }).then(res => res.data)
}
// 获取渠道活码
export const GetQrCode = async (params) => {
  return axios.get("/api/wxFissionH5/getQrCode", { params }).then(res => res.data)
}
// 获取app信息
export const GetAppInfo = async (params) => {
  return axios.get('/api/brMpAccredit/getAppInfoPrivate', { params }).then(res => res.data)
}