import { isEmpty } from 'lodash'
import { getTextMsg } from 'components/MsgSection/utils'
import { createSysUrlsByType } from 'src/utils'
import { MEDIA_REQ_KEY_BY_VAL } from 'components/MsgSection/constants'

const converAttachments = (mediaList = [], userData = {}) => {
  if (Array.isArray(mediaList) && mediaList.length) {
    let res = []
    mediaList.forEach((mediaItem) => {
      let data = {}
      if (mediaItem.file && mediaItem.file.id) {
        const fileId = mediaItem.file.id
        const filePath = createSysUrlsByType({
          type: 'file',
          data: {
            fileId
          }
        })
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
              msgtype: 'link',
              link: {
                title: mediaItem.name,
                desc: mediaItem.info,
                imgUrl: filePath,
                url: createSysUrlsByType({
                  type: 'previewFile',
                  data: {
                    extCorpId: userData.extCorpId,
                    extId: userData.extId,
                    mediaId: mediaItem.file.mediaId
                  }
                })
              },
            }
            break
          case MEDIA_REQ_KEY_BY_VAL.link:
            data = {
              msgtype: 'link',
              link: {
                title: mediaItem.name,
                desc: mediaItem.info,
                imgUrl: filePath,
                url: mediaItem.href,
              },
            }
            break
          case MEDIA_REQ_KEY_BY_VAL.miniprogram:
            data = {
              msgtype: 'miniprogram',
              miniprogram: {
                appid: mediaItem.appId,
                title: mediaItem.title,
                imgUrl: filePath,
                page: mediaItem.pathName,
              },
            }
            break
          default:
            break
        }
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
/**
 * 将信息转换成企微消息
 */
export const convertMsgToWxMsg = (data, userData) => {
  if (isEmpty(data)) {
    return {}
  } else {
    const [textRecord] = getTextMsg(data.text)
    return {
      text: {
        content: textRecord ? textRecord.text : '',
      },
      attachments: converAttachments(data.media, userData),
    }
  }
}
