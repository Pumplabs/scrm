import cls from 'classnames'
import defaultAvatarUrl from 'assets/images/icon/user-icon.svg'
import styles from './index.module.less'
const UserIcon = ({ className, src, size = 'small' }) => {
  const imgSrc = src ? src : defaultAvatarUrl
  return (
    <span
      className={cls({
        [styles['user-icon']]: true,
        [styles[`user-icon-${size}`]]: size,
        [styles['user-default']]: !src,
        [className]: className,
      })}>
      <img src={imgSrc} alt="" className={styles['icon-img']} />
    </span>
  )
}
export default UserIcon