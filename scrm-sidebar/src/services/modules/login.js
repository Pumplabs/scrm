import { get, post } from '../request'
import { encodeParams } from '../utils'

// 获取企业信息
export async function GetLoginQrcodeInfo() {
  return post(`/api/staff-login/login`);
}
// 获取签名
export const GetSignature = (params) => {
  return get('/api/common/signature', params)
}

// 根据code获取用户信息
export const GetUserInfoByCode = (params) => {
  return get('/api/staff-login/v2/getStaffByCode', params)
}

// 获取员工信息
export const GetUserInfo = () => {
  return get('/api/staff-login/getCurrentStaff')
}

// 静默登录
export const SilentLogin = ({ redirect, agentId, appId }) => {
  const loginUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize'
  const params = {
    appid: appId,
    redirect_uri: encodeURI(redirect),
    response_type: 'code',
    agentid: agentId,
    scope: 'snsapi_privateinfo',
  }
  const a = document.createElement('a')
  console.log(redirect, encodeURIComponent(redirect));
  const url = `${loginUrl}?appid=${appId}&agentid=${agentId}&redirect_uri=${encodeURIComponent(redirect)}&response_type=code&scope=snsapi_privateinfo&state=STATE#wechat_redirect&timestamp=${Date.now()}`
  window.location.href = url;
}