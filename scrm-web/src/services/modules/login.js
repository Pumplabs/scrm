import { get, post } from '../request'
import { handleObj } from '../utils'

export const getLoginUrl = async () => {
  return get('/api/staff-login/getLoginUrl')
}
// 获取企业信息
export async function GetLoginQrcodeInfo() {
  return post(`/api/staff-login/login`);
}
// 根据code获取用户信息
export const GetUserInfoByCode = (params) => {

  return get('/api/staff-login/v2/getStaffByCode', params)
}
// 获取用户信息
export async function GetUserInfoByToken() {
  return get("/api/staff-login/getCurrentStaff")
}

// 获取签名
export const GetSignature = (params) => {
  return get('/api/common/signature', params).then(res => handleObj(res))
}
