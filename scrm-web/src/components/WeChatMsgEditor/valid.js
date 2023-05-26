import { isEmpty } from 'lodash'
import { getRealTextLength } from './components/RichMsgEditor'
import {
  EDITOR_TYPE_TO_RULE_TYPE,
  ATTACH_RULE_OPTIONS,
  ATTACH_MENU_OPTIONS,
  MAX_ATTACH_COUNT,
} from './constants'

/**
 * 获取已选择的素材类型
 * @param {Array} dataSource 素材数据
 * @returns 
 * @param {Object} attachTypeData 
 * @param {Object} chooseTypes
 */
export const getSelectedAttachObj = (dataSource = []) => {
  let attachData = {}
  dataSource.forEach((item) => {
    const typeName = EDITOR_TYPE_TO_RULE_TYPE[item.type]
    if (!attachData[typeName]) {
      attachData[typeName] = 1
    } else {
      attachData[typeName]++
    }
  })
  return {
    attachTypeData: attachData,
    attachChooseTypes: Object.keys(attachData)
  }
}

export const covertValidTypeOptions = (attachTypeData = {}, attachmentRules = {}) => {
  const ruleOptions =
  attachmentRules && Array.isArray(attachmentRules.options)
    ? attachmentRules.options
    : ATTACH_RULE_OPTIONS
  return ruleOptions.map((ruleItem) => {
    const menuItem = ATTACH_MENU_OPTIONS.find(
      (mItem) => mItem.type === ruleItem.type
    )
    const count = attachTypeData[ruleItem.type] || 0
    return {
      menuItem,
      count,
      max: ruleItem.max,
    }
  })
}

/**
 * 附件规则
 * and 只能选xx类型和xx类型
 * or 几种类型中的1种
 * 
 */
export const validShouldAddAttach = (dataSource = [], attachmentRules = {}) => {
  const { attachTypeData, attachChooseTypes } = getSelectedAttachObj(dataSource)
  const validOptions = covertValidTypeOptions(attachTypeData, attachmentRules)
  let menuOptions = []
  // 是否允许新增
  let allowAdd = true
  if (attachmentRules.type === 'or') {
    // 只要有个类型选了，那只能继续选择这个类型
    const hasChooseType = attachChooseTypes.length > 0
    validOptions.forEach(({ menuItem, max = MAX_ATTACH_COUNT, count }) => {
      // 如果有类型超过了限制值
      if (allowAdd && count >= max) {
        allowAdd = false
      }
      if (menuItem) {
        const disabled = hasChooseType ? count === 0 : false
        menuOptions = [
          ...menuOptions,
          {
            ...menuItem,
            disabled,
          },
        ]
      }
    })
  } else {
    // 判断是否都达到限制数量了
    const hasDefinedCount = validOptions.some(item => item.max > 0)
    const ruleMax = attachmentRules.max || MAX_ATTACH_COUNT
    const totalIsOver = dataSource.length >= ruleMax
    let countIsOver = false
    validOptions.forEach(({ menuItem, max = MAX_ATTACH_COUNT, count }) => {
      if (menuItem) {
        menuOptions = [
          ...menuOptions,
          {
            ...menuItem,
            disabled: hasDefinedCount ? count >= max : totalIsOver
          },
        ]
      }
      if (hasDefinedCount && count >= max && !countIsOver) {
        countIsOver =  true
      }
    })
    allowAdd = hasDefinedCount ? !countIsOver : dataSource.length < ruleMax
  }
  return {
    menuOptions,
    shouldAddAttach: allowAdd,
  }
}

export const validAttachType = (dataSource = [], attachmentRules = {}) => {
  const { attachTypeData, attachChooseTypes } = getSelectedAttachObj(dataSource)
  const validOptions = covertValidTypeOptions(attachTypeData, attachmentRules)
  // 是否校验通过
  if (attachmentRules.type === 'or') {
    if (attachChooseTypes.length > 0) {
      return attachChooseTypes.length > 1 ? false : validOptions.every(item => item.count <= item.max)
    } else {
      return true
    }
  } else {
    const hasDefinedCount = validOptions.some(item => item.max > 0)
    const ruleMax = attachmentRules.max || MAX_ATTACH_COUNT
    if (hasDefinedCount) {
      return validOptions.every((count, max = MAX_ATTACH_COUNT) => count <= max)
    } else {
      return dataSource.length <= ruleMax
    }
  }
}

const textValueIsEmpty = (text = '', isRichText) => {
  if (!text) {
    return true
  }
  const str = isRichText ? text.toText() : text
  return str.trim().length === 0
}
// 校验长度
export const validTextLength = (value = {}, options = {}) => {
  const { text } = value
  const { maxText, isRichText } = options
  let textLen = 0
  if (text) {
    textLen = isRichText ? text.toText().length : text.length
  }
  if (textLen > maxText && isRichText) {
    textLen = getRealTextLength(text)
  }
  return textLen <= maxText
}

// 校验是否为空,非空则返回true
export const validNotEmpty = (value = {}, options = {}) => {
  const { text, media = [] } = value
  const { requireText, requireMedia, isRichText } = options
  // 如果均为不必填
  if (!requireText && !requireMedia) {
    return true
  }
  const textIsEmpty = requireText ? textValueIsEmpty(text, isRichText) : false
  const medialIsEmpty = requireMedia ? isEmpty(media) : false
  // 如果必填
  const isEmptyValue = isEmpty(value) || textIsEmpty || medialIsEmpty
  return !isEmptyValue
}
