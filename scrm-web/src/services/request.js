import axios from 'axios'
import { Modal, message } from 'antd'
import { TOKEN_KEY } from 'src/utils/constants'
import store from 'store'

export const showUserExpiredModal = (
  msg = '您的登录信息已失效，请重新登录'
) => {
  Modal.error({
    title: '提示',
    centered: true,
    content: msg,
    onOk: () => {
      store.UserStore.logout()
    },
  })
}

// 需要自定义response的url
let handleResponseUrlMap = {}
// Set config defaults when creating the instance
const instance = axios.create()
// 拦截器
instance.interceptors.request.use(
  function ({ headers, ...rest }) {
    // TODO: 在发送请求之前做些什么
    return {
      ...rest,
      headers: {
        ...headers,
        token: localStorage.getItem(TOKEN_KEY),
      },
    }
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
instance.interceptors.response.use(
  function (response) {
    const key = `${response.config.method}_${response.config.url}`
    const needHandleResponse = handleResponseUrlMap[key]
    // 如果状态为200，直接return data
    if (response.status === 200) {
      Reflect.deleteProperty(handleResponseUrlMap, key)
      return needHandleResponse ? response : response.data
    }
    // 对响应数据做点什么
    return response
  },
  function (error) {
    handleResponseUrlMap = {}
    const { response } = error
    const { code, msg = '', error: errorMsg = '' } = response.data
    const errorMessage = msg || errorMsg || '服务器错误'
    switch (response.status) {
      case 401:
        store.UserStore.logout()
        // showUserExpiredModal()
        break
      case 500:
        if (msg.includes('token')) {
          showUserExpiredModal()
        } else if (`${code}` === '111401') {
          Modal.error({
            title: '提示',
            centered: true,
            content: (
              <div>
                <p>您还没安装蓬勃来客呢，请前往安装吧!</p>
              </div>
            ),
            okText: '去安装',
            onOk: () => {
              window.location.replace(
                `${window.location.origin}/middle-page.html`
              )
              // this.logout()
            },
          })
          return
        } else if (`${code}` === '111405') {
          // 不在可见范围内
          Modal.error({
            title: '提示',
            centered: true,
            content: (
              <div>您不在可见范围或没有开通席位，请联系管理员处理</div>
            ),
            okText: '重新登录',
            onOk: () => {
              store.UserStore.logout()
            },
          })
        } else if (!store.UserStore.userData.extId) {
          showUserExpiredModal(errorMessage)
          // 如果没有用户信息
        } else {
          message.error(msg)
          return Promise.reject(error)
        }
        break
      default:
        return Promise.reject(error)
    }
  }
)

function createReq(args) {
  const { needHandleResponse, ...rest } = args
  if (needHandleResponse) {
    handleResponseUrlMap[`${rest.method}_${rest.url}`] = 1
  }
  // transformResponse: [function (data) {
  //   // TODO: 对 data 进行任意转换处理
  //   return data;
  // }],
  return instance.request(rest)
}
export function post(url, params = {}, { needJson, needForm, ...rest } = {}) {
  let config = {}
  // const headerFormData = {
  //   "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
  // };
  if (needJson) {
    config.headers = {
      'Content-Type': 'application/json',
    }
    config.data = JSON.stringify(params)
  } else if (needForm) {
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
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
export function get(url, params = {}, { needForm, ...rest } = {}) {
  let config = {}
  let reqParams = { ...params }
  if (needForm) {
    config.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    }
    let formData = new FormData()
    for (const attr in reqParams) {
      formData.append(attr, reqParams[attr])
    }
    config.data = formData
  } else {
    reqParams = {
      ...reqParams,
      time: Date.now(),
    }
    config.params = reqParams
  }
  return createReq({
    url,
    method: 'get',
    ...rest,
    ...config,
  })
}
