import cls from 'classnames'
import { getOptionItem } from 'src/utils'
import { PRODUCT_STATUS_VALS, PRODUCT_STATUS_OPTIONS } from '../../../constants'
import styles from './index.module.less'
export default ({ type }) => {
  const label = getOptionItem(PRODUCT_STATUS_OPTIONS, type) || ''
  return (
    <span
      className={cls({
        [styles['status-item']]: true,
        [styles[`sale-status`]]: type === PRODUCT_STATUS_VALS.SALF,
        [styles[`off-status`]]: type === PRODUCT_STATUS_VALS.OFF,
        [styles[`draft-status`]]: type === PRODUCT_STATUS_VALS.DRAFT,
      })}>
      {label}
    </span>
  )
}
