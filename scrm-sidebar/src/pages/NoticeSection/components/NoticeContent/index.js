import { isEmpty } from 'lodash'
import { FileList } from 'components/UploadFile'
import styles from './index.module.less'

const MsgContent = ({ data = {} }) => {
  if (isEmpty(data)) {
    return null
  }
  const [{ content: textContent }] =
    Array.isArray(data.text) && data.text.length > 0
      ? data.text
      : [{ content: '' }]
  // 附件
  const mediaArr = Array.isArray(data.media) ? data.media : []
  return (
    <>
      <p className={styles['text-content']}>{textContent}</p>
      {mediaArr.length > 1 ? (
        <p className={styles['attach-ellipsis']}>...</p>
      ) : null}
      <FileList mediaArr={mediaArr.slice(0, 1)} />
    </>
  )
}
export default MsgContent
