import { post, get } from '../request'
import { handleObj, handleArray } from '../utils'

// 获取预授权码构建信息
export const GetAuthCodeBaseInfo = async (params) => {
  return get('/api/mp/auth/getAuthInfo', params).then(res => handleObj(res))
}

// 授权
export const AuthCompanyOplatform = async (params) => {
  return post('/api/mp/auth/authCallback', params, {
    needJson: true
  })
}

// 获取已授权公众号列表
export const GetAuthOfficialAccount = async () => {
  return get('/api/brMpAccredit/getMpAccreditList').then(res => handleArray(res))
}