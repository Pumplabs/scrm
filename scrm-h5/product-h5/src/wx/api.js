import { get } from 'src/services/request';
import { encodeUrl } from 'src/tools';

// 获取授权信息
export const GetAuthInfo = (params) => get('/api/mp/auth/getAppIdIdByCorpId', params);

// 显式授权登录
export const ExplicitAuthLogin = (params = {}) => {
  const url = `${encodeUrl('https://open.weixin.qq.com/connect/oauth2/authorize', [
    {
      name: 'appid',
      value: params.appId,
    },
    {
      name: 'redirect_uri',
      value: encodeURI(params.redirectUrl),
    },
    {
      name: 'response_type',
      value: 'code',
    },
    {
      name: 'scope',
      value: 'snsapi_userinfo',
    },
    {
      name: 'state',
      value: 'STATE',
    },
  ])}#wechat_redirect`;

  return new Promise((reoslve) => {
    const a = document.createElement('a');
    a.href = url;
    a.click();
    // 100毫秒后执行这里
    setTimeout(() => {
      reoslve();
    }, 1000);
  });
};

// 静默登录
export const SilentAuthLogin = ({ appId, redirectUrl }) => {
  const baseUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize';
  const loginUrl = encodeUrl(baseUrl, {
    appid: appId,
    redirect_uri: encodeURI(redirectUrl),
    response_type: 'code',
    scope: 'snsapi_userinfo',
    state: 'STATE#wechat_re',
  });
  const a = document.createElement('a');
  a.href = loginUrl;
  a.click();
};
// 获取客户信息
export const GetCustomerInfo = (params) => get('/api/mp/auth/getCustomerByCode', params);
