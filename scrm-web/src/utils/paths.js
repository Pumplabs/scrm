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
/**
 * 创建带参url
 * @param {*} baseUrl 
 * @param {*} params 
 * @returns 
 */
export const createSearchUrl = (baseUrl, params = {}) => {
  if (isEmpty(params)) {
    return baseUrl
  }
  const searchStr = createUrlSearchParams(params)
  return baseUrl ? `${baseUrl}?${searchStr}` : searchStr
}
export const createUrlByType = (options = {}) => {
  const baseUrl =  window.location.origin
  const { type, data = {} } = options
  if (type === 'file') {
    return createSearchUrl(`${baseUrl}/api/common/downloadByFileId`, {
      fileId: data.fileId,
      times: Date.now(),
    })
  } else if (type === 'previewFile') {
    let basePreviewParams = {
      extcorpId: data.extCorpId || '',
      timestamp: Date.now(),
      materialId: data.mediaInfoId,
    }
    if (data.extId) {
      basePreviewParams.staffId = data.extId
    }
    return createSearchUrl(`${baseUrl}/h5/preview/index.html`, basePreviewParams)
  } else if (type === 'application') {
    return baseUrl + '/middle-page.html'
  } else {
    return ''
  }
}