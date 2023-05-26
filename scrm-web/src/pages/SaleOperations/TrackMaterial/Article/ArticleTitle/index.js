import { useMemo } from 'react'
import { Input } from 'antd'
import cls from 'classnames'
import { TITLE_LEN } from '../../../constants'
import styles from './index.module.less'

export default ({ value, onChange }) => {

  const changeVal = (val) => {
    if (typeof onChange === 'function') {
      onChange(val)
    }
  }

  const handleChange = (e) => {
    changeVal(e.target.value)
  }

  const titleCount = useMemo(() => {
    return typeof value === 'string' ? value.length : 0
  }, [value])
  return (
    <div className={styles['article-header']}>
      <div className={
        cls({
          [styles['article-title-wrap']]: true,
        })
      }>
        <Input.TextArea
          placeholder="请输入标题"
          maxLength={TITLE_LEN}
          className={styles['article-title']}
          value={value}
          onChange={handleChange}
          bordered={false}
        />
        <WordCount
          current={titleCount}
          total={TITLE_LEN}
        />
      </div>
    </div>
  )
}

const WordCount = ({ current, total }) => {
  return (
    <div className={styles['word-count']}>
      <span className={styles['current-count']}>{current}</span>
      <span className={styles['divider-code']}>/</span>
      <span className={styles['max-count']}>{total}</span>
    </div>
  )
}
