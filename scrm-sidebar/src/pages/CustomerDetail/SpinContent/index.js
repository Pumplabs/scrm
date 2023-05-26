import { DotLoading } from 'antd-mobile'
import styles from './index.module.less'

export default () => {
  return (
    <div className={styles['dot-content']}>
      <DotLoading />
      <span className={styles['dot-text']}>内容正在努力加载中</span>
    </div>
  )
}
