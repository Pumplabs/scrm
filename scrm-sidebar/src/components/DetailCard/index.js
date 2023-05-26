import { LeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { Spin } from 'antd'
import cls from 'classnames'
import styles from './index.module.less'
export default (props) => {
  const navigate = useNavigate()
  const { extra, children, backUrl, onBack, title, loading = false, bodyClassName } = props

  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack()
    }
    if (backUrl) {
      navigate(backUrl)
    }
  }
  
  return (
    <div className={styles['detail-card']}>
      <div className={styles['detail-card-header']}>
        <LeftOutlined className={styles['left-action']} onClick={handleBack} />
        <span className={styles['detail-card-title']}>{title}</span>
        {extra ? <div className={styles['right-action']}>{extra}</div> : null}
      </div>
      <div className={cls({
        [styles['detail-card-body']]: true,
        [bodyClassName]: bodyClassName
      })}>
        <Spin spinning={loading}>
        {children}
        </Spin>
      </div>
    </div>
  )
}
