import { useRef, useEffect, useMemo } from 'react'
import cls from 'classnames'
import { get } from 'lodash'
import { getFileUrl } from 'src/utils'
import { refillHtmlByNodeList } from '../../ArticleEditor/ArticleContentEditor/getHtmlByNodeList'
import { findAllImgFileIds } from './utils'
import styles from './index.module.less'

/**
 * @param {Object} data 文章数据
 */
export default ({ data = {}, className }) => {
  const contentRef = useRef(null)

  const jsonStr = useMemo(() => JSON.stringify(data), [data])

  const refillArticle = async (richText) => {
    const imgFileIds = findAllImgFileIds(richText)
    const imgUrls = await getFileUrl({ ids: imgFileIds })
    if (contentRef.current) {
      contentRef.current.innerHTML = ''
    }
    refillHtmlByNodeList(richText, contentRef.current, imgUrls)
  }

  useEffect(() => {
    if (data.richText) {
      refillArticle(data.richText)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsonStr])

  return (
    <div className={cls({
      [styles['article-preview']]: true,
      [className]: className
    })}>
      <div className={styles['article-header']}>
        <h4 className={styles['article-title']}>{data.title}</h4>
        <div className={styles['article-info']}>
          <span className={styles['article-info-text']}>
            {get(data, 'creatorInfo.name')}
          </span>
          <span className={styles['article-info-text']}>
            {data.createdAt}
          </span>
        </div>
      </div>
      <div className={styles['article-summary']}>{data.summary}</div>
      <div
        className={cls({
          'w-e-text': true,
          [styles['article-content']]: true,
        })}
        ref={(ref) => (contentRef.current = ref)}
      >
      </div>
    </div>
  )
}
