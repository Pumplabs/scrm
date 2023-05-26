import groupIconUrl from 'assets/images/icon/group-icon.svg'
import cls from 'classnames'
import styles from './index.module.less'

const GroupIcon = ({ className }) => {
  return (
    <div
      className={cls({
        [styles['group-icon']]: true,
        [className]: className,
      })}>
      <img src={groupIconUrl} alt="" />
    </div>
  )
}
export default GroupIcon
