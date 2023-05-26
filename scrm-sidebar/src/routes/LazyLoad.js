import React from 'react'
import { useLocation, Navigate, matchRoutes } from 'react-router-dom'
import { NoAuthPage } from 'src/pages/Exceptions'
import PageLoad from './PageLoad'
import { TOKEN_KEY } from 'src/utils/constants'
import routes from './config'

const LazyLoad = ({ comp: Comp, needAuth = false, meta }) => {
  const location = useLocation()
  const hasLogin = localStorage.getItem(TOKEN_KEY)

  if (!hasLogin && needAuth) {
    if (window.myMode) {
      return <Navigate to="/login" state={{ from: location }} replace />
    } else {
      return <div>用户没登录</div>
    }
  }
  return (
    <React.Suspense fallback={<PageLoad />}>
      <Comp />
    </React.Suspense>
  )
}
/**
 * @param {Boolean} needAccessControl 需要访问控制
 */
const PermissionContent = ({ children, needAccessControl, authList = [] }) => {
  const location = useLocation()
  const matchRes = matchRoutes(routes, location.pathname)
  if (!needAccessControl) {
    return children
  }
  const checkAccessAuth = () => {
    let matchPath = ''
    matchRes.forEach((item, idx) => {
      matchPath +=
        (idx > 0 && !matchPath.endsWith('/') ? '/' : '') + item.route.path
    })
    if (matchPath !== '*' && !authList.includes(matchPath)) {
      return false
    }
    return true
  }
  if (!checkAccessAuth()) {
    return <NoAuthPage />
  } else {
    return children
  }
}

export default LazyLoad
export { PermissionContent }
