import { useContext } from 'react'
import OpenEle from 'components/OpenEle'
import { MobXProviderContext, observer } from 'mobx-react'

export default observer(({ userId, replaceText = '我' }) => {
  const { UserStore } = useContext(MobXProviderContext)
  if (!UserStore.userData.extId || !userId) {
    return userId || null
  }
  return userId === UserStore.userData.extId ? (
    replaceText
  ) : (
    <OpenEle type="userName" openid={userId} />
  )
})
