import { encode, decode } from 'js-base64'
import { isEmpty } from 'lodash'
// 创建url参数
export const createUrlSearchParams = (params) => {
  if (isEmpty(params)) {
    return ''
  }
  let searchStr = ''
  if (Array.isArray(params)) {
    searchStr = params
      .map((item) => {
        return `${item.name}${item.value ? '=' + item.value : ''}`
      })
      .join('&')
  } else {
    searchStr = Object.keys(params)
      .map((key) => {
        return `${key}=${params[key]}`
      })
      .join('&')
  }
  return searchStr
}
// 解析url参数
export const decodeUrlParams = (str) => {
  let data = {}
  if (typeof str === 'string') {
    const arr = str.split('&')
    arr.forEach((item) => {
      const [label, value] = item.split('=')
      data = {
        ...data,
        [label]: value,
      }
    })
    return data
  } else {
    return data
  }
}
// 生成url并编码
export const encodeUrl = (params) => {
  const searchStr = createUrlSearchParams(params)
  return searchStr ? encode(searchStr) : ''
}
// 转码解析url
export const decodeUrl = (str) => {
  return decodeUrlParams(decode(str))
}
