import React, { useRef, useLayoutEffect, useEffect, useContext } from 'react'
import { MobXProviderContext, observer } from 'mobx-react'

const OpenEle = ({ type, openId, corpId, ...rest }) => {
  const openRef = useRef(null)

  const rebindRef = () => {
    if (window.WWOpenData) {
      window.WWOpenData.bind(openRef.current)
    }
  }
  useEffect(() => {
    return () => {
      if (window.WWOpenData) {
        window.WWOpenData.off('update', rebindRef)
      }
    }
  }, [])

  useLayoutEffect(() => {
    if (window.WWOpenData) {
      window.WWOpenData.bind(openRef.current)
    }
  })

  return (
    <ww-open-data
      ref={openRef}
      type={type}
      openid={openId}
      corpid={corpId}
      {...rest}
    />
  )
}

const OpenDataEle = observer(({ type, openid, ...rest }) => {
  const { UserStore } = useContext(MobXProviderContext)
  if (!openid || !UserStore.corpInfo.corpId) {
    return null
  }

  if (window.myMode) {
    return <span {...rest}>{openid || ''}</span>
  }
  return <OpenEle type={type} openId={openid} corpId={UserStore.corpInfo.corpId} {...rest} />
})
export default OpenDataEle
