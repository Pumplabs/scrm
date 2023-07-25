// 寻找所有的img标签
const findAllImgFileIds = (arr) => {
  let res = []
  if (Array.isArray(arr)) {
    arr.forEach((item) => {
      if (typeof item === 'object') {
        if (item.tag === 'img') {
          const attrItem = item.attrs.find((ele) => ele.name === 'data-href')
          const fileId = attrItem ? attrItem.value : ''
          if (fileId) {
            res = [...res, fileId]
          }
          return;
        }
        if (item.children && item.children.length > 0) {
          const child = findAllImgFileIds(item.children)
          res = [...res, ...child]
        }
      }
    })
  }
  return res
}

export const updateAllImgUrl = (arr,imgsUrl = {}) => {
  if (!Array.isArray(arr)) {
    return []
  }
  return arr.map((item) => {
      if (typeof item === 'object') {
        if (item.tag === 'img' && Array.isArray(item.attrs) && item.attrs.length) {
          const attrItem = item.attrs.find((ele) => ele.name === 'data-href')
          const fileId = attrItem ? attrItem.value : ''
          if (fileId) {
            return {
              ...item,
              attrs: item.attrs.map(attrItem => {
                 if (attrItem.name === 'src') {
                   return {
                     ...attrItem,
                     value: imgsUrl[fileId]
                   }
                 } else {
                   return attrItem
                 }
              })
            }
          }
          return item
        }
        if (item.children && item.children.length > 0) {
          return {
            ...item,
            children:  updateAllImgUrl(item.children, imgsUrl)
          }
        }
        return item
      }
      return item
    })
}
export { findAllImgFileIds }