import cls from 'classnames'
import GroupIcon from 'components/GroupIcon'
import { UNSET_GROUP_NAME } from 'src/utils/constants'
import styles from './index.module.less'
const GroupItem = ({ data = {}, name, className, onClick, extra }) => {
  const handleClick = () => {
    if (typeof onClick === 'function') {
      onClick(data)
    }
  }
  const defaultName = data.name || UNSET_GROUP_NAME
  return (
    <div className={cls({
      [styles['group-item']]: true,
      [className]: className
    })} onClick={handleClick}>
      <GroupIcon className={styles['group-cover']} />
      <div className={styles['group-content']}>
        <p className={styles['group-name']}>
          {name ? name: defaultName}
        </p>
        <div className={styles['group-extra-info']}>
          {extra}
        </div>
      </div>
    </div>
  )
}
export default GroupItem