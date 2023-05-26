import { Ellipsis } from 'antd-mobile'
import FileIcon from '../FileIcon'
import styles from './index.module.less'
/**
 * @param {Object} data
 */
export default ({ data = {}, onClick, iconType, icon }) => {
  const { filePath, name: fileName, fileType } = data
  return (
    <div onClick={onClick} className={styles['file-item']}>
      {typeof icon === 'undefined' ? (
        <FileIcon className={styles['file-item-icon']} type={iconType} />
      ) : (
        icon
      )}
      <p className={styles['file-item-name']}>{fileName}</p>
    </div>
  )
}
