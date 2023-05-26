// 附件类型： 图片、视频、链接、文件
export const ATTACH_TYPES = {
  FILE: 'file',
  WORD: 'word',
  PPT: 'ppt',
  IMAGE: 'image',
  LINK: 'link',
  VIDEO: 'video',
  AUDIO: 'audio',
  TRACK_LINK: 'myLink'
}

export const IMG_TYPES = ['.jpg','.png', '.gif', '.jpeg']
export const VIDEO_TYPES = ['.mp4']
export const PPT_TYPES = ['.ppt','.pptx']
export const EXCEL_TYPES = ['.xls','.xlsx']
export const WORD_TYPES = ['.doc','.docx',]
export const TEXT_TYPES = ['.txt']
export const PDF_TYPES = ['.pdf']
// 录音
export const AUDIO_TYPES = ['.amr']
// 文档类
export const DOC_TYPES = [...PPT_TYPES,...EXCEL_TYPES,
  ...WORD_TYPES, ...TEXT_TYPES, ...PDF_TYPES]
export const ACCEPT_FILE_TYPES = [...IMG_TYPES, ...VIDEO_TYPES, ...DOC_TYPES]