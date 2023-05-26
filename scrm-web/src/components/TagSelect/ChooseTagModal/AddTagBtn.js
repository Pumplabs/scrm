import { Tag } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import ImmediateInput from 'components/ImmediateInput'
import styles from './index.module.less'

/**
 * 新增标签按钮
 * @param {*} props 
 * @returns 
 */
const AddTagItem = (props) => {
  const { onClick, inputVisible, onSave, onCancel, validMsg } = props
  return (
    <>
      <Tag
        className={styles.addTagBtn}
        onClick={onClick}
      >
        <PlusOutlined /> 新增标签
      </Tag>
      {
        inputVisible ? <div style={{ display: "inline-block", width: 220, verticalAlign: "top", marginRight: 8 }}>
          <ImmediateInput
            onSave={onSave}
            onCancel={onCancel}
            validMsg={validMsg}
          />
        </div> : null
      }
    </>
  )
}
export default AddTagItem