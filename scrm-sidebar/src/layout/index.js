import { useContext, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { MobXProviderContext, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { WHITE_LIST } from 'src/pages/Login'

export default observer(() => {
  const location = useLocation()
  const { WxStore } = useContext(MobXProviderContext)
  const isWhitePathname = useMemo(() => {
    return WHITE_LIST.includes(location.pathname)
  }, [location.pathname])
  if (!toJS(WxStore.configList).includes(location.pathname) && !isWhitePathname && !window.myMode) {
    return null
  }
  return (
    <Outlet />
  )
})
