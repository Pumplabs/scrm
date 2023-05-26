import { observable, action, toJS } from 'mobx'
import { isEmpty } from 'lodash'
import { Modal } from 'antd'
import {
  GetUserInfoByCode,
  GetUserInfoByToken,
} from 'services/modules/login'
import defaultAvatorUrl from 'assets/images/defaultAvator.jpg'
import { SUCCESS_CODE, SYSTEM_PREFIX_PATH, TOKEN_KEY } from 'utils/constants'

class UserStore {
  constructor(rootStore) {
    this.rootStore = rootStore
  }
  @observable userData = {}
  @observable getUserLoading = false

  @action getUserInfo(authCode) {
    if (!isEmpty(toJS(this.userData))) {
      return;
    }
    if (authCode) {
      this.fetchUserInfo(GetUserInfoByCode, {
        code: authCode
      })
    } else {
      const authority = localStorage.getItem(TOKEN_KEY)
      if (authority) {
        this.fetchUserInfo(GetUserInfoByToken)
      } else {
        this.logout()
      }
    }
  }

  async fetchUserInfo(request, ...args) {
    try {
      this.getUserLoading = true
      const res = await request(...args)
      this.getUserLoading = false
      if (res) {
        if (res.code === SUCCESS_CODE && res.data && res.data.staff) {
          if (res.data.token && !localStorage.getItem(TOKEN_KEY)) {
            localStorage.setItem(TOKEN_KEY, res.data.token)
          }
          const staffData = res.data.staff ? res.data.staff : {}
          this.updateUserData({
            corpName: res.data ? res.data.corpName : '',
            ...staffData
          })
          this.rootStore.MenuStore.getMenuData()
          this.rootStore.WxWorkStore.initConfig(staffData.extCorpId)
          const pathname = window.location.pathname
          if (pathname === '/' || pathname === SYSTEM_PREFIX_PATH + '/login-middle') {
            window.location.replace(`${SYSTEM_PREFIX_PATH}/home`)
          }
        } else {
          this.unfoundUser()
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  @action
  updateUserData = (data = {}) => {
    const avatarUrl = data.avatarUrl ? data.avatarUrl : defaultAvatorUrl
    this.userData = {
      ...data,
      avatarUrl,
    }
  }

  @action.bound logout() {
    localStorage.removeItem(TOKEN_KEY)
    if (window.location.pathname !== SYSTEM_PREFIX_PATH + '/login') {
      window.location.href = SYSTEM_PREFIX_PATH + '/login'
    }
    this.userData = {}
  }

  @action.bound unfoundUser() {
    Modal.error({
      title: '提示',
      content: '非常抱歉，查询不到您的用户信息，请重新登录',
      onOk: () => {
        this.logout()
      },
    })
  }
}
export default UserStore
