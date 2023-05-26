// 解码url参数
export function decodeSearchParams(str) {
  const arr = str.split('&')
  let opt = {}
  arr.forEach((ele) => {
    const [label, val] = ele.split('=')
    opt = {
      ...opt,
      [label]: val,
    }
  })
  return opt
}
// 创建url参数
export const createURLSearchParams = (params) => {
  let str = ''
  if (!params) {
    return str
  }
  // try {
  //   return new URLSearchParams(params).toString()
  // } catch (e) {
    
  // }
  if (Array.isArray(params)) {
    params.forEach((item, idx) => {
      str += `${idx === 0 ? '' : '&'}${item[0]}=${item[1]}`
    })
  } else {
    Object.keys(params).forEach((keyItem, idx) => {
      str += `${idx === 0 ? '' : '&'}${keyItem}=${params[keyItem]}`
    })
  }
  return str
}
// 判断是否在微信打开
export function checkIsWechat() {
  var ua = navigator.userAgent.toLowerCase()
  var iswxwork = ua.indexOf('wxwork') > -1
  return ua.indexOf('micromessenger') !== -1 && !iswxwork
}