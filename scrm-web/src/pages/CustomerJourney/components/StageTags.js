import React from 'react'
import { Tag } from 'antd'
import { uniqueId } from 'lodash'
import { PlusOutlined } from '@ant-design/icons'
import ImmediateInput from 'components/ImmediateInput'
import { useModalHook } from 'src/hooks'
import TagItem from './TagItem'
import styles from '../index.module.less'
/**
 * 
 */
export default (props) => {
  const { value = [], onChange, maxCount = 10 } = props
  const { openModal, modalInfo, closeModal } = useModalHook(['add', 'edit'])
  const tags = Array.isArray(value) ? value : []

  const changeValue = (nextVals) => {
    if (typeof onChange === 'function') {
      onChange(nextVals)
    }
  }

  const handleOnAddItem = () => {
    openModal('add')
  }

  const handleEditTag = (item) => {
    openModal('edit', item)
  }

  const handleRemoveTag = (item) => {
    changeValue(tags.filter((ele) => ele.id !== item.id))
  }

  const onValidInputMsg = (text) => {
    if (!text) {
      return '请输入阶段名称'
    }
    const isExist = tags.some(
      (ele) => ele.name === text && ele.id !== modalInfo.data.id
    )
    if (isExist) {
      return '此阶段名称已存在'
    }
  }

  const onSaveItem = (text) => {
    const nextArr =
      modalInfo.type === 'add'
        ? [...tags, { name: text, id: uniqueId('tag_'), isNew: true }]
        : value.map((ele) =>
            ele.id === modalInfo.data.id
              ? {
                  ...ele,
                  name: text,
                }
              : ele
          )
    changeValue(nextArr)
    closeModal()
  }

  return (
    <div className={styles.tagRowBody}>
      {tags.length < maxCount ? (
        <Tag
          className={styles['add-tag-btn']}
          onClick={handleOnAddItem}
        >
          <PlusOutlined /> 添加阶段
        </Tag>
      ) : null}
      {modalInfo.type === 'add' && tags.length < maxCount && (
        <div className={styles.editTagItem}>
          <ImmediateInput
            onSave={onSaveItem}
            onCancel={closeModal}
            validMsg={onValidInputMsg}
            maxLength={maxCount}
          />
        </div>
      )}
      {tags.map((ele) => (
        <TagItem
          data={ele}
          key={ele.name}
          onSave={onSaveItem}
          onCancel={closeModal}
          editable={modalInfo.type === 'edit' && modalInfo.data.id === ele.id}
          validMsg={onValidInputMsg}
          onEdit={handleEditTag}
          onRemove={handleRemoveTag}
          closable={tags.length > 1}
        />
      ))}
    </div>
  )
}
