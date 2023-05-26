import { isEmpty } from 'lodash'
import { getFileUrl } from 'src/utils'
import { NINAME_LABEL, ATTACH_TYPE_EN_VAL } from './constants'
import { MAX_COUNT } from './components/RichMsgEditor'
import  { validNotEmpty, validTextLength, validAttachType } from './valid'

// 请求时类型对应的type值
export const MEDIA_REQ_KEY_BY_VAL = {
  img: 'image',
  link: 'link',
  app: 'miniprogram',
  myLink: 'myLink',
  video: 'video',
  text: 'text',
}
// 回填时服务器的type对应的本地附件type
export const MEDIA_VALUE_BY_KEY = {
  [MEDIA_REQ_KEY_BY_VAL.img]: 'img',
  [MEDIA_REQ_KEY_BY_VAL.link]: 'link',
  [MEDIA_REQ_KEY_BY_VAL.app]: 'app',
  [MEDIA_REQ_KEY_BY_VAL.myLink]: 'myLink',
  [MEDIA_REQ_KEY_BY_VAL.video]: ATTACH_TYPE_EN_VAL.VIDEO,
}
export const TEXT_KEY_BY_VAL = {
  NICKNAME: 1,
  TEXT: 2,
}
export const getTextParamsWithNicknameParams = (editorState) => {
  let resArr = []
  const getCurrentContent = editorState.getCurrentContent()
  getCurrentContent.getBlockMap().map((block) => {
    if (block) {
      const blockText = block.getText()
      let remainText = blockText
      let lastStart = 0
      block.findEntityRanges(
        (eItem) => {
          const entityKey = eItem.getEntity()
          if (eItem) {
            if (entityKey) {
              const type = getCurrentContent.getEntity(entityKey).getType()
              return entityKey !== null && type === 'KEYBOARD-ITEM'
            }
          }
        },
        (start, end) => {
          if (lastStart !== start) {
            const text = blockText.slice(lastStart, start)
            resArr = [...resArr, { type: TEXT_KEY_BY_VAL.TEXT, content: text }]
          }
          lastStart = end
          resArr = [...resArr, { type: TEXT_KEY_BY_VAL.NICKNAME }]
          remainText = blockText.slice(end)
        }
      )
      if (remainText.length) {
        resArr = [
          ...resArr,
          { type: TEXT_KEY_BY_VAL.TEXT, content: remainText },
        ]
      }
      return blockText
    } else {
      return ''
    }
  })
  return resArr
}

// 获取附件参数
export const getMediaParams = (media = []) => {
  const mediaList = Array.isArray(media) ? media : []
  return mediaList.map((ele) => {
    const { type, content = {} } = ele
    const { file, ...otherContent } = content
    let data = {}
    switch (type) {
      case ATTACH_TYPE_EN_VAL.IMAGE:
      case ATTACH_TYPE_EN_VAL.MINI_APP:
      case ATTACH_TYPE_EN_VAL.LINK:
      case ATTACH_TYPE_EN_VAL.VIDEO:
        data = {
          ...otherContent,
          file: getFileParams(file),
        }
        break
      case ATTACH_TYPE_EN_VAL.TRACK_MATERIAL:
        data = {
          mediaInfoId: content.mediaInfoId,
          href: content.requestUrl,
          info: content.description,
          name: content.title,
          file: getFileParams(file),
        }
        break
      default:
        data = content
        break
    }
    return {
      type: MEDIA_REQ_KEY_BY_VAL[type],
      ...data,
    }
  })
}

// 获取文本展示信息
export const getTextMsg = (textArr = [], userNameText = NINAME_LABEL) => {
  if (Array.isArray(textArr) && textArr.length) {
    let text = ''
    textArr.forEach((ele) => {
      if (ele.type === TEXT_KEY_BY_VAL.NICKNAME) {
        text = `${text}${userNameText}`
      } else if (ele.type === TEXT_KEY_BY_VAL.TEXT) {
        text = `${text}${ele.content}`
      }
    })
    return [
      {
        type: MEDIA_REQ_KEY_BY_VAL.text,
        text,
      },
    ]
  } else {
    return []
  }
}

// 回填编辑器附件
export const getFillMedia = (mediaList = [], urlsData = {}) => {
  return mediaList.map((ele) => {
    const { type, file, ...rest } = ele
    const fileData =
      file && file.id
        ? {
            file: [
              {
                uid: file.id,
                name: file.fileName,
                isOld: true,
                filePath: file.filePath,
                thumbUrl: urlsData[file.id],
                mediaInfoId: file.mediaInfoId,
              },
            ],
          }
        : {}
    let data = {}
    if (type === MEDIA_REQ_KEY_BY_VAL.myLink) {
      data = {
        title: rest.name,
        requestUrl: rest.href,
        mediaInfoId: rest.mediaInfoId,
        description: rest.info,
        ...fileData,
      }
    } else {
      data = {
        ...rest,
        ...fileData,
      }
    }
    return {
      type: MEDIA_VALUE_BY_KEY[type],
      content: data,
    }
  })
}

// 处理编辑器表单回显值
export const getFillEditorForm = async ({ msg = {}, isRichText }) => {
  if (isEmpty(msg)) {
    return {}
  } else {
    const { text, media } = msg
    const fileUrls = await getMediaFileUrls(media)
    let msgText = undefined
    if (Array.isArray(text)) {
      const [{ content = '' } = {}] = text
      if (!isRichText) {
        msgText = content
      }
    }
    return {
      text: msgText,
      media: getFillMedia(media, fileUrls),
    }
  }
}
// 获取展示信息列表
export const getMsgList = async (data = {}, urls, ninameLabel) => {
  if (isEmpty(data) || !data) {
    return []
  } else {
    const fileUrls = urls ? urls : await getMediaFileUrls(data.media)
    return [
      ...getTextMsg(data.text, ninameLabel),
      ...getFillMedia(data.media, fileUrls),
    ]
  }
}

// 获取附件的远程路径
export const getMediaFileUrls = async (mediaArr) => {
  if (Array.isArray(mediaArr) && mediaArr.length) {
    let fileIds = []
    mediaArr.forEach((ele) => {
      if (ele.file && ele.file.id) {
        fileIds = [...fileIds, ele.file.id]
      }
    })
    let fileUrls = {}
    if (fileIds.length) {
      fileUrls = await getFileUrl({ ids: fileIds })
    }
    return fileUrls
  } else {
    return {}
  }
}

const getFileParams = (files) => {
  const arr = Array.isArray(files) ? files : []
  if (arr.length) {
    const { isOld, uid, filePath, name: fileName, response = {} } = arr[0]
    const resData = isEmpty(response) ? {} : response.data
    const fileId = isOld ? uid : resData.id
    const path = isOld ? filePath : resData.filePath
    return {
      id: fileId,
      fileName,
      filePath: path,
    }
  } else {
    return {}
  }
}

/**
 *
 * @param {*} options
 * @returns
 */
export const getMsgRules = (options) => {
  const {
    requireText = true,
    requireMedia = false,
    maxText = MAX_COUNT,
    isRichText,
    ninameLabel,
    rules = []
  } = options
  return [
    {
      required: requireText || requireMedia,
      validator: async (rule, value = {}) => {
        for (const ruleItem of rules) {
          const validFn = validFns[ruleItem.type]
          if (validFn) {
            const result = validFn(value, {
              maxText,
              requireMedia,
              requireText,
              isRichText,
              ninameLabel,
              options: ruleItem.options
            })
            if (!result) {
              const msg = ruleItem.message ?  ruleItem.message: `${ruleItem.type}不能为空`
              throw new Error(msg)
            }
          } else {
            continue;
          }
        }
        Promise.resolve()
      },
    },
  ]
}

const validFns = {
  'noEmpty': validNotEmpty,
  'maxText': validTextLength,
  attachType: (value, options) => validAttachType(value.media, options.options)
}

export const convertMsgParams = ({ msg = {}, isRichText }) => {
  const textArr = isRichText
    ? getTextParamsWithNicknameParams(msg.text)
    : msg.text
    ? [
        {
          type: TEXT_KEY_BY_VAL.TEXT,
          content: msg.text,
        },
      ]
    : []
  return {
    media: getMediaParams(msg.media),
    text: textArr,
  }
}
