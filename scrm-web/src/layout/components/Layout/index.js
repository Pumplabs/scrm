import React, { useContext, useLayoutEffect, useMemo } from 'react'
import cls from 'classnames'
import { Outlet, useLocation, matchRoutes } from 'react-router-dom'
import { toJS } from 'mobx'
import { observer, MobXProviderContext } from 'mobx-react'
import PathContext from '../../PathContext'
import MenuSideBar from './MenuSideBar'
import UserSideBar from './UserSideBar'
import ErrorPage from '../../ErrorPage'
import { routes, getMatchPath } from 'src/routes'
import { getPagePath } from './utils'
import styles from './index.module.less'

export const USER_SIDE_PATHS = [`/companySetting`, `/authOplatform`]
const LayoutContent = observer(() => {
  const { UserStore, MenuStore } = useContext(MobXProviderContext)
  const location = useLocation()

  useLayoutEffect(() => {
    UserStore.getUserInfo()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const pageNames = useMemo(() => {
    const matchRoutesRes = matchRoutes(routes, location.pathname)
    const allMenuData = toJS(MenuStore.allMenu)
    const matchPath = getMatchPath(matchRoutesRes)
    return matchPath !== '*' ? getPagePath(allMenuData, matchPath) : []
  }, [location.pathname, MenuStore.allMenu])

  const needUserSideBar = true
  const needMenuSideBar = true

  return (
    <div
      className={cls({
        [styles['layout']]: true,
        [styles['need-userside']]: needUserSideBar,
        [styles['need-menuside']]: needMenuSideBar,
        [styles['layout-collapsed']]: MenuStore.collapsed,
      })}>
      <PathContext.Provider
        value={{
          pageNames,
        }}>
        <LayoutSide
          needUserSideBar={needUserSideBar}
          needMenuSideBar={needMenuSideBar}
        />
        <div className={styles['layout-content-wrap']}>
          <div className={styles['layout-content']}>
            {UserStore.getUserLoading ? (
              <span>加载界面中，请稍后...</span>
            ) : (
              <Outlet />
            )}
          </div>
        </div>
      </PathContext.Provider>
    </div>
  )
})


const LayoutSide = observer(({ needUserSideBar, needMenuSideBar }) => {
  const { MenuStore } = useContext(MobXProviderContext)
  return (
    <div className={styles['layout-side']}>
      {needUserSideBar ? (
        <UserSideBar
          collapsed={MenuStore.collapsed}
        />
      ) : null}
      {needMenuSideBar ? (
        <MenuSideBar
          collapsed={MenuStore.collapsed}
          width={MenuStore.collapsed ? 80 : 240}
          menus={MenuStore.pageMenu}
        />
      ) : null}
    </div>
  )
})

class Layout extends React.Component {
  state = {
    error: null,
    errorInfo: null,
  }

  componentDidCatch(err, info) {
    console.log(err);
    this.setState({
      error: err,
      errorInfo: info,
    })
  }

  render() {
    if (this.state.error) {
      return (
        <ErrorPage error={this.state.error} errorInfo={this.state.errorInfo} />
      )
    }

    return <LayoutContent />
  }
}

export default Layout
