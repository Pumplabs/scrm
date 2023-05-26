import { Switch } from 'antd-mobile'
import styles from './index.module.less'
export default ({ className, ...rest }) => {
  return (
    <div className={styles['notice-item']}>
      <label>动态通知</label>
      <Switch {...rest} />
    </div>
  )
}
