import { useRoutes } from 'react-router-dom'
import routes from './config'

export default () => {
  const element = useRoutes(routes)
  return element
}

export const getMatchPath = (matchRoutesData = []) => {
  let matchPath = ''
  matchRoutesData.forEach((item, idx) => {
    if (item.route.path) {
      matchPath +=
        (idx > 0 && !matchPath.endsWith('/') ? '/' : '') + item.route.path
    }
  })
  return matchPath
}
export { routes }