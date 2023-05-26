import { RightOutline } from 'antd-mobile-icons'
import MyTag from 'components/MyTag'
import styles from './index.module.less'
/**
 * 
 * @param {Array} tagsArr 源数据
 * @param {Function} onRemoveTag 移除标签
 * @param {Function} onSelectTag 选中标签
 * @returns 
 */
const TagSection = ({ onSelectTag, onRemoveTag, tagsArr = [] }) => {
  return (
    <div className={styles['tags-section']} onClick={onSelectTag}>
      {tagsArr.length
        ? tagsArr.map((ele) => (
            <MyTag
              color="primary"
              key={ele.id}
              className={styles['tags-ele']}
              closable={true}
              onClose={() => onRemoveTag(ele)}>
              {ele.name}
            </MyTag>
          ))
        : '无'}
      <RightOutline className={styles['tags-arrow']} />
    </div>
  )
}
export default TagSection