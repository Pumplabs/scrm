import { isEmpty } from 'lodash'
import moment from 'moment'
import { Toast } from 'antd-mobile'

import { createUrlSearchParams } from './paths'

export const createSearchUrl = (baseUrl, params = {}) => {
  if (isEmpty(params)) {
    return baseUrl
  }
  const searchStr = createUrlSearchParams(params)
  return baseUrl ? `${baseUrl}?${searchStr}` : searchStr
}
// 格式化数字
export const formatNumber = (num = 0) => {
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
    return `${str}${floatNum ? '.' + floatNum : ''}`
  } else {
    return num
  }
}

/**
 *
 * @param {Object} options
 * * @param {String} type 类型 file， previewFile, application
 * * @param {Object} data
 * * * @param {String} extCorpId 企业id
 * * * @param {String} extId 员工id
 * * * @param {String} mediaId 素材id
 * @returns
 */
export const createSysUrlsByType = (options = {}) => {
  // 只能是默认端口
  const baseUrl = 'https://scrm.pumplabs.cn'
  const { type, data = {} } = options
  if (type === 'file') {
    return createSearchUrl(`${baseUrl}/api/common/downloadByFileId`, {
      fileId: data.fileId,
      times: Date.now(),
    })
  } else if (type === 'previewFile') {
    return createSearchUrl(`${baseUrl}/h5/preview/index.html`, {
      staffId: data.extId || '',
      times: Date.now(),
      // 素材id
      materialId: data.mediaId, // 必传
    })
  } else if (type === 'application') {
    return `${baseUrl}/middle-page.html`
  } else if (type === 'product') {
    return createSearchUrl(`${baseUrl}/h5/product/index.html`, {
      staffId: data.staffId,
      productId: data.productId,
    })
  } else {
    return ''
  }
}

/**
 *
 * @param {Array<object>} list 数据源
 * @param {Object} options
 * * @param {String} dateFieldName 日期字段名称
 * * @param {Function} format 格式化方法
 * @returns
 */
export const covertListByDate = (list = [], options = {}) => {
  // 以创建时间分组
  let timeInfo = null
  let res = []
  let arr = []
  const { dateFieldName = 'createdAt', format } = options
  list.forEach((ele) => {
    const eleTime = moment(ele[dateFieldName])
    const year = eleTime.year()
    const date = eleTime.date()
    const month = eleTime.month() + 1
    const isToday = moment().isSame(eleTime, 'days')
    const curFullyDate = eleTime.format('YYYY-MM-DD')
    const dateStr =
      typeof format === 'function'
        ? format({ year, month, date, isToday })
        : eleTime.format('MM月DD日')
    // 如果当前日期与上次的日期不符
    if (timeInfo && timeInfo.str !== curFullyDate) {
      res = [
        ...res,
        {
          key: timeInfo.key,
          timeData: {
            isToday: timeInfo.isToday,
            date: timeInfo.date,
            month: timeInfo.month,
            year: timeInfo.year,
            fullDate: timeInfo.str,
            dateStr: timeInfo.dateStr,
          },
          list: [...arr],
        },
      ]
      arr = []
    }
    arr = [
      ...arr,
      {
        actionName: eleTime.format('HH:mm'),
        ...ele,
      },
    ]
    timeInfo = {
      year,
      month,
      date,
      str: curFullyDate,
      isToday,
      dateStr,
      key: ele.id,
    }
  })
  if (arr.length) {
    res = [
      ...res,
      {
        key: timeInfo.key,
        timeData: {
          isToday: timeInfo.isToday,
          date: timeInfo.date,
          month: timeInfo.month,
          year: timeInfo.year,
          fullDate: timeInfo.str,
          dateStr: timeInfo.dateStr,
        },
        list: [...arr],
      },
    ]
  }
  return res
}

export const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = (error) => reject(error)
  })

// 比较两个数组有哪些为新增，有哪些为删除
export const compareArray = (oldArr, newArr, handleItem) => {
  const oldList = Array.isArray(oldArr) ? oldArr : []
  const newList = Array.isArray(newArr) ? newArr : []
  // 比较新旧值
  let removeIdData = {}
  let addArr = []
  let noChangeArr = []
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
      noChangeArr = [...noChangeArr, value]
    } else {
      addArr = [...addArr, value]
    }
  })
  return {
    addArr,
    noChangeArr,
    removeArr: Object.keys(removeIdData),
  }
}

export { getDiffStr, fillZero } from './handleTime'
export { encodeUrl, decodeUrl, createUrlSearchParams } from './paths'

// 判断是否在微信打开
export function checkIsWxwork() {
  var ua = navigator.userAgent.toLowerCase()
  var iswxwork = ua.indexOf('wxwork') > -1
  return ua.indexOf('micromessenger') > -1 && iswxwork
}

export const callPhone = (phoneNumber) => {
  if (!phoneNumber) {
    Toast.show({
      icon: 'fail',
      content: '没有电话信息，无法拨打电话',
    })
    return
  }
  let a = document.createElement('a')
  a.href = `tel:${phoneNumber}`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
