import React from 'react'
import { Tag } from 'antd'
import ImmediateInput from 'components/ImmediateInput'
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import TagItem from './TagItem'
import styles from './index.module.less'

/**
 * @param {Object} 标签组数据
 * @param {Object} modalInfo 数据
 * @param {Function} onEdit 点击编辑
 * @param {Function} onAddItem 点击新增标签
 * @param {Function} onSaveItem 点击保存标签
 * @param {Function} onEditTagItem 编辑标签
 * @param {Function} onRemoveTagItem 删除标签
 * @param {Function} onCancelTag 标签取消操作
 * @param {Function} onRemove 删除标签组
 * @param {Nubmer} idx 排序
 */
export default (props) => {
  const {
    data = {},
    modalInfo,
    onEdit,
    onAddItem,
    onSaveItem,
    onEditTagItem,
    onRemoveTagItem,
    onCancelTag,
    onRemove,
    allowAdd = false,
    idx,
    confirmLoading,
  } = props
  const { tags: tagArr, ...groupInfo } = data
  const tags = Array.isArray(tagArr) ? tagArr : []

  // 添加标签
  const handleOnAddItem = () => {
    if (typeof onAddItem === 'function') {
      onAddItem({ groupId: data.id, groupInfo, id: 'new' }, idx)
    }
  }

  // 删除标签组
  const handleRemove = () => {
    if (typeof onRemove === 'function') {
      onRemove(data, idx)
    }
  }

  // 编辑标签组
  const handleEdit = () => {
    if (typeof onEdit === 'function') {
      onEdit(data, idx)
    }
  }

  // 编辑标签
  const handleEditTag = (item) => {
    if (typeof onEditTagItem === 'function') {
      onEditTagItem(
        {
          ...item,
          groupInfo,
        },
        idx
      )
    }
  }

  // 删除标签
  const handleRemoveTag = (item) => {
    if (typeof onRemoveTagItem === 'function') {
      onRemoveTagItem(
        {
          ...item,
          groupId: data.id,
          groupInfo,
        },
        idx
      )
    }
  }

  const onValidInputMsg = (text) => {
    if (!text) {
      return '请输入标签名称'
    }
    const isExist = tags.some(
      (ele) => ele.name === text && ele.id !== modalInfo.data.id
    )
    if (isExist) {
      return '此标签名称已存在'
    }
  }

  return (
    <div className={styles.tagRow}>
      <div className={styles.tagRowHeader}>
        <div className={styles.tagRowTitle}>
          <span>{data.name}</span>
        </div>
        <div className={styles.actionTool}>
          <span className={styles.actionItem} onClick={handleEdit}>
            <EditOutlined /> 修改
          </span>
          <span className={styles.actionItem} onClick={handleRemove}>
            <DeleteOutlined />
            删除
          </span>
        </div>
      </div>
      <div className={styles.tagRowBody}>
        {allowAdd ? (
          <Tag
            className={styles['add-tag-btn']}
            onClick={handleOnAddItem}
            color="#fff"
          >
            <PlusOutlined /> 添加标签
          </Tag>
        ) : null}
        {modalInfo.data &&
          modalInfo.data.id === 'new' &&
          modalInfo.data.groupId === data.id && (
            <div className={styles.editTagItem}>
              <ImmediateInput
                onSave={onSaveItem}
                confirmLoading={confirmLoading}
                onCancel={onCancelTag}
                validMsg={onValidInputMsg}
                maxLength={30}
              />
            </div>
          )}
        {tags.map((ele) => (
          <TagItem
            data={ele}
            key={ele.id}
            onSave={onSaveItem}
            onCancel={onCancelTag}
            editable={false}
            validMsg={onValidInputMsg}
            onEdit={handleEditTag}
            onRemove={handleRemoveTag}
            closable={tags.length > 1}
            maxLength={30}
            confirmLoading={confirmLoading}
          />
        ))}
      </div>
    </div>
  )
}
