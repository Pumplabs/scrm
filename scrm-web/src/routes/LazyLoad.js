import React, { useContext } from 'react'
import { Spin } from 'antd'
import { toJS } from 'mobx'
import { useLocation, Navigate, matchRoutes } from 'react-router-dom'
import { observer, MobXProviderContext } from 'mobx-react'
import { PageNoAuth, NotFound } from 'src/pages/ExceptionPage'
import { TOKEN_KEY } from 'src/utils/constants'
import routes from './config'
import { getMatchPath } from './index'

const PageLoad = () => {
  return (
    <Spin spinning={true} tip="页面加载中...">
      <div style={{ height: 220 }}></div>
    </Spin>
  )
}

/**
 * 懒加载
 * @param {*} param0 
 * @returns 
 */
const LazyLoad = ({ comp: Comp, needAuth = true, needLogin = true }) => {
  const location = useLocation()
  const hasLogin = localStorage.getItem(TOKEN_KEY)

  if (!hasLogin && needLogin) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return (
    <PermissionComp needAccessControl={window.myMode ? false : needAuth}>
      <Comp />
    </PermissionComp>
  )
}


const PermissionContent = ({ list = [], children }) => {
  const location = useLocation()
  const matchRes = matchRoutes(routes, location.pathname)
  const checkAccessAuth = (list = []) => {
    const matchPath = getMatchPath(matchRes)
    if (matchPath !== '*' && !list.includes(matchPath)) {
      return false
    }
    return true
  }
  if (!checkAccessAuth(list)) {
    return <PageNoAuth />
  } else {
    return children
  }
}
/**
 * @param {Boolean} needAccessControl 需要访问控制
 */
const PermissionComp = observer(({ children, needAccessControl }) => {
  const { MenuStore } = useContext(MobXProviderContext)
  if (!needAccessControl) {
    return children
  }
  if (MenuStore.menuLoading) {
    return <Spin tip="菜单加载中..."></Spin>
  }
  if (MenuStore.pageMenu.length === 0) {
    return <NotFound />
  }
  return (
    <PermissionContent
      list={toJS(MenuStore.authCodes)}
    >
      {children}
    </PermissionContent>
  )
})
export default LazyLoad
