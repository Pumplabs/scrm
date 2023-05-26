import { isEmpty, isEqual } from 'lodash'

export { getFileUrl } from './cosFile'
// 格式化数字
/**
 * 
 * @param {*} num 
 * @param {Object} config 
 * * @param {Number} padPrecision 填充小数位，默认两位小数
 * @returns 
 */
export const formatNumber = (num = 0, config = {}) => {
  const { padPrecision = 0 } = config
  const str = `${num}`
  const isNum = str.length > 0 && !Number.isNaN(str[0])
  if (isNum) {
    const [intNum, floatNum = ''] = `${num}`.split('.')
    let str = ''
    let len = 0
    for (let i = intNum.length - 1; i >= 0; i--) {
      const item = intNum[i]
      len++
      const splitCode = len % 3 === 0 && i !== 0 ? ',' : ''
      str = `${splitCode}${item}${str}`
    }
    const floatStr = padPrecision ? floatNum.padEnd(padPrecision, 0) : floatNum
    return `${str}${floatStr ? '.' + floatStr : ''}`
  } else {
    return num
  }
}

export const getOptionItem = (arr = [], targetValue, filedNames = {}) => {
  const { label = 'label', value = 'value' } = filedNames
  const item = arr.find((item) => item[value] === targetValue)
  return item ? item[label] : '-'
}

export const resolveJson = (data) => {
  let res = []
  if (Array.isArray(data)) {
    res = data
  } else {
    if (data) {
      try {
        res = JSON.parse(data)
      } catch (e) {
        res = []
      }
    }
  }
  return res
}

// 比较两个数组有哪些为新增，有哪些为删除
export const compareArray = (oldArr, newArr, handleItem) => {
  const oldList = Array.isArray(oldArr) ? oldArr : []
  const newList = Array.isArray(newArr) ? newArr : []
  let removeIdData = {}
  let addArr = []
  oldList.forEach((item) => {
    const value =
      typeof handleItem === 'function' ? handleItem(item, 'old') : item
    removeIdData[value] = true
  })
  newList.forEach((item) => {
    const value =
      typeof handleItem === 'function' ? handleItem(item, 'new') : item
    if (removeIdData[value]) {
      Reflect.deleteProperty(removeIdData, value)
    } else {
      addArr = [...addArr, value]
    }
  })
  return {
    addArr,
    removeArr: Object.keys(removeIdData),
  }
}

export { covertListByDate } from './classfiyDataAccordDate'

export const isSameArr = (val1 = [], val2 = []) => {
  if (isEmpty(val1) && isEmpty(val2)) {
    return true
  }
  if (
    Array.isArray(val1) &&
    Array.isArray(val2) &&
    val1.length &&
    val2.length
  ) {
    let obj1 = {}
    let obj2 = {}
    val1.forEach((ele) => {
      obj1 = {
        ...obj1,
        [ele]: 1,
      }
    })
    val2.forEach((ele) => {
      obj2 = {
        ...obj2,
        [ele]: 1,
      }
    })
    return isEqual(obj1, obj2)
  } else {
    return isEqual(val1, val2)
  }
}
