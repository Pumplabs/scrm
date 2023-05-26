import { Tag } from 'antd'
import ImmediateInput from 'components/ImmediateInput'
import styles from '../index.module.less'

const TagItem = (props) => {
  const { editable, onSave, onCancel, onEdit, onRemove, onValidInputMsg, data, idx, closable, ...rest } = props
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

  if (editable) {
    return (
      <div className={styles.editTagItem}>
        <ImmediateInput
          defaultValue={data.name}
          onSave={onSave}
          onCancel={onCancel}
          validMsg={onValidInputMsg}
          maxLength={10}
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