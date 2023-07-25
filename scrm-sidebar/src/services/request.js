import axios from "axios";
import { TOKEN_KEY } from 'utils/constants'
import { handleResponseError } from './utils'

// 需要自定义response的url
let handleResponseUrlMap = {}
// Set config defaults when creating the instance
const instance = axios.create();
// 拦截器
instance.interceptors.request.use(function ({ headers, ...rest }) {
  console.log('token', localStorage.getItem(TOKEN_KEY))
  // TODO: 在发送请求之前做些什么
  return {
    ...rest,
    headers: {
      ...headers,
      token: localStorage.getItem(TOKEN_KEY)
    }
  };
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function (response) {
  const key = `${response.config.method}_${response.config.url}`
  const needHandleResponse = handleResponseUrlMap[key]
  // 如果状态为200，直接return data
  if (response.status === 200) {
    Reflect.deleteProperty(handleResponseUrlMap, key)
    return needHandleResponse ? response : response.data
  }
  // 对响应数据做点什么
  return response;
}, function (error) {
  handleResponseUrlMap = {}
  const handleRes = handleResponseError(error)
  if (handleRes) {
    return Promise.reject(error)
  }
  // const { response } = error;
  // const { code, msg = '', error: errorMsg = '' } = response.data
  // const errorMessage = msg || errorMsg || '服务器错误'
  // switch (response.status) {
  //   case 401:
  //     localStorage.clear()
  //     window.location.href = SYSTEM_PREFIX_PATH
  //     return;
  //   case 500:
  //     if (`${code}` === '111401') {
  //       window.location.href = `${SYSTEM_PREFIX_PATH}/noInstallApp`
  //       return
  //     } else if (`${code}` === '111405') {
  //       window.location.href = `${SYSTEM_PREFIX_PATH}/noInViewRange`
  //       return;
  //     } else if (code) {
  //       window.location.href = `${SYSTEM_PREFIX_PATH}/sysError?${createUrlSearchParams({
  //         title: code,
  //         description: errorMessage
  //       })}`
  //       return;
  //     } else {
  //       return Promise.reject(error)
  //     }
  //   default:
  //     return Promise.reject(error)
  // }
});

function createReq (args) {
  const { needHandleResponse, ...rest } = args
  if (needHandleResponse) {
    handleResponseUrlMap[`${rest.method}_${rest.url}`] = 1
  }
  return instance.request(rest)
}
export function post (url, params = {}, { needJson, needForm, ...rest } = {}) {
  let config = {}
  // const headerFormData = {
  //   "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
  // };
  if (needJson) {
    config.headers = {
      "Content-Type": "application/json"
    }
    config.data = JSON.stringify(params)
  } else if (needForm) {
    config.headers = {
      "Content-Type": "application/x-www-form-urlencoded"
    }
    let formData = new FormData()
    for (const attr in params) {
      formData.append(attr, params[attr])
    }
    config.data = formData
  }
  return createReq({
    url,
    method: 'post',
    // params,
    ...rest,
    ...config,
  })
}
export function get (url, params = {}, { ...rest } = {}) {
  let config = {}
  let reqParams = { ...params }
  // if (needForm) {
  //   config.headers = {
  //     "Content-Type": "application/x-www-form-urlencoded"
  //   }
  //   let formData = new FormData()
  //   for (const attr in reqParams) {
  //     formData.append(attr, reqParams[attr])
  //   }
  //   config.data = formData
  // } else {
  // }
  reqParams = {
    ...reqParams,
    time: Date.now()
  }
  config.params = reqParams
  return createReq({
    url,
    method: 'get',
    ...rest,
    ...config,
  })
}