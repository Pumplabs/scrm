import { observable, action } from 'mobx'
import { isEmpty } from 'lodash'
import { GetSignature } from 'services/modules/login'

const initAgentConfig = async (corpid) => {
  const signatureData = await GetSignature({
    url: window.location.href,
    isCorp: false
  })

  return new Promise((resolve, reject) => {
    if (!isEmpty(signatureData)) {
      window.wx.agentConfig({
        corpid,
        agentid: signatureData.agentId,
        timestamp: signatureData.timestamp,
        nonceStr: signatureData.nonceStr,
        signature: signatureData.signature,
        jsApiList: ['selectExternalContact'],
        success: function (res) {
          resolve(true)
        },
        fail: function (res) {
          console.log('fail', res)
          if (res.errMsg.indexOf('function not exist') > -1) {
            alert('版本过低请升级')
          }
          reject()
        },
      })
    } else {
      resolve()
    }
  })
}
const initAppConfig = async (extCorpId) => {
  const signatureData = await GetSignature({
    url: window.location.href,
    isCorp: true,
  })
  return new Promise((resolve, reject) => {

    console.log(signatureData, "signatureData");
    window.wx.config({
      beta: true,
      debug: false,
      appId: extCorpId,
      timestamp: signatureData.timestamp,
      nonceStr: signatureData.nonceStr,
      signature: signatureData.signature,
      jsApiList: [],
    })
    window.wx.ready(resolve)
    window.wx.error(reject)
  })
}

class WxworkStore {
  @observable hasRegisterAgentConfig = false
  @observable agentLoading = false
  constructor(rootStore) {
    this.rootStore = rootStore
  }
  @action.bound initConfig(extCorpId) {
    this.registerConfig(extCorpId)
  }
  async registerConfig(extCorpId) {
    if (this.agentLoading || this.hasRegisterAgentConfig) {
      return;
    }
    this.agentLoading = true
    if (/MicroMessenger/i.test(navigator.userAgent)) {
      await initAppConfig(extCorpId)
    }
    const res = await initAgentConfig(extCorpId)
    this.agentLoading = false
    if (res) {
      this.updateRegisterData()
    }
  }
  @action.bound updateRegisterData() {
    this.hasRegisterAgentConfig = true
  }
}
export default WxworkStore
