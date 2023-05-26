import { saveAs } from 'file-saver'
import { get, isEmpty } from 'lodash'
import { message } from 'antd'
import { SUCCESS_CODE } from 'utils/constants'
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

// 从请求头中获取文件名称
export const getFileNameFromHeaders = (headers) => {
  const disposition = headers['content-disposition']
  if (!disposition) {
    return
  }
  const dispositionList = disposition.split(';')
  let fileName = dispositionList[1].split('=')[1]
  // 获取用户当前的浏览器
  const useAgent = window.navigator.userAgent
  const fx = "utf-8'zh_cn'"
  // 如果为火狐浏览器
  if (useAgent.indexOf('Firefox') > -1) {
    fileName = escape(fileName)
  }
  const name = decodeURIComponent(fileName)
  if (useAgent.indexOf('Firefox') > -1) {
    const hasEnCodeUtf8 = name.includes(fx)
    return hasEnCodeUtf8 ? name.slice(fx.length) : name
  } else {
    return name
  }
}
export const saveFileByRes = (res, fileName) => {
  const blobData = new Blob([res.data])
  const exportFileName = fileName
    ? fileName
    : getFileNameFromHeaders(res.headers)
  saveFileByBlob(blobData, exportFileName)
}

export const saveFileByBlob = (blobData, name) => {
  saveAs(blobData, name)
}
export const downloadFile = (url, opt = {}) => {
  if (!url) {
    console.error('url不能为空!')
    return
  }
  exportByLink(url, opt)
}

export const exportByLink = (url, opt) => {
  const a = document.createElement('a')
  a.href = url
  if (opt) {
    Object.keys(opt).forEach((key) => {
      a[key] = opt[key]
    })
  }
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
// 获取请求异常信息
export const getRequestError = (
  e,
  defaultMsg = '操作失败',
  autoTooltip = true
) => {
  const msg = get(e, 'response.data.msg') || defaultMsg
  if (autoTooltip) {
    message.error(msg)
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
          message.success(`${actionPrefix}成功`)
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
          message.error(errorMsg)
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
        message.error(errorMsg)
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
export const convertUrl = (baseUrl, params = {}) => {
  if (!isEmpty(params)) {
    const searchStr = Object.keys(params).map(key => {
      return `${key}=${params[key]}`
    }).join('&')
    return searchStr && baseUrl ?  `${baseUrl}?${searchStr}` : `${baseUrl}${searchStr}`
  } else {
    return baseUrl
  }
}