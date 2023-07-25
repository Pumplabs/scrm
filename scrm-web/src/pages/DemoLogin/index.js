import React, { useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { observer, MobXProviderContext } from 'mobx-react'
import { GetLoginQrcodeInfo } from 'src/services/modules/login'
import { createSearchUrl } from 'src/utils/paths'
import styles from './index.module.less'
const LoginPageContent = () => {
  const navigate = useNavigate()
  const { UserStore } = useContext(MobXProviderContext)
  useEffect(() => {
    UserStore.logout()
    GetLoginQrcodeInfo()
      .then((res) => {
        if (res.code !== 0) {
          return
        }
        const params = res.data
        const baseUrl = 'https://open.work.weixin.qq.com/wwopen/sso/qrConnect'
        const url = createSearchUrl(baseUrl, {
          appid: params.appId,
          redirect_uri: encodeURI(`${window.location.origin}/app/login-middle`),
          agentid: params.agentId,
          state: 'STATE',
        })
        window.location.href = url
      })
      .catch((err) => {
        navigate('/system-error')
        console.log(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return (
    <div className={styles['login-container']}>
      <div id="qrcodeContainer" className={styles['qrcode-container']}></div>
    </div>
  )
}

export default observer(LoginPageContent)
