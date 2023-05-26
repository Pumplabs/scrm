import { Tag } from 'antd'
import ImmediateInput from 'components/ImmediateInput'
import styles from './index.module.less'

/**
 * 
 * @param {Boolean} editable 是否可编辑标签
 * @param {Function} onSave 点击保存
 * @param {Function} onCancel 点击取消
 * @param {Function} onEdit 点击编辑
 * @param {Function} onRemove 点击删除
 * @param {Function} onValidInputMsg
 * @param {Object} data 标签数据
 * @param {Boolean} closable 是否可删除
 * @returns 
 */
const TagItem = (props) => {
  const { editable, onSave, onCancel, onEdit, onRemove, onValidInputMsg, data,  closable, ...rest } = props
  const handleEdit = () => {
    if (typeof onEdit === 'function') {
      onEdit(data)
    }
  }

  const handleRemove = (e) => {
    e.preventDefault()
    if (typeof onRemove === 'function') {
      onRemove(data)
    }
  }

  const handleSave = (text) => {
    if (text === data.name) {
      onCancel()
    } else {
      onSave(text)
    }
  }

  if (editable) {
    return (
      <div className={styles.editTagItem}>
        <ImmediateInput
          defaultValue={data.name}
          onSave={handleSave}
          onCancel={onCancel}
          validMsg={onValidInputMsg}
          {...rest}
        />
      </div>
    )
  } else {
    return (
      <span className={styles['tag-item']}>
        <Tag
          onClick={handleEdit}
          onClose={handleRemove}
          closable={closable}
          className={styles['tag-ele']}
        >
          {data.name}
        </Tag>
      </span>
    )
  }
}
export default TagItem