import { isEmpty } from 'lodash'
import {
  MEDIA_REQ_KEY_BY_VAL,
  MEDIA_MSG_TYPES,
} from 'components/MsgSection/constants'
import { getTextMsg } from 'components/MsgSection/utils'
import { createSysUrlsByType } from 'src/utils'

const CHAT_MSG_TYPE = {
  IMAGE: 'image',
  TEXT: 'text',
  VIDEO: 'video',
  FILE: 'file',
  LINK: 'news',
  APP: 'miniprogram',
}

// 转换会话附件消息，根据后台类型转换
// https://developer.work.weixin.qq.com/document/path/94354
export const convertChatAttachment = (data, userData, isServer) => {
  return isServer
    ? convertChatAttachmentByServer(data, userData)
    : convertChatAttachmentByViewMsg(data, userData)
}
// 转换群发客户消息
// https://developer.work.weixin.qq.com/document/path/93562
export const covertMassMsg = (data = {}, userData) => {
  const [textRecord] = getTextMsg(data.text)
  return {
    text: {
      content: textRecord ? textRecord.text : '',
    },
    attachments: convertMassMsgAttachment(data.media, userData),
  }
}
const getFileData = (file) => {
  if (file && file.id) {
    return {
      fileId: file.id,
      filePath: createSysUrlsByType({
        type: 'file',
        data: {
          fileId: file.id,
        },
      }),
      mediaId: file.mediaId
    }
  } else {
    return {}
  }
}
// 转换群发消息的附件列表
const convertMassMsgAttachment = (mediaList = [], userData = {}) => {
  if (Array.isArray(mediaList) && mediaList.length) {
    let res = []
    mediaList.forEach((mediaItem) => {
      let data = {}
      const { filePath, mediaId } = getFileData(mediaItem.file)
      switch (mediaItem.type) {
        case MEDIA_REQ_KEY_BY_VAL.img:
          data = {
            msgtype: 'image',
            image: {
              imgUrl: filePath,
            },
          }
          break
        case MEDIA_REQ_KEY_BY_VAL.myLink:
          data = {
            msgtype: 'link', // 消息类型，必填
            link: {
              title: mediaItem.name, // H5消息标题
              desc: mediaItem.info,
              imgUrl: filePath || '', // H5消息封面图片URL
              url: createSysUrlsByType({
                type: 'previewFile',
                data: {
                  extCorpId: userData.extCorpId,
                  extId: userData.extId,
                  mediaId: mediaItem.mediaInfoId,
                },
              }),
            },
          }
          break
        case MEDIA_REQ_KEY_BY_VAL.link:
          data = {
            msgtype: 'link', // 消息类型，必填
            link: {
              title: mediaItem.name, // H5消息标题
              desc: mediaItem.info,
              imgUrl: filePath, // H5消息封面图片URL
              url: mediaItem.href, // H5消息页面url 必填
            },
          }
          break
        case MEDIA_REQ_KEY_BY_VAL.miniprogram:
          data = {
            msgtype: 'miniprogram', // 消息类型，必填
            miniprogram: {
              appid: mediaItem.appId, // 小程序的appid
              title: mediaItem.title, // 小程序消息的title
              imgUrl: filePath, //小程序消息的封面图。必须带http或者https协议头
              page: mediaItem.pathName, //小程序消息打开后的路径，注意要以.html作为后缀，否则在微信端打开会提示找不到页面
            },
          }
          break
        case MEDIA_REQ_KEY_BY_VAL.video:
          data = {
            msgtype: 'video', // 消息类型，必填
            video: {
              mediaid: mediaId
            },
          }
          break
        default:
          break
      }
      if (data.msgtype) {
        res = [...res, data]
      }
    })
    return res
  } else {
    return []
  }
}

// 转换会话附件消息，根据后台类型转换
const convertChatAttachmentByServer = (mediaItem, userData) => {
  let data = {}
  if (mediaItem.file && mediaItem.file.id) {
    const { id: fileId, mediaId, mediaInfoId } = mediaItem.file
    const filePath = createSysUrlsByType({
      type: 'file',
      data: {
        fileId,
      },
    })
    switch (mediaItem.type) {
      case MEDIA_REQ_KEY_BY_VAL.img:
        data = {
          type: CHAT_MSG_TYPE.IMAGE,
          data: {
            [CHAT_MSG_TYPE.IMAGE]: {
              // TODO:
              mediaid: mediaId,
            },
          },
        }
        break
      // 轨迹素材
      case MEDIA_REQ_KEY_BY_VAL.myLink:
        data = {
          msgtype: CHAT_MSG_TYPE.LINK, // 消息类型，必填
          data: {
            [CHAT_MSG_TYPE.LINK]: {
              title: mediaItem.name, // H5消息标题
              desc: mediaItem.info,
              imgUrl: filePath, // H5消息封面图片URL
              link: createSysUrlsByType({
                type: 'previewFile',
                data: {
                  extCorpId: userData.extCorpId,
                  extId: userData.extId,
                  mediaId: mediaInfoId,
                },
              }),
            },
          },
        }
        break
      // 链接
      case MEDIA_REQ_KEY_BY_VAL.link:
        data = {
          msgtype: CHAT_MSG_TYPE.LINK, // 消息类型，必填
          data: {
            [CHAT_MSG_TYPE.LINK]: {
              title: mediaItem.name, // H5消息标题
              desc: mediaItem.info,
              imgUrl: filePath, // H5消息封面图片URL
              link: mediaItem.href,
            },
          },
        }
        break
      case MEDIA_REQ_KEY_BY_VAL.miniprogram:
        data = {
          msgtype: CHAT_MSG_TYPE.APP, // 消息类型，必填
          data: {
            [CHAT_MSG_TYPE.APP]: {
              appid: mediaItem.appId, // 小程序的appid
              title: mediaItem.title, // 小程序消息的title
              imgUrl: filePath, //小程序消息的封面图。必须带http或者https协议头
              page: mediaItem.pathName,
            },
          },
        }
        break
      // TODO: 视频
      //   {
      //     msgtype: "video",    // 消息类型，必填
      //     video:{
      //       mediaid:"",        // 视频的素材id
      //    },
      // }]
      default:
        break
    }
  }
  return data.type ? data : {}
}
// 转换会话附件，根据展示消息数据转换
const convertChatAttachmentByViewMsg = (msgItem, userData) => {
  let data = {}
  if (msgItem.type === MEDIA_MSG_TYPES.TEXT) {
    return {
      type: CHAT_MSG_TYPE.TEXT,
      data: {
        [CHAT_MSG_TYPE.TEXT]: {
          content: msgItem.text,
        },
      },
    }
  }
  const content = msgItem.content
  if (!isEmpty(content) && content.file) {
    const [fileData] = content.file
    switch (msgItem.type) {
      case MEDIA_MSG_TYPES.IMAGE:
        data = {
          type: CHAT_MSG_TYPE.IMAGE,
          data: {
            [CHAT_MSG_TYPE.IMAGE]: {
              mediaid: fileData.mediaId,
            },
          },
        }
        break
      case MEDIA_MSG_TYPES.LINK:
        data = {
          type: CHAT_MSG_TYPE.LINK,
          data: {
            [CHAT_MSG_TYPE.LINK]: {
              link: content.href,
              title: content.name,
              desc: content.info,
              imgUrl: fileData.thumbUrl,
            },
          },
        }
        break

      case MEDIA_MSG_TYPES.MYLINK:
        data = {
          type: CHAT_MSG_TYPE.LINK,
          data: {
            [CHAT_MSG_TYPE.LINK]: {
              link: createSysUrlsByType({
                type: 'previewFile',
                data: {
                  extCorpId: userData.extCorpId,
                  extId: userData.extId,
                  mediaId: content.mediaInfoId,
                },
              }),
              title: content.title,
              desc: content.description,
              imgUrl: fileData.thumbUrl,
            },
          },
        }
        break
      case MEDIA_MSG_TYPES.APP:
        data = {
          type: CHAT_MSG_TYPE.APP,
          data: {
            [CHAT_MSG_TYPE.APP]: {
              // TODO:
              // appid: "wx8bd80126147df384",//小程序的appid，企业已关联的任一个小程序
              // title: fileData.title,//小程序消息的title
              imgUrl:
                'https://search-operate.cdn.bcebos.com/d054b8892a7ab572cb296d62ec7f97b6.png', //小程序消息的封面图。必须带http或者https协议头，否则报错 $apiName$:fail invalid imgUrl
              // page:"/index/page.html", //小程序消息打开后的路径，注意要以.html作为后缀，否则在微信端打开会提示找不到页面
            },
          },
        }
        break
      case MEDIA_MSG_TYPES.VIDEO:
        data = {
          type: CHAT_MSG_TYPE.VIDEO,
          data: {
            [CHAT_MSG_TYPE.VIDEO]: {
              mediaid: fileData.mediaId,
            },
          },
        }
        break
      default:
        break
    }
  }
  return data
}
