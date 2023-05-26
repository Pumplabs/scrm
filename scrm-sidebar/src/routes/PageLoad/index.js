import { DotLoading, SpinLoading } from 'antd-mobile'
import styles from './index.module.less'
const PageLoad = () => {
  return (
    <div className={styles['page-load']}>
      <div className={styles['spin-content']}>
        <SpinLoading style={{ '--size': '24px' }} />
      </div>
      <div>
        奋力加载中
        <DotLoading />
      </div>
    </div>
  )
}

export default PageLoad
