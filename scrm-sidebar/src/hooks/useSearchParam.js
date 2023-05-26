import { useMemo  } from 'react'
import { useLocation } from 'react-router-dom'
import { decodeUrl } from 'src/utils'
export default () => {
  const location = useLocation()
  const pageParams = useMemo(() => {
    const searchStr = location.search
    return searchStr ? decodeUrl(searchStr.slice(1)) : {}
  }, [location.search])
  return pageParams
}