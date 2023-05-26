import COS from 'cos-js-sdk-v5'
import { GetFileCertificate } from 'services/modules/common'

export const getCosUrl = async (mediaId, data) => {
  const cos = new COS({
    // getAuthorization 必选参数
    getAuthorization: function (options, callback) {
      // 异步获取临时密钥
      // 服务端 JS 和 PHP 例子：https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/
      // 服务端其他语言参考 COS STS SDK ：https://github.com/tencentyun/qcloud-cos-sts-sdk
      // STS 详细文档指引看：https://cloud.tencent.com/document/product/436/14048
      callback({
        TmpSecretId: data.tmpSecretId,
        TmpSecretKey: data.tmpSecretKey,
        SecurityToken: data.sessionToken,
        // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
        StartTime: data.startTime, // 时间戳，单位秒，如：1580000000
        ExpiredTime: data.expiredTime, // 时间戳，单位秒，如：1580000000
      });
    }
  });
  const res = await new Promise((resolve) => {
    cos.getObjectUrl({
      Bucket: data.bucket,
      Region: data.region,
      Key: data.key,
      Sign: true,    /* 获取带签名的对象URL */
    }, function (err, res) {
      if (err) return console.log(err);
      /* url为对象访问url */
      var url = res.Url;
      resolve({ mediaId, url, key: data.key })
      /* 复制downloadUrl的值到浏览器打开会自动触发下载 */
      // var downloadUrl = url + (url.indexOf('?') > -1 ? '&' : '?') + 'response-content-disposition=attachment'; // 补充强制下载的参数
    });
  })
  return res
}

// 获取远程地址
const getRemoteUrl = async (params) => {
  const ids = params.ids || params.mediaIds
  try {
    const res = await GetFileCertificate(params)
    const keyMap = Reflect.has(params, 'ids') ? res.idKeyMap : res.mediaIdKeyMap
    // res.startTime = Math.floor(Date.now() / 1000)
    // res.expiredTime = res.startTime + 3
    let reqList = []
    ids.forEach(idItem => {
      if (keyMap[idItem]) {
        reqList = [...reqList, getCosUrl(idItem, {...res, key: keyMap[idItem]})]
      }
    })
    const cosRes = await Promise.all(reqList)
    return [cosRes, res]
  } catch (e) {
    console.error(e)
    return null
  }
}
// const getSingle
export function handleCacheFileUrl () {
  let filesData = {}
  // 与过期时间相差值
  const diff = 30
  return async (ids) => {
    const now = Date.now()
    const updateData = (res, configData) => {
      filesData[res.mediaId] = {
        url: res.url,
        // 凭证时长
        certificateCount: configData.expiredTime - configData.startTime - diff,
        endTime: now
      }
    }

    const [idsArr, isIdType] = getIdsArr(ids)
    const isSingle = typeof ids !== 'object'
    return await getFilesPath(idsArr, now, filesData, (item, configData, isNew, resData = {}) => {
      const url = isNew ? item.url : filesData[item.mediaId].url
      if (isNew) {
        updateData(item, configData)
      }
      if (isSingle) {
        return url
      } else {
       return {
          ...(resData ? resData : {}),
          [item.mediaId]: url
        }
      }
    }, isIdType)
  }
}

const getIdsArr = (data) => {
  const isObject = typeof data === 'object' && !Array.isArray(data)
  if (isObject) {
    return [data.ids || data.mediaIds, Reflect.has(data, 'ids') ? 'ids': 'mediaIds']
  } else if (Array.isArray(data)) {
    return [data, 'mediaIds']
  } else {
    return [[data], 'mediaIds']
  }
}

const handleCosRes = async (params, cb) => {
  const cosRes = await getRemoteUrl(params)
  if (cosRes) {
    const [resArr, configData] = cosRes
    resArr.forEach(res => {
      if (typeof cb === 'function') {
        cb(res, configData)
      }
    })
  }
}

const getFilesPath = async (mediaIds, now, filesData, cb, key) => {
  let resData = undefined;
  const expiredIds = mediaIds.filter(ele => {
    const isExpired = checkedFileIsExpired(now, filesData[ele])
    if (!isExpired) {
      if (typeof cb === 'function') {
        resData = cb({ mediaId: ele }, filesData[ele], false, resData)
      }
    }
    return isExpired
  })
  if (expiredIds.length) {
    const params = {
      [key]: expiredIds
    }
    await handleCosRes(params, (item, configData) => {
      if (typeof cb === 'function') {
        resData = cb(item, configData, true, resData)
      }
    })
  }
  return resData
}

// 判断文件是否已经过期了
const checkedFileIsExpired = (now, data) => {
  if (!data) {
    return true
  }
  const currentLen = Math.floor((now - data.endTime) / 1000)
  return (currentLen > data.certificateCount)
}
export const getFileUrl = handleCacheFileUrl()