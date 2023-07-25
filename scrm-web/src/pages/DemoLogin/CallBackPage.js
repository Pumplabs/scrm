import { useContext } from 'react'
import { MobXProviderContext } from 'mobx-react'
import { useSearchParams, useNavigate } from 'react-router-dom'

export default () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { UserStore } = useContext(MobXProviderContext)
  const authCode = searchParams.get('code')
  if (authCode) {
    UserStore.getUserInfo(authCode)
  } else {
    navigate('/system-error')
  }
  return <div />
}
