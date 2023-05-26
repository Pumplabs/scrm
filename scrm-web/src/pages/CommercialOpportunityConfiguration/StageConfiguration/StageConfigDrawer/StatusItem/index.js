import { formatRgbColor } from 'components/MyColorPicker/utils'
import styles from './index.module.less'
export default (props) => {
  const { name, color } = props
  const str = formatRgbColor(color, '0.38')
  return (
    <span
      className={styles['status-item']}
      style={{ backgroundColor: str, color, borderColor: color }}>
      {name}
    </span>
  )
}
