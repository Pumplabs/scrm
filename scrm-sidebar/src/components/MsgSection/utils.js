import { isEmpty } from 'lodash'
import { getFileUrl } from 'services/modules/remoteFile'
import { MEDIA_REQ_KEY_BY_VAL,MEDIA_MSG_TYPES, MEDIA_VALUE_BY_KEY, TEXT_KEY_BY_VAL, NICKNAME_LABEL } from './constants'

// 获取附件的远程路径
export const getMediaFileUrls = async (mediaArr) => {
  if (Array.isArray(mediaArr) && mediaArr.length) {
    let fileIds = []
    mediaArr.forEach(ele => {
      if (ele.file && ele.file.id) {
        fileIds = [...fileIds, ele.file.id]
      }
    })
    let fileUrls = {}
    if (fileIds.length) {
     fileUrls = await getFileUrl({ids: fileIds})
    }
    return fileUrls
  } else {
    return {}
  }
}

// 附件回填
export const getFillMedia = (mediaList = [], urlsData = {}) => {
  return mediaList.map(ele => {
    const { type, file, ...rest } = ele
    const fileData = file && file.id ? {
      file: [{
        uid: file.id,
        mediaId: file.mediaId,
        name: file.fileName,
        href: file.href,
        mediaInfoId: file.mediaInfoId,
        isOld: true,
        filePath: file.filePath,
        thumbUrl: urlsData[file.id]
      }]
    } : {}
    let data = {}
    if (type === MEDIA_REQ_KEY_BY_VAL.myLink) {
     data = {
        title: rest.name,
        requestUrl: rest.href,
        mediaInfoId: rest.mediaInfoId,
        description: rest.info,
        ...fileData
      }
    } else {
      data = {
        ...rest,
        ...fileData
      }
    }
    return {
      type: MEDIA_VALUE_BY_KEY[type],
      content: data
    }
  })
}

// 获取文本展示信息
export const getTextMsg = (textArr = [], userNameText = NICKNAME_LABEL) => {
  if (Array.isArray(textArr) && textArr.length) {
    let text = ''
    textArr.forEach(ele => {
      if (ele.type === TEXT_KEY_BY_VAL.NICKNAME) {
        text = `${text}${userNameText}`
      } else if (ele.type === TEXT_KEY_BY_VAL.TEXT) {
        text = `${text}${ele.content}`
      }
    })
    return [{
      type: MEDIA_MSG_TYPES.TEXT,
      text
    }]
  } else {
    return []
  }
}

// 获取展示信息列表
export const getMsgList = async (data = {}, options= {}) => {
  const { urls, ninameLabel = NICKNAME_LABEL } = options
  if (isEmpty(data) || !data) {
    return []
  } else {
    const fileUrls = urls ? urls : await getMediaFileUrls(data.media)
    return [...getTextMsg(data.text, ninameLabel), ...getFillMedia(data.media, fileUrls)]
  }
}