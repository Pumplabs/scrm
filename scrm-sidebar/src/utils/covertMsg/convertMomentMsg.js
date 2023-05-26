/* eslint-disable no-control-regex */
import { MEDIA_REQ_KEY_BY_VAL } from 'components/MsgSection/constants'
import { getTextMsg } from 'components/MsgSection/utils'
import { createSysUrlsByType } from 'src/utils'

// 转换朋友圈消息
export const convertMomentMsg = (data = {}, userData) => {
  const [textRecord] = getTextMsg(data.text)
  return {
    text: {
      content: textRecord ? textRecord.text : '',
    },
    attachments: convertMassMsgAttachment(data.media, userData),
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
              title: sliceStrByBitLen(mediaItem.name, 64), // H5消息标题
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
              mediaid: mediaId,
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
function sliceStrByBitLen(str, bitLen = 0) {
  let res = ''
  let total = 0
  for(let i = 0; i < str.length;i++) {
    const item = str[i]
    const count = getStrBit(item)
    if (total + count <= bitLen) {
      total += bitLen
      res += item
    } else {
      return res
    }
  }
}
// 判断是否为32字节的
function is32Bit(c) {
  return c.codePointAt(0) > 0xffff
}
/**
 * 获取字符字节长度
 * @param {*} str 
 * @returns 
 */
function getStrBit(str) {
  if (is32Bit(str)) {
    return 4
  } else {
    const charStr = str.charAt(str)
    return /^[\u0000-\u00ff]$/.test(charStr) ? 1: 2
  }
}
