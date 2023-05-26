import { useEffect, useRef } from 'react'
import {converToHtml} from 'src/utils/covertRichToHtml'
import styles from './index.module.less'

export default ({ data = {} }) => {
  const bodyRef = useRef()

  useEffect(() => {
    if (data.richText) {
      converToHtml(data.richText, bodyRef.current)
    }
  }, [data.richText])

  return (
    <div className={styles['article-content']}>
      <div className={styles['article-title']}>{data.title}</div>
      <div className={styles['article-abstract']}>{data.summary}</div>
      <div
        className={styles['article-body']}
        ref={(r) => (bodyRef.current = r)}></div>
    </div>
  )
}
