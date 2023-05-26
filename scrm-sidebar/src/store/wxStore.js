import { observable, action } from 'mobx'
import { toJS } from 'mobx'
import { GetSignature } from 'src/services/modules/login'
import { SUCCESS_CODE } from 'src/utils/constants'

const AGENT_JS_API = [
  'selectExternalContact',
  'wwapp.initWwOpenData',
  'sendChatMessage',
  'onHistoryBack',
  'getContext',
  'openEnterpriseChat',
  'getCurExternalContact',
  'selectEnterpriseContact',
  'openExistedChatWithMsg',
  'shareToExternalChat',
  'shareToExternalMoments',
  'shareToExternalContact',
  'getCurExternalChat',
]

const JS_API_LIST = [
  'sendChatMessage',
  'getContext',
  'agentConfig',
  'onHistoryBack',
  'openEnterpriseChat',
  'shareToExternalContact',
  'shareToExternalMoments',
]

const wxConfigFn = async (cropInfo, cb) => {
  // 获取签名
  const res = await GetSignature({
    url: window.location.href,
    isCorp: true,
  })
  if (res.code === SUCCESS_CODE && res.data) {
    const data = res.data
    window.wx.config({
      beta: true, // 必须这么写，否则wx.invoke调用形式的jsapi会有问题
      debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: cropInfo.corpId, // 必填，企业微信的corpID
      timestamp: data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.nonceStr, // 必填，生成签名的随机串
      signature: data.signature, // 必填，签名，见 附录-JS-SDK使用权限签名算法
      jsApiList: JS_API_LIST, // 必填，需要使用的JS接口列表，凡是要调用的接口都需要传进来
    })
    window.wx.ready(function () {
      //  configInJectRef.current[pathname] = {
      //    lastTimes: Date.now(),
      //  }
      if (typeof cb === 'function') {
        cb(true)
      }
      // config信息验证后会执行ready方法，所有接口调用都必须在config接口获得结果之后，config是一个客户端的异步操作，所以如果需要在页面加载时就调用相关接口，则须把相关接口放在ready函数中调用来确保正确执行。对于用户触发时才调用的接口，则可以直接调用，不需要放在ready函数中。
    })
    window.wx.error(function (res) {
      console.log('window.wx-error', res)
      if (typeof cb === 'function') {
        cb(false)
      }
      // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
    })
  } else {
    if (typeof cb === 'function') {
      cb(false)
    }
  }
}

const setWxAgentConfig = async (cropInfo, cb) => {
  const res = await GetSignature({
    url: window.location.href,
    isCorp: false
  })
  if (res.code === SUCCESS_CODE && res.data) {
    const data = res.data
    window.wx.agentConfig({
      debug: false,
      corpid: cropInfo.corpId, // 必填，企业微信的corpid，必须与当前登录的企业一致
      agentid: data.agentId, // 必填，企业微信的应用id （e.g. 1000247）
      timestamp: data.timestamp, // 必填，生成签名的时间戳
      nonceStr: data.nonceStr, // 必填，生成签名的随机串
      signature: data.signature, // 必填，签名，见附录-JS-SDK使用权限签名算法
      // jsApiList: AGENT_URLS[pathname], //必填，传入需要使用的接口名称
      jsApiList: AGENT_JS_API,
      success: function () {
        // console.log('agentConfig-success', res)
        // agentInjectRef.current = {
        //   lastTimes: Date.now(),
        // }
        if (typeof cb === 'function') {
          cb(true)
        }
        // 回调
      },
      fail: function (res) {
        if (typeof cb === 'function') {
          cb(false)
        }
        // console.log('agent-error', res)
        if (res.errMsg.indexOf('function not exist') > -1) {
          alert('版本过低请升级')
        }
      },
    })
  } else {
    // TODO:
    console.error('获取agentConfig签名异常')
    if (typeof cb === 'function') {
      cb(false)
    }
  }
}

// 判断凭证时间是否过期
const checkTicketTimeisExpired = (item = {}) => {
  const oldSeconds = item.lastTimes || 0
  const MAX_TIME = 7000
  // 当前的秒数
  const nowSeconds = Date.now()
  const diff = Math.ceil(nowSeconds - oldSeconds / 1000)
  return diff >= MAX_TIME
}
class WxStore {
  constructor(rootStore) {
    this.rootStore = rootStore
  }
  @observable configList = []
  configInjectMap = {}
  agentInjectMap = {}

  @action.bound update(pathname) {
    this.configList = [...this.configList, pathname]
  }

  // 所有需要使用JS-SDK的页面必须先注入配置信息，否则将无法调用（同一个url仅需调用一次
  @action.bound async initWxConfig(cropInfo) {
    return new Promise((resolve) => {
      const isExpired = checkTicketTimeisExpired(
        this.configInjectMap[window.location.pathname]
      )
      // console.log("initWxConfig-isExpired",isExpired)
      if (isExpired) {
        wxConfigFn(cropInfo, resolve)
      } else {
        resolve(true)
      }
    })
  }

  @action.bound async initWxAgentConfig(cropInfo) {
    return new Promise((resolve) => {
      if (checkTicketTimeisExpired(this.agentInjectMap)) {
        setWxAgentConfig(cropInfo, resolve)
      } else {
        resolve(true)
      }
    })
  }

  // 注入配置
  @action.bound async injectWxConfig() {
    const cropInfo = toJS(this.rootStore.UserStore.corpInfo)
    if (window.myMode) {
      return true
    }
    const pathname = window.location.pathname
    const wxConfigRes = await this.initWxConfig(cropInfo)
    if (wxConfigRes) {
      this.configInjectMap[pathname] = {
        lastTimes: Date.now(),
      }
      const agentConfigRes = await this.initWxAgentConfig(cropInfo)
      if (agentConfigRes) {
        this.agentInjectMap = {
          lastTimes: Date.now(),
        }
      }
      return agentConfigRes
    }
    return wxConfigRes
  }

  // 清除企微相关api信息
  @action.bound clearWxConfigData() {
    this.agentInjectMap = {}
    this.configInjectMap = {}
  }

  // 当前界面是否已完成注册
  @action.bound currentIsDoneInject() {
    const configIsExpired = checkTicketTimeisExpired(
      this.configInjectMap[window.location.pathname]
    )
    const agentIsExpired = checkTicketTimeisExpired(this.agentInjectMap)
    if (!agentIsExpired && !configIsExpired) {
      return true
    } else {
      return false
    }
  }
}

export default WxStore
