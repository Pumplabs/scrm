import React from 'react';
import { Tag } from 'antd';
import cls from 'classnames'
import { isPlainObject } from 'lodash';
import styles from './index.module.less';

/**
 * 
 * @param {string} groupName 组名称
 * @param {Array<object>} tags 标签 
 * @param {ReactNode} prefix 前缀组件
 * @returns 
 */
const TagGroupItem = (props) => {
  const { onSelect, prefix, selectedKeys = [], disabledKeys = [], groupName, tags = [], itemIsValue, valueKey, empty} = props
  const handleSelectTag = (item, checked) => {
    if (typeof onSelect === 'function') {
      onSelect(item, checked)
    }
  }

  const getItemKey = (ele) => {
    if (!valueKey) {
      return ele
    } else {
      return isPlainObject(ele) ? ele[valueKey] : ele
    }
  }

  const tagIsSelected = (ele) => {
    if (Array.isArray(selectedKeys)) {
      return selectedKeys.some(keyItem => {
        const keyVal = getItemKey(keyItem)
        const eleVal = getItemKey(ele)
        return keyVal === eleVal
      })
    } else {
      return false
    }
  }

  const tagIsDisabled = (ele) => {
    return disabledKeys.some(keyItem => {
      const keyVal = getItemKey(keyItem)
      const eleVal = getItemKey(ele)
      return keyVal === eleVal
    })
  }
  return (
    <div className={styles['tag-group-item']}>
      <p className={styles['group-name']}>{groupName}</p>
      {prefix}
      {
        tags.map(ele => {
          const isSelected = tagIsSelected(ele)
          const isDisabled = tagIsDisabled(ele)
          return (
            <Tag
              className={cls({
                [styles['tag-item']]: true,
                [styles['tag-default']]: !isSelected,
                [styles['tag-selected']]: isSelected,
                [styles['tag-disabled']]: isDisabled
              })}
              key={ele.id}
              disabled={isDisabled}
              onClick={() => {
                if (!isDisabled) {
                  handleSelectTag(ele, !isSelected)
                }
              }}
            >
              {ele.name}
            </Tag>
          )
        })
      }
      {
        tags.length === 0 ?  empty : null
      }
    </div>
  )
}
export default TagGroupItem