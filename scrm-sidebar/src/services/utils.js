import { saveAs } from 'file-saver';
import { get, isEmpty } from 'lodash'
import { Toast } from 'antd-mobile'
import { encode } from 'js-base64'
import { getLoginRedirectUrl } from 'src/pages/Login'
import { createUrlSearchParams } from 'src/utils'
import { SUCCESS_CODE, SYSTEM_PREFIX_PATH } from 'utils/constants'

export const handleTable = (res = {}) => {
  const list =
    res.code === SUCCESS_CODE && res.data && Array.isArray(res.data.records)
      ? res.data.records
      : []
  return {
    list,
    total: res.data ? res.data.total : 0,
  }
}
export const handleArray = (res = {}) =>
  res.code === SUCCESS_CODE && Array.isArray(res.data) ? res.data : []
export const handleObj = (res = {}) =>
  res.code === SUCCESS_CODE && res.data ? res.data : {}
export const handlePageParams = (pager = {}) => {
  const { current = 1, pageSize = 10 } = pager
  return {
    pageSize,
    pageNum: current,
  }
}

export const encodeParams = (params) => {
  if (isEmpty(params)) {
    return ''
  }
  let str = ``
  for (const attr in params) {
    str = `${str}${str ? '&' : ''}${attr}=${params[attr]}`
  }
  return str
}
// 从请求头中获取文件名称
export const getFileNameFromHeaders = (headers) => {
  const disposition = headers['content-disposition']
  if (!disposition) {
    return;
  }
  const dispositionList = disposition.split(';');
  let fileName = dispositionList[1].split('=')[1];
  // 获取用户当前的浏览器
  const useAgent = window.navigator.userAgent;
  const fx = "utf-8'zh_cn'";
  // 如果为火狐浏览器
  if (useAgent.indexOf('Firefox') > -1) {
    fileName = escape(fileName);
  }
  const name = decodeURIComponent(fileName);
  if (useAgent.indexOf('Firefox') > -1) {
    const hasEnCodeUtf8 = name.includes(fx);
    return hasEnCodeUtf8 ? name.slice(fx.length) : name;
  } else {
    return name;
  }
}
export const saveFileByRes = (res, fileName) => {
  const blobData = new Blob([res.data])
  const exportFileName = fileName ? fileName : getFileNameFromHeaders(res.headers)
  saveFileByBlob(blobData, exportFileName)
}

export const saveFileByBlob = (blobData, name) => {
  saveAs(blobData, name);
}
export const downloadFile = (url, opt = {}) => {
  if (!url) {
    console.error('url不能为空!');
    return;
  }
  const a = document.createElement('a');
  a.href = url;
  Object.keys(opt).forEach((key) => {
    a[key] = opt[key];
  });
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export const getRequestError = (
  e,
  defaultMsg = '操作失败',
  autoTooltip = true
) => {
  const msg = get(e, 'response.data.msg') || defaultMsg
  if (autoTooltip) {
    Toast.show({
      icon: 'fail',
      content: msg,
    })
  }
  return msg
}
const handleActionName = (getActionName, actionName, ...args) => {
  if (typeof getActionName === 'function') {
    const res = getActionName(...args)
    return typeof res === 'string' ? res : ''
  } else {
    return actionName
  }
}
// 操作类请求hook配置
export const actionRequestHookOptions = ({
  successFn,
  actionName,
  getActionName,
  failFn,
  onFail,
  ...rest
}) => {
  // 是否为自定义失败操作
  const isDefinedFail = typeof onFail === 'function'
  return {
    onSuccess: (res, params) => {
      const actionPrefix = handleActionName(getActionName, actionName, params)
      if (res.code === SUCCESS_CODE) {
        if (actionPrefix) {
          Toast.show({
            icon: 'success',
            content:`${actionPrefix}成功`
          })
        }
        if (typeof successFn === 'function') {
          successFn(res, params)
        }
      } else {
        if (typeof onFail === 'function') {
          onFail(params)
          return
        }
        const errorMsg = res.msg ? res.msg : `${actionPrefix}失败`
        if (res.msg || actionPrefix) {
          Toast.show({
            icon: 'fail',
            content: errorMsg,
          })
        }
        if (typeof failFn === 'function') {
          failFn(params, errorMsg)
        }
      }
    },
    onError: (e, params) => {
      const actionPrefix = handleActionName(getActionName, actionName, params)
      const errorMsg = getRequestError(
        e,
        actionPrefix ? `${actionPrefix}失败` : '',
        false
      )
      // !isDefinedFail
      if (errorMsg && !isDefinedFail) {
        Toast.show({
          icon: 'fail',
          content: errorMsg,
        })
      }
      if (typeof onFail === 'function') {
        onFail(params)
        return
      }
      if (typeof failFn === 'function') {
        failFn(params, errorMsg)
      }
    },
    ...rest,
  }
}
export const getResponseErrorData = (error) => {
  const { response } = error
  const { code, msg = '', error: errorMsg = '' } = response.data
  const errorMessage = msg || errorMsg || '服务器错误'
  return {
    code,
    status: response.status,
    msg: errorMessage,
  }
}

// 处理请求异常
export const handleResponseError = (error) => {
  const { status, code, msg } = getResponseErrorData(error)
  const redirectUrl = encode(getLoginRedirectUrl())
  const redirectUrlParams = `redirect=${redirectUrl}`
  switch (status) {
    case 401:
      localStorage.clear()
      window.location.href = `${SYSTEM_PREFIX_PATH}/login?${redirectUrlParams}`
      break
    case 500:
      if (`${code}` === '111401') {
        window.location.href = `${SYSTEM_PREFIX_PATH}/noInstallApp?${redirectUrlParams}`
        return
      } else if (`${code}` === '111405') {
        // 没有在可见范围里
        window.location.href = `${SYSTEM_PREFIX_PATH}/noInViewRange?${redirectUrlParams}`
        return
      } else if (`${code}` === '111403') {
        // 没有席位
        window.location.href = `${SYSTEM_PREFIX_PATH}/noSeat?${redirectUrlParams}`
        return
      } else if (`${code}` === '111402') {
        // 版本过期 系统使用版本已到期，请联系管理员重试！
        window.location.href = `${SYSTEM_PREFIX_PATH}/sysError?${createUrlSearchParams(
          {
            title: code,
            description: msg,
            redirect: redirectUrl
          }
        )}`
        return
      } else {
        return true
      }
    default:
      return true
  }
}

// else if (code) {
//   window.location.href = `${SYSTEM_PREFIX_PATH}/sysError?${createUrlSearchParams(
//     {
//       title: code,
//       description: errorMessage,
//     }
//   )}`
//   return false
// }
