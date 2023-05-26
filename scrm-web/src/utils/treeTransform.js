export function transformToTree (menuData, fieldNames) {
  return findLoop(menuData, fieldNames)
}
function findLoop (menuData, fieldNames) {
  const { child = 'children' } = fieldNames
  let remainList = [...menuData]
  let res = []
  while (remainList.length) {
    const [firstItem, ...restArr] = remainList
    const { childList, newRemainList: nrList, oldRemainList: orList } = findChildLoop(firstItem, restArr, res, fieldNames)
    remainList = [...nrList]
    res = [...orList, { ...firstItem, [child]: childList }]
  }
  return remainList
}
function getChildList (data, list, fieldNames = {}) {
  const { pKey = 'pid', key = 'id' } = fieldNames
  let remainList = []
  const childList = list.filter(ele => {
    const flag = `${ele[pKey]}` === `${data[key]}`
    if (!flag) {
      remainList = [...remainList, ele]
    }
    return flag
  })
  return {
    childList,
    remainList
  }
}
function findChildLoop (data, newList, oldList, fieldNames) {
  const { child = 'children' } = fieldNames
  const { childList: newChildList, remainList: newRemainList } = getChildList(data, newList, fieldNames)
  const { childList: oldChildList, remainList: oldRemainList } = getChildList(data, oldList, fieldNames)
  let resObj = { newRemainList, oldRemainList }
  if (newChildList.length > 0) {
    const newChildRes = newChildList.map(ele => {
      if (Reflect.has(ele, 'children')) {
        return ele
      }
      const { childList: cList, newRemainList: nrList, oldRemainList: orList } = findChildLoop(ele, resObj.newRemainList, resObj.oldRemainList)
      if (cList.length) {
        resObj = {
          newRemainList: nrList,
          oldRemainList: orList
        }
      }
      return {
        ...ele,
        [child]: cList
      }
    })
    return {
      childList: newChildRes,
      ...resObj
    }
  } else {
    return { childList: [...newChildList, ...oldChildList], ...resObj }
  }
}

export function getCheckKeyWithParent (dataSource = [], checkKeys = [], fieldNames = {}) {
  if (!Array.isArray(dataSource)) {
    return []
  }
  let nextKeys = [...checkKeys]
  const { key, childKey } = fieldNames
  const allCheck = dataSource.every(ele => {
    const checked = checkKeys.includes(ele[key])
    if (Array.isArray(ele[childKey]) && ele[childKey].length > 0) {
      const { check: childIsAllCheck, keys } = getCheckKeyWithParent(ele[childKey], nextKeys, fieldNames)
      nextKeys = [...keys]
      if (childIsAllCheck && !nextKeys.includes(ele[key])) {
        nextKeys = [...nextKeys, ele[key]]
      }
      if (!childIsAllCheck && nextKeys.includes(ele[key])) {
        nextKeys = nextKeys.filter(item => item !== ele[key])
      }
      return childIsAllCheck
    } else {
      return checked
    }
  })
  return { check: allCheck, keys: nextKeys }
}

const filterTreeData = (arr, cb) => {
  let res = []
  const fn = (item, childRes) => {
    if (typeof cb === 'function') {
      const cbRes = cb(item, childRes)
      if (cbRes) {
        res = [...res, Array.isArray(cbRes) ? [...cbRes] : cbRes]
      }
    } else {
      res = [...res, item]
    }
  }
  arr.forEach((ele) => {
    if (Array.isArray(ele.children) && ele.children.length > 0) {
      const childRes = filterTreeData(ele.children)
      fn(ele, childRes)
    } else {
      fn(ele)
    }
  })
}