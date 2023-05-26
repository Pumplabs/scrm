// 请求时类型对应的type值
export const MEDIA_REQ_KEY_BY_VAL = {
  img: 'image',
  link: 'link',
  app: 'miniprogram',
  myLink: 'myLink',
  video: 'video',
  file: 'file'
}
// 展示信息的type
export const MEDIA_MSG_TYPES = {
  IMAGE: 'img',
  LINK: 'link',
  APP: 'app',
  MYLINK: 'myLink',
  VIDEO: 'video',
  TEXT: 'text',
  FILE: 'file'
}
// 回填时type对应的
export const MEDIA_VALUE_BY_KEY = {
  [MEDIA_REQ_KEY_BY_VAL.img]: MEDIA_MSG_TYPES.IMAGE,
  [MEDIA_REQ_KEY_BY_VAL.link]: MEDIA_MSG_TYPES.LINK,
  [MEDIA_REQ_KEY_BY_VAL.app]: MEDIA_MSG_TYPES.APP,
  [MEDIA_REQ_KEY_BY_VAL.myLink]: MEDIA_MSG_TYPES.MYLINK,
  [MEDIA_REQ_KEY_BY_VAL.video]: MEDIA_MSG_TYPES.VIDEO
}
export const TEXT_KEY_BY_VAL = {
  NICKNAME: 1,
  TEXT: 2
}
export const NICKNAME_LABEL = '用户昵称'