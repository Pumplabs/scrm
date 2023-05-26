import COS from 'cos-js-sdk-v5'
import { GetFileCertificate } from 'services/modules/common'

const getCosUrl = async (mediaId, data) => {
  const cos = new COS({
    getAuthorization: function (options, callback) {
      callback({
        TmpSecretId: data.tmpSecretId,
        TmpSecretKey: data.tmpSecretKey,
        SecurityToken: data.sessionToken,
        StartTime: data.startTime,
        ExpiredTime: data.expiredTime,
      });
    }
  });
  const res = await new Promise((resolve) => {
    cos.getObjectUrl({
      Bucket: data.bucket,
      Region: data.region,
      Key: data.key,
      Sign: true,
    }, function (err, data) {
      if (err) return console.log(err);
      const url = data.Url;
      resolve({ mediaId, url })
    });
  })
  return res
}

const getRemoteUrl = async (params) => {
  const ids = params.ids || params.mediaIds
  try {
    const res = await GetFileCertificate(params)
    const keyMap = Reflect.has(params, 'ids') ? res.idKeyMap : res.mediaIdKeyMap
    let reqList = []
    ids.forEach(idItem => {
      if (keyMap[idItem]) {
        reqList = [...reqList, getCosUrl(idItem, { ...res, key: keyMap[idItem] })]
      }
    })
    const cosRes = await Promise.all(reqList)
    return [cosRes, res]
  } catch (e) {
    console.error(e)
    return null
  }
}

export function handleCacheFileUrl() {
  let filesData = {}
  const diff = 30
  return async (ids) => {
    const now = Date.now()
    const updateData = (res, configData) => {
      filesData[res.mediaId] = {
        url: res.url,
        certificateCount: configData.expiredTime - configData.startTime - diff,
        endTime: now
      }
    }
    const [idsArr, idType] = getIdsArr(ids)
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
    }, idType)
  }
}

const getIdsArr = (data) => {
  const isObject = typeof data === 'object' && !Array.isArray(data)
  if (isObject) {
    return [data.ids || data.mediaIds, Reflect.has(data, 'ids') ? 'ids' : 'mediaIds']
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