import { useState, useEffect, useContext } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { TextArea, Button } from 'antd-mobile'
import { decode } from 'js-base64'
import { MobXProviderContext, observer } from 'mobx-react'
import store from 'src/store'
import { SilentLogin, GetLoginQrcodeInfo } from 'src/services/modules/login'
import { SYSTEM_PREFIX_PATH, TOKEN_KEY } from 'src/utils/constants'

const WHITE_LIST = [
  '/login',
  '/noUser',
  '/enterError',
  '/noSeat',
  '/noInViewRange',
  '/noInstallApp',
  '/missingParam',
  '/sysError',
  '/loginSuccess',
]

// 获取登录界面重定向地址
export const getLoginRedirectUrl = () => {
  const pathname = window.location.pathname
  const url = pathname.startsWith(SYSTEM_PREFIX_PATH)
    ? pathname.slice(SYSTEM_PREFIX_PATH.length)
    : pathname
  const basePathname = url === '/' ? '/home' : url
  return `${basePathname}${window.location.search}`
}

/**
 * 解析重定向地址
 * @param {*} redirect
 * @returns
 */
export const getRedirectUrl = (redirect) => {
  const locationPathname = window.location.pathname
  const pathname = locationPathname.startsWith(SYSTEM_PREFIX_PATH)
    ? locationPathname.slice(SYSTEM_PREFIX_PATH.length)
    : locationPathname
  const isWhitePath = WHITE_LIST.includes(pathname)
  // 如果没有重定向界面，则改为重定向到首页或判断入口界面
  if (redirect) {
    return decode(redirect)
  } else {
    return isWhitePath ? '/home' : `${pathname}${window.location.search}`
  }
}

const LocalLogin = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [str, setStr] = useState('')
  const onLogin = () => {
    localStorage.setItem(TOKEN_KEY, str)
    const url = getRedirectUrl(searchParams.get('redirect'))
    navigate(url)
  }

  return (
    <div>
      <div style={{ border: '1px solid #ddd', background: '#fff' }}>
        <TextArea onChange={(value) => setStr(value)} value={str} rows={10} />
      </div>
      <Button onClick={onLogin} type="primary">
        登录
      </Button>
    </div>
  )
}

const LoginSuccess = () => {
  console.log("登录策划给你共");
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const code = searchParams.get('code')
  const redirect = searchParams.get('redirect')
  const redirectUrl = getRedirectUrl(redirect)
  console.log("redirectUrl", redirectUrl);
  useEffect(() => {
    // 直接跳转回目标界面
    if (code) {
      console.log("code", code);
      // 获取用户信息并重定向到相关界面
      store.UserStore.getUserData(
        {
          code,
        },
        {
          onOk: async () => {
            await store.WxStore.injectWxConfig()
            console.log("success");
            navigate(redirectUrl)
          },
          onFail: (e) => {
            console.log("fail");
            if (!e) {
              navigate(`/noUser?redirect=${redirect}`)
            }
          },
        }
      )
    } else {
      console.log("login");
      navigate(`/login?redirect=${redirect}`)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <div />
}

export default observer(() => {
  const [searchParams] = useSearchParams()
  const { UserStore } = useContext(MobXProviderContext)

  useEffect(() => {
    if (!window.myMode) {
      const silentLoginUrl = `${window.location.origin
        }${SYSTEM_PREFIX_PATH}/loginSuccess?redirect=${searchParams.get(
          'redirect'
        )}`

      console.log("silentLoginUrl", silentLoginUrl);
      GetLoginQrcodeInfo().then((res) => {
        if (res.code !== 0) {
          return
        }
        const params = res.data
        UserStore.setAppInfo({
          appId: params.appId,
          corpId: params.appId,
          // 应用信息
          agentId: params.agentId,
        })
        SilentLogin({
          appId: params.appId,
          agentId: params.agentId,
          redirect: silentLoginUrl,
        })
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (window.myMode) {
    return <LocalLogin />
  } else {
    return <div />
  }
})
export { LoginSuccess, WHITE_LIST }
