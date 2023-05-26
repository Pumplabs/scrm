// 在编辑器中附件的类型值
export const ATTACH_TYPE_EN_VAL = {
  IMAGE: 'img',
  TEXT: 'text',
  LINK: 'link',
  MINI_APP: 'app',
  TRACK_MATERIAL: 'myLink',
  VIDEO: 'video'
}
// 编辑器中附件类型中文名
export const ATTACH_TYPE_CN_VAL = {
  [ATTACH_TYPE_EN_VAL.IMAGE]: '图片',
  [ATTACH_TYPE_EN_VAL.TEXT]: '文本',
  [ATTACH_TYPE_EN_VAL.LINK]: '链接',
  [ATTACH_TYPE_EN_VAL.MINI_APP]: '小程序',
  [ATTACH_TYPE_EN_VAL.TRACK_MATERIAL]: '感知素材',
  [ATTACH_TYPE_EN_VAL.VIDEO]: '视频'
}
export const NINAME_LABEL = '用户昵称'
export const MAX_ATTACH_COUNT = 9
// 编辑器中附件规则
export const ATTACH_RULE_TYPE = {
  // 图片
  IMAGE: 'img',
  // 文本
  TEXT: 'text',
  // 链接
  LINK: 'link',
  // 视频
  VIDEO: 'video',
  // 小程序
  MINI_APP: 'miniprogram'
}
// 附件下拉菜单，type用ruleType
export const ATTACH_MENU_OPTIONS = [
  {
    type: ATTACH_RULE_TYPE.IMAGE,
    name: '图片'
  },
  {
    type: ATTACH_RULE_TYPE.LINK,
    name: '链接'
  },
  // {
  //   type: ATTACH_RULE_TYPE.MINI_APP,
  //   name: '小程序'
  // },
  {
    type: ATTACH_RULE_TYPE.VIDEO,
    name: '视频'
  }
]

// 编辑器类型与附件规则类型对应
export const EDITOR_TYPE_TO_RULE_TYPE = {
  [ATTACH_TYPE_EN_VAL.IMAGE]: ATTACH_RULE_TYPE.IMAGE,
  [ATTACH_TYPE_EN_VAL.TEXT]: ATTACH_RULE_TYPE.TEXT,
  [ATTACH_TYPE_EN_VAL.LINK]: ATTACH_RULE_TYPE.LINK,
  [ATTACH_TYPE_EN_VAL.TRACK_MATERIAL]:  ATTACH_RULE_TYPE.LINK,
  [ATTACH_TYPE_EN_VAL.MINI_APP]: ATTACH_RULE_TYPE.MINI_APP,
  [ATTACH_RULE_TYPE.VIDEO]: [ATTACH_TYPE_EN_VAL.VIDEO],
}
export const ATTACH_RULE_OPTIONS = Object.values(ATTACH_RULE_TYPE).map(key => ({
  type: key,
}))
