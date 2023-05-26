import {
  FileExcelOutlined,
  FileWordOutlined,
  FilePptOutlined,
  FilePdfOutlined,
} from '@ant-design/icons'
import {
  FileOutline,
  PictureOutline,
  VideoOutline,
  TextOutline,
} from 'antd-mobile-icons'
import cls from 'classnames'
import audioUrl from 'assets/images/icon/audio-icon.svg'
import styles from './index.module.less'

// 文件的icon总共分为以下类型
/**
 * image 图片
 * excel 表格
 * word 文档
 * ppt
 * txt
 * pdf
 * video
 */
export const FILE_ICON_TYPE = {
  IMAGE: 'image',
  EXCEL: 'excel',
  WORD: 'word',
  PPT: 'ppt',
  TEXT: 'text',
  PDF: 'pdf',
  VIDEO: 'video',
  FILE: 'file',
  AUDIO: 'audio'
}
export default ({ className, type }) => {
  const props = {
    className: cls({
      [styles[`${type}`]]: type,
      [className]: className,
    }),
  }
  switch (type) {
    // 图片
    case FILE_ICON_TYPE.IMAGE:
      return <PictureOutline {...props} />
    case FILE_ICON_TYPE.EXCEL:
      return <FileExcelOutlined {...props} />
    case FILE_ICON_TYPE.WORD:
      return <FileWordOutlined {...props} />
    case FILE_ICON_TYPE.PPT:
      return <FilePptOutlined {...props} />
    case FILE_ICON_TYPE.PDF:
      return <FilePdfOutlined {...props} />
    case FILE_ICON_TYPE.TEXT:
      return <TextOutline {...props} />
    case FILE_ICON_TYPE.VIDEO:
      return <VideoOutline {...props} />
    // 默认为文件
    case FILE_ICON_TYPE.FILE:
      return <FileOutline {...props} />
    case FILE_ICON_TYPE.AUDIO:
      return <img src={audioUrl} alt="" {...props} />
    default:
      return <FileOutline {...props} />
  }
}
