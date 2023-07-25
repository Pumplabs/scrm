import cls from 'classnames'
import ArticleContentEditor from './ArticleContentEditor'
import styles from './index.module.less'
export default ({ value = {}, onChange, editorRef }) => {
  const handleChange = (nextValue) => {
    if (typeof onChange === 'function') {
      onChange(nextValue)
    }
  }
  const changeData = (key, val) => {
    handleChange({
      ...value,
      [key]: val
    })
  }

  const handleEditorChange = (val) => {
    changeData('content', val)
  }
 
  return (
    <div className={cls({
      [styles['article-editor']]: true,
      'article-editor': true,
    })}>
      <div className={cls({
        [styles['article-body']]: true,
        'article-body--has-error': !value.content,
      })}>
        <ArticleContentEditor
          value={value.content}
          onChange={handleEditorChange}
          ref={editorRef}
          className={styles['content-editor']}
        />
      </div>
    </div >
  )
}

