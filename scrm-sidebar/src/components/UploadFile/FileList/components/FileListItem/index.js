import cls from 'classnames'
import {
  SoundOutline,
  CloseCircleFill,
  DownlandOutline,
} from 'antd-mobile-icons'
import { Toast } from 'antd-mobile'
import { DowloadFileById } from 'services/modules/file'
import FileItem from '../FileItem'
import LinkItem from '../LinkItem'
import {
  IMG_TYPES,
  VIDEO_TYPES,
  PPT_TYPES,
  EXCEL_TYPES,
  WORD_TYPES,
  TEXT_TYPES,
  ATTACH_TYPES,
  PDF_TYPES,
  AUDIO_TYPES,
} from '../../../constants'
import { getFileParams } from '../../../fileUtils'
import { FILE_ICON_TYPE } from '../FileIcon'
import styles from './index.module.less'

/**
 * 链接
 * @param {String} title 链接标题
 * @param {String} description 链接描述
 * @param {String} coverSrc 封面地址
 * @param {String} linkUrl 链接地址
 * @param {String} mediaInfoId 素材id
 * @param {String} fileId 文件id
 * 图片
 * @param {String} name 文件名称
 * @param {String} fileType 文件类型，例.png,可不传
 * @param {String} filePath 文件链接，图片需传
 * @param {String} fileId 文件id
 * @param {Number} fileSize 文件大小
 * 文件
 * @param {String} name 文件名称
 * @param {String} fileType 文件类型，例.png,可不传
 * @param {String} filePath 文件链接，图片需传
 * @param {String} fileId 文件id
 * @param {Number} fileSize 文件大小
 * @returns
 */
const ItemContent = ({ data = {} }) => {
  const { type, content } = data
  const onPreviewWxFile = (e) => {
    if (e) {
      e.stopPropagation()
    }
    if (typeof window.wx.previewFile === 'function' && content.fileSize) {
      window.wx.previewFile({
        url: content.filePath,
        name: content.name,
        size: content.fileSize,
      })
    }
  }

  const onDownloadAudio = (mediaId) => {
    if (window.wx && typeof window.wx.downloadVoice === 'function') {
      Toast.show({
        icon: <SoundOutline />,
        content: '听筒播放，请贴近手机聆听',
      })
      window.wx.downloadVoice({
        serverId: mediaId,
        isShowProgressTips: 1,
        success: function (res) {
          var localId = res.localId
          if (window.wx) {
            window.wx.playVoice({
              localId,
            })
          }
        },
      })
    }
  }

  const getIconType = (data) => {
    const { filePath, name: fileName, fileType } = data
    const type = fileType ? fileType : getFileParams(fileName).fileType
    if (IMG_TYPES.includes(type)) {
      return FILE_ICON_TYPE.IMAGE
    } else if (VIDEO_TYPES.includes(type)) {
      return FILE_ICON_TYPE.VIDEO
    } else if (PPT_TYPES.includes(type)) {
      return FILE_ICON_TYPE.PPT
    } else if (EXCEL_TYPES.includes(type)) {
      return FILE_ICON_TYPE.EXCEL
    } else if (WORD_TYPES.includes(type)) {
      return FILE_ICON_TYPE.WORD
    } else if (TEXT_TYPES.includes(type)) {
      return FILE_ICON_TYPE.TEXT
    } else if (PDF_TYPES.includes(type)) {
      return FILE_ICON_TYPE.PDF
    } else if (AUDIO_TYPES.includes(type)) {
      return FILE_ICON_TYPE.AUDIO
    } else {
      return FILE_ICON_TYPE.FILE
    }
  }
  if (type === ATTACH_TYPES.FILE) {
    return (
      <FileItem
        data={content}
        onClick={onPreviewWxFile}
        iconType={getIconType(content)}
      />
    )
  } else if (type === ATTACH_TYPES.IMAGE) {
    return (
      <FileItem
        data={content}
        onClick={onPreviewWxFile}
        iconType={FILE_ICON_TYPE.IMAGE}
      />
    )
  } else if (type === ATTACH_TYPES.VIDEO) {
    return (
      <FileItem
        data={content}
        onClick={onPreviewWxFile}
        iconType={FILE_ICON_TYPE.VIDEO}
      />
    )
  } else if (type === ATTACH_TYPES.LINK || type === ATTACH_TYPES.TRACK_LINK) {
    return content.linkUrl ? (
      <a
        href={content.linkUrl}
        target="_blank"
        rel="noreferrer"
        className={styles['link-text']}>
        <LinkItem data={content} />
      </a>
    ) : (
      <LinkItem data={content} />
    )
  } else if (type === ATTACH_TYPES.AUDIO) {
    const events = content.mediaInfoId
      ? {
          onClick: () => {
            onDownloadAudio(content.mediaInfoId)
          },
        }
      : {}
    return (
      <FileItem data={content} {...events} iconType={FILE_ICON_TYPE.AUDIO} />
    )
  } else {
    return null
  }
}
/**
 * @param {Object} data
 * * @param {String} type 类型 link, file
 * * @param {Object} content 内容
 */
export default (props) => {
  const { data, className, onClose } = props
  const handleClose = () => {
    if (typeof onClose === 'function') {
      onClose(data)
    }
  }
  const onClickItem = (e) => {
    e.stopPropagation()
  }

  const closeable = typeof onClose === 'function'
  return (
    <li
      className={cls({
        [styles['file-item']]: true,
        [styles['file-item-with-close']]: closeable,
        [styles[`file-${data.status}-item`]]: true,
        [className]: className,
      })}
      onClick={onClickItem}>
      <div
        className={cls({
          [styles['file-item-content']]: true,
        })}>
        <div className={styles['file-content']}>
          <ItemContent data={data} />
        </div>
        {closeable ? (
          <CloseCircleFill
            className={styles['file-close-icon']}
            onClick={handleClose}
          />
        ) : null}
      </div>
    </li>
  )
}
