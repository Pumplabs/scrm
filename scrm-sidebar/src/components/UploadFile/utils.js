import { MATERIAL_TYPE_EN_VALS } from 'src/pages/Material/constants'
import { MEDIA_REQ_KEY_BY_VAL } from 'components/MsgSection/constants'
import { getMediaFileUrls } from 'components/MsgSection/utils'
import { ATTACH_TYPES, IMG_TYPES, VIDEO_TYPES } from './constants'
import { createSysUrlsByType } from 'src/utils'
// 图片->image 链接->link 小程序->miniprogram 轨迹素材->myLink 视频->video
// 转换media参数项

const handleAttachItemToMediaParams = (item) => {
  const content = item.content
  const baseFile = {
    id: content.fileId,
  }

  if (item.type === ATTACH_TYPES.IMAGE) {
    return {
      type: MEDIA_REQ_KEY_BY_VAL.img,
      file: {
        ...baseFile,
        size: content.fileSize,
        fileName: content.name,
      },
    }
  } else if (item.type === ATTACH_TYPES.VIDEO) {
    return {
      type: MEDIA_REQ_KEY_BY_VAL.video,
      file: {
        ...baseFile,
        size: content.fileSize,
        fileName: content.name,
      },
    }
  } else if (item.type === ATTACH_TYPES.LINK) {
    return {
      type: MEDIA_REQ_KEY_BY_VAL.link,
      name: content.title,
      info: content.description,
      href: content.linkUrl,
      file: baseFile,
    }
  } else if (item.type === ATTACH_TYPES.TRACK_LINK) {
    return {
      type: MEDIA_REQ_KEY_BY_VAL.myLink,
      name: content.title,
      info: content.description,
      mediaInfoId: content.mediaInfoId,
      file: content.fileId ? baseFile : {},
    }
  } else if (item.type === ATTACH_TYPES.FILE) {
    return {
      type: 'file',
      file: {
        ...baseFile,
        size: content.fileSize,
        fileName: content.name,
      },
    }
  } else if (item.type === ATTACH_TYPES.AUDIO) {
    return {
      type: 'voice',
      file: {
        ...baseFile,
        size: content.fileSize,
        fileName: content.name,
      },
    }
  } else {
    return {
      type: 'file',
      file: baseFile,
    }
  }
}
// 转换附件数据为media参数
export const convertAttachItemToMediaParams = (arr) => {
  let res = []
  arr.forEach((item) => {
    if (item.status !== 'done') {
      return
    }
    res = [...res, handleAttachItemToMediaParams(item)]
  })
  return res
}

// 转换素材为附件数据格式
export const covertMetrialToFileItem = (item) => {
  let type = ''
  let content = {}
  switch (item.type) {
    case MATERIAL_TYPE_EN_VALS.POSTER:
    case MATERIAL_TYPE_EN_VALS.PICTUER:
      type = ATTACH_TYPES.IMAGE
      content = {
        name: `${item.title}.${item.mediaSuf}`,
        fileType: `.${item.mediaSuf}`,
        fileId: item.fileId,
        fileSize: item.fileSize,
        filePath: item.filePath,
      }
      break
    // 文章
    case MATERIAL_TYPE_EN_VALS.ARTICLE:
      type = ATTACH_TYPES.TRACK_LINK
      content = {
        title: item.title,
        coverSrc: item.filePath,
        fileId: item.fileId,
        mediaInfoId: item.id,
        description: item.summary,
      }
      break
    // 视频
    case MATERIAL_TYPE_EN_VALS.VIDEO:
      type = ATTACH_TYPES.TRACK_LINK
      content = {
        title: item.title,
        fileSize: item.fileSize,
        mediaInfoId: item.id,
        description: item.description,
      }
      break
    // 链接
    case MATERIAL_TYPE_EN_VALS.LINK:
      type = ATTACH_TYPES.TRACK_LINK
      content = {
        title: item.title,
        coverSrc: item.filePath,
        fileId: item.fileId,
        mediaInfoId: item.id,
        description: item.description,
      }
      break
    // 文件
    case MATERIAL_TYPE_EN_VALS.FILE:
      type = ATTACH_TYPES.TRACK_LINK
      content = {
        title: item.title,
        fileSize: item.fileSize,
        mediaInfoId: item.id,
        description: item.description,
      }
      break
    default:
      content = item
      break
  }
  return {
    type,
    content,
  }
}
// 转换本地文件为附件数据格式
export const convertLocalFileToFileItem = (file) => {
  let type = ATTACH_TYPES.FILE
  if (IMG_TYPES.includes(file.fileType)) {
    type = ATTACH_TYPES.IMAGE
  } else if (VIDEO_TYPES.includes(file.fileType)) {
    type = ATTACH_TYPES.VIDEO
  }
  return {
    type,
    content: {
      name: file.name,
      fileType: file.fileType,
      filePath: file.filePath,
    },
  }
}
// 转换media值为附件列表
export const convertMediaToAttachFiles = async (arr) => {
  if (!Array.isArray(arr) || arr.length === 0) {
    return []
  }
  const fileUrls = (await getMediaFileUrls(arr)) || {}
  return arr.map((item, idx) => {
    let type = ''
    let content = {}
    const file = item.file
    switch (item.type) {
      case MEDIA_REQ_KEY_BY_VAL.img:
        type = ATTACH_TYPES.IMAGE
        content = {
          name: file.fileName || item.name,
          fileId: file.id,
          fileSize: file.size,
          filePath: fileUrls[file.id],
        }
        break
      case MEDIA_REQ_KEY_BY_VAL.link:
        type = ATTACH_TYPES.LINK
        content = {
          linkUrl: item.href,
          title: item.name,
          fileId: file.id,
          description: item.info,
          coverSrc: fileUrls[file.id],
        }
        break
      // 轨迹素材
      case MEDIA_REQ_KEY_BY_VAL.myLink:
        type = ATTACH_TYPES.TRACK_LINK
        content = {
          fileId: file.id,
          linkUrl: createSysUrlsByType({
            type: 'previewFile',
            data: {
              mediaId: item.mediaInfoId,
            },
          }),
          mediaInfoId: item.mediaInfoId,
          title: item.name,
          description: item.info,
          coverSrc: fileUrls[file.id],
        }
        break
      // 视频
      case MEDIA_REQ_KEY_BY_VAL.video:
        type = ATTACH_TYPES.VIDEO
        content = {
          fileId: file.id,
          name: file.fileName,
          fileSize: file.size,
          filePath: fileUrls[file.id],
        }
        break
      case 'voice':
        type = ATTACH_TYPES.AUDIO
        content = {
          fileId: file.id,
          name: file.fileName,
          fileSize: file.size,
          filePath: fileUrls[file.id],
          mediaInfoId: file.mediaId
        }
        break
      case 'file':
        type = ATTACH_TYPES.FILE
        content = {
          fileId: file.id,
          name: file.fileName,
          // name: file.fileName.repeat(4),
          fileSize: file.size,
          filePath: fileUrls[file.id],
        }
        break
      default:
        content = item
        break
    }
    return {
      uid: `${file.id}_${idx}`,
      type,
      status: 'done',
      content,
    }
  })
}
