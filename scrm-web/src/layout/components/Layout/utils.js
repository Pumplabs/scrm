export const filterMenusFn = (menus, text = '') => {
  if (!text) {
    return menus
  }
  let res = []
  menus.forEach((ele) => {
    if (ele.name.includes(text)) {
      res = [...res, ele]
      return;
    }
    if (Array.isArray(ele.children) && ele.children.length) {
      const childArr = filterMenusFn(ele.children, text)
      if (childArr.length) {
        res = [
          ...res,
          {
            ...ele,
            children: childArr,
          },
        ]
      }
    }
  })
  return res
}

export const convertTreeToPlain = (treeData, options = {}) => {
  const { value = 'id', children = 'children'} = options
  let res = []
  if (Array.isArray(treeData) && treeData.length) {
    treeData.forEach(item => {
      res = [...res, item[value]]
      if (Array.isArray(item[children]) && item[children].length) {
        res = [...res, ...convertTreeToPlain(item[children], options)]
      }
    })
  }
  return res
}

export const getPagePath = (pageMenu = [], pathname = '') => {
  if (!pathname || pageMenu.length === 0) {
    return []
  }
  let res = []
  for(let i = 0; i < pageMenu.length; i++) {
    const item = pageMenu[i]
    if (item.url === pathname) {
      return [...res, item]
    }
    if (Array.isArray(item.children)) {
      const childRes = getPagePath(item.children, pathname)
      if (childRes.length > 0) {
        return [...res, item, ...childRes]
      }
    }
  }
  return res
}