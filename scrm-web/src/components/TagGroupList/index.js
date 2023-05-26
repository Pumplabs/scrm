import { Tag } from 'antd'
import styles from './index.module.less'
/**
 * 
 * @param {*} param0
 * @param {object} data
 * @param {function} onSelect 选择企业标签
 * @param {array} selectedKeys 选中标签id值
 * @param {function} onAddTag 添加标签
 * @param {ReactNode} addonBefore 前缀元素
 * @param {boolean} addInputVisible 
 * @param {function} onInputOk
 * @param {function} onInputCancel
 * @param {function} validInput
 * @returns 
 */
const TagGroupItem = (props) => {
  const { data, onSelect, selectedKeys, addonBefore } = props
  const tags = Array.isArray(data.tags) ? data.tags : []
  const handleSelectTag = (item, checked) => {
    if (typeof onSelect === 'function') {
      onSelect(item, checked)
    }
  }

  return (
    <div className={styles['tag-group-item']}>
      <p className={styles['group-name']}>{data.name}</p>
      {addonBefore}
      {
        tags.map(ele => {
          const isSelected = selectedKeys.includes(ele.id)
          return (
            <Tag
              className={styles['tag-item']}
              key={ele.id}
              color={isSelected ? 'blue' : 'default'}
              onClick={() => handleSelectTag(ele, !isSelected)}
            >
              {ele.name}
            </Tag>
          )
        })
      }
    </div>
  )
}
export default TagGroupItem