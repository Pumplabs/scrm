import { useSearchParams } from 'react-router-dom'
import styles from './index.module.less'

export default () => {
  const [searchParams] = useSearchParams()
  const title = searchParams.get('title') || 'System Error'
  const description = searchParams.get('description') || '系统错误'
  return (
    <div className={styles['page']}>
      <h2 className={styles['page-title']}>
        {title}
      </h2>
      <div className={styles['content']}>
        <p className={styles['tip-text']}>
          {description}
        </p>
      </div>
    </div>
  )
}
