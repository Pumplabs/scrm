import { observable, action, computed } from 'mobx'
import { uniqueId } from 'lodash'
import { GetSysMenu } from 'services/modules/settings'
import { SYSTEM_PREFIX_PATH } from 'src/utils/constants'
import potentialMenus from 'src/routes/potentialMenu'

const noMenuPathName = `${SYSTEM_PREFIX_PATH}/no-menu`
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
    // 如果有子节点
    if (Array.isArray(ele.children) && ele.children.length > 0) {
      const childRes = filterTreeData(ele.children)
      fn(ele, childRes)
    } else {
      fn(ele)
    }
  })
}
const coverMenuUrl = (url) => {
  return url && url.startsWith(SYSTEM_PREFIX_PATH)
    ? url.slice(SYSTEM_PREFIX_PATH.length)
    : ''
}
// 过滤展示菜单界面，全部菜单界面（包含功能链接菜单）， 按钮权限
const filterMenuData = (menuData = []) => {
  let pageMenu = []
  let allMenu = []
  let authCodes = []
  menuData.forEach((ele) => {
    const menuUrl = coverMenuUrl(ele.url)
    const menuData = {
      ...ele,
      url: menuUrl,
    }
    // 如果有子节点
    if (Array.isArray(ele.children) && ele.children.length > 0) {
      const {
        allMenu: childAllMenu,
        pageMenu: childPageMenu,
        authCodes: childCodes,
      } = filterMenuData(ele.children)
      pageMenu = [...pageMenu, { ...menuData, children: childPageMenu }]
      allMenu = [...allMenu, { ...menuData, children: childAllMenu }]
      authCodes = [...authCodes, ...childCodes]
    } else {
      pageMenu = [...pageMenu, menuData]
      if (potentialMenus[ele.url]) {
        let pMenus = []
        potentialMenus[ele.url].forEach((item) => {
          const itemUrl = coverMenuUrl(item.url)
          pMenus = [
            ...pMenus,
            {
              ...item,
              url: itemUrl,
              isHideMenu: true,
              id: uniqueId('menu_'),
            },
          ]
          authCodes = [...authCodes, itemUrl]
        })
        allMenu = [...allMenu, { ...menuData, children: pMenus }]
      } else {
        allMenu = [...allMenu, menuData]
      }
      if (menuUrl) {
        authCodes = [...authCodes, menuUrl]
      }
    }
  })
  return {
    allMenu,
    authCodes,
    pageMenu,
  }
}

class MenuStore {
  constructor(rootStore) {
    this.rootStore = rootStore
  }

  // 权限数据
  @observable authCodes = []
  // 页面菜单(用于展示,不包含隐藏菜单)
  @observable pageMenu = []
  // 所有的菜单项(全部的菜单，包含隐藏菜单)
  @observable allMenu = []
  // 菜单loading
  @observable menuLoading = false

  @computed get menuSet() {
    return filterMenuData(this.allMenuData)
  }

  // 获取菜单数据
  @action async getMenuData() {
    this.menuLoading = true
    const menuData = await GetSysMenu()
    this.menuLoading = false
    if (Array.isArray(menuData)) {
      this.updateMenuData(menuData)
      // 如果当前为无菜单路由，但是又有菜单数据
      if (window.location.pathname === noMenuPathName) {
        window.location.replace(`${SYSTEM_PREFIX_PATH}/home`)
        return
      }
    } else {
      if (window.location.pathname !== noMenuPathName) {
        window.location.replace(noMenuPathName)
      }
    }
  }
  @action.bound updateMenuData(menuData) {
    const { pageMenu, authCodes, allMenu } = filterMenuData(menuData)
    this.pageMenu = pageMenu
    this.authCodes = [...authCodes]
    this.allMenu = allMenu
  }
}

export default MenuStore
