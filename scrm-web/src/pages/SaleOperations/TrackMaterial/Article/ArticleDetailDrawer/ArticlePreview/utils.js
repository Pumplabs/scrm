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

export { findAllImgFileIds }