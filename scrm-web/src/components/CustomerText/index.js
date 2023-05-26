import { isEmpty } from 'lodash'
import cls from 'classnames'
import styles from './index.module.less'
// 客户名称
const CustomerText = ({className, data = {}}) => {
  if (isEmpty(data)) {
    return null
  }
  const hasCorpName = !!data.corpName
  return (
    <span className={cls({
      [styles['customer-text']]:true,
      [className]: className
    })}>
      <span className={styles['customer-name']}>
        {data.name}
      </span>
      <span className={cls({
        [styles['customer-source']]: true,
        [styles['ww-source']]: hasCorpName,
      })}>@{hasCorpName ? data.corpName : '微信'}</span>
    </span>
  )
}
export default CustomerText