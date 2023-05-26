import { useEffect } from 'react'
import { last, get } from 'lodash'
import { useRoutes, useLocation, matchRoutes } from 'react-router-dom'
import routes from './config'
const URLS = []
const WHITE_LIST = []
export default () => {
  const element = useRoutes(routes)
  const location = useLocation()

  useEffect(() => {
    const matchRes = matchRoutes(routes, location.pathname)
    const route = last(matchRes)
    if (route) {
      const metaTitle = get(route, 'route.element.props.meta.title') || get(route, 'route.meta.title') || '蓬勃来客'
      document.title = metaTitle
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])
  return element
}

export {
  URLS,
  WHITE_LIST
}