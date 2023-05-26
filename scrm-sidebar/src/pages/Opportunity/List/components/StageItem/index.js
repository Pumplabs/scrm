import cls from 'classnames'
import { formatRgbColor } from './utils'
import styles from './index.module.less'
const StageItem = ({ className, name, color }) => {
  const str = formatRgbColor(color, '0.38')
  return (
    <span
      className={cls({
        [className]: className,
        [styles['status-item']]: true,
      })}
      style={{
        backgroundColor: str,
        borderColor: str,
      }}>
      {name}
    </span>
  )
}
export default StageItem
