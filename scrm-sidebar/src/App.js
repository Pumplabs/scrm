import { useEffect, useContext, useMemo } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { SafeArea } from 'antd-mobile'
// import { toJS } from 'mobx'
import { MobXProviderContext, observer } from 'mobx-react'
import locale from 'antd/lib/locale/zh_CN'
import { encode } from 'js-base64'
import {
  getRedirectUrl,
  getLoginRedirectUrl,
  WHITE_LIST,
} from 'src/pages/Login'
import Routes from './routes'
import { checkIsWxwork } from 'src/utils'
import './App.less'
import { TOKEN_KEY } from 'utils/constants'
// 1. 判断本地是否有token
// 本地有token, 直接请求
// 本地无token,跳转到登录界面
// 如果token过期，则采用方法2
// 2. 登录界面，生成登录链接，传入回调地址

const App = observer(() => {
  const { UserStore, WxStore } = useContext(MobXProviderContext)
  const location = useLocation()
  const navigate = useNavigate()
  const isWxWork = checkIsWxwork()
  const [searchParams] = useSearchParams()

  const isWhitePathname = useMemo(() => {
    return WHITE_LIST.includes(location.pathname)
  }, [location.pathname])

  const initConfig = async () => {
    const injectRes = await WxStore.injectWxConfig()
    if (injectRes) {
      WxStore.update(location.pathname)
    }
  }

  const localGetUser = () => {
    UserStore.getUserData(
      {},
      {
        onOk: () => {
          const url = getRedirectUrl(searchParams.get('redirect'))
          navigate(url)
        },
        onFail: (e) => {
          if (!e) {
            navigate(`/noUser?redirect=${searchParams.get('redirect')}`)
          }
        },
      }
    )
  }

  useEffect(() => {
    window.firstLocationKey = location.key
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    window.currentLocationKey = location.key
    console.log("UserStore.userData.name", UserStore.userData.name);
    console.log("isWhitePathname", isWhitePathname);
    console.log("isWxWork", isWxWork);
    // 如果不是模拟环境
    if (!window.myMode) {
      if (!isWxWork) {
        // 跳转到提示界面
        navigate('/enterError')
        return
      }
      // 如果已经登录了
      if (UserStore.userData.extId && !isWhitePathname && isWxWork) {
        // 如果没有注册api
        initConfig()
      }
    }
    // 如果没有用户信息，且非登录界面
    if (!UserStore.userData.extId && !isWhitePathname) {
      WxStore.clearWxConfigData()
      if (window.myMode && localStorage.getItem(TOKEN_KEY)) {
        localGetUser()
      } else {
        navigate(`/login?redirect=${encode(getLoginRedirectUrl())}&timestamp=${Date.now()}`)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <ConfigProvider locale={locale}>
      <SafeArea position="top" />
      <Routes />
      <SafeArea position="bottom" />
    </ConfigProvider>
  )
})

export default App
