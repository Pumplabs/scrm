import { observable, action } from 'mobx'
import { GetUserInfoByCode, GetUserInfo } from 'src/services/modules/login'
import { TOKEN_KEY, SUCCESS_CODE } from 'src/utils/constants'

class UserStore {
  constructor(rootStore) {
    this.rootStore = rootStore
  }
  // 用户数据
  @observable userData = {}
  // 企业数据
  @observable corpInfo = {}
  @observable appInfo = {

    appId: '',
    corpId: '',
    // 应用信息
    agentId: '',
  }

  @action async setAppInfo(data = {}) {
    this.appInfo = {
      ...data
    }
  }
  @action async getUserData(params = {}, options = {}) {
    const request = params.code ? GetUserInfoByCode : GetUserInfo
    const { onOk, onFail } = options
    try {
      const res = await request(params)
      console.log("res", res);
      if (res.code === SUCCESS_CODE && res.data && res.data.staff) {
        console.log("res", JSON.stringify(res.data.staff));
        this.updateUserData(res.data.staff)
        console.log(res.data.token);
        localStorage.setItem(TOKEN_KEY, res.data.token)
        if (typeof onOk === 'function') {
          onOk()
        }
      } else {
        if (typeof onFail === 'function') {
          onFail()
        }
      }
    } catch (e) {
      if (typeof onFail === 'function') {
        onFail(e)
      }
    }
  }

  @action.bound updateUserData(data = {}) {
    this.userData = data
    this.corpInfo = {
      corpId: data.extCorpId,
    }
  }

  @action logout() { }
}

export default UserStore
