import { useMemo } from 'react'
import { isEmpty } from 'lodash'
import cls from 'classnames'
import OpenEle from 'components/OpenEle'
import defaultAvatorUrl from 'assets/images/defaultAvator.jpg'
import styles from './index.module.less'
/**
 * @param {string} avatarUrl 头像地址
 * @param {string} name 名称
 */
export default ({ data: userData = {}, style = {} }) => {
  const data = userData ? userData : {}
  if (isEmpty(data)) {
    return null
  }
  return (
    <span className={styles['user-tag']} style={style}>
      <UserAvatar src={data.avatarUrl} className={styles['user-img']} />
      <span className={styles['user-name']}>
        <OpenEle type="userName" openid={data.name} />
      </span>
    </span>
  )
}

/**
 *
 * @param {String} src 头像链接
 * @returns
 */
const UserAvatar = ({ src, className, size, style = {}, ...rest }) => {
  const avatarUrl = src ? src : defaultAvatorUrl
  const defaultStyle = useMemo(() => {
    return size > 0
      ? {
          width: size,
          height: size,
        }
      : {}
  }, [size])
  return (
    <img
      src={avatarUrl}
      alt=""
      className={cls({
        [styles['avatar']]: true,
        [className]: className,
      })}
      style={{ ...defaultStyle, ...style }}
      {...rest}
    />
  )
}

export { UserAvatar }