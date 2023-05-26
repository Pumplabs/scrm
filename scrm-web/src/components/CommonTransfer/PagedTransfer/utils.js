export const getListByPager = (pager = {}, list = []) => {
  if (!Array.isArray(list) || list.length === 0) {
    return []
  }
  const { current: pageNo, pageSize } = pager
  const current = pageNo * pageSize > list.length ?  1 : pageNo
  const start = (current - 1 ) * pageSize
  const end = current * pageSize
  const arr =  list.slice(start, end)
  return arr
}

// 修改数据
export const modifyList = (list = [], data, isAdd, valueKey, isItem) => {
  if (isAdd) {
    return [...list, isItem ? data : data[valueKey]]
  } else {
    return list.filter(ele => {
      if (isItem) {
        return ele[valueKey] !== data[valueKey]
      } else {
        return ele !== data[valueKey]
      }
    })
  }
}