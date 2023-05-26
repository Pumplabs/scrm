import { useContext } from 'react'
import cls from 'classnames'
import { observer, MobXProviderContext } from 'mobx-react'
import defaultAvatorUrl from 'assets/images/defaultAvator.jpg'

const UserAvatar = observer(({ className, ...rest }) => {
  const { UserStore } = useContext(MobXProviderContext)
  const userData = UserStore.userData
  const userAvatarUrl = userData.avatarUrl ? userData.avatarUrl : defaultAvatorUrl
  return (
    <img
      src={userAvatarUrl}
      className={cls({
        [className]: className
      })}
      alt=""
      {...rest}
    />
  )
})

export default UserAvatar