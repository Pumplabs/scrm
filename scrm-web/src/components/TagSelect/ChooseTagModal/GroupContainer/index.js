import React from 'react';
import { isPlainObject } from 'lodash'
import TagGroupItem from '../GroupItem'

/**
 * 选择标签弹窗
 * @param {array<string>} selectedKeys 选中的标签
 * @param {array<object>} tagList 标签源数据
 * @param {} valueKey 
 * @param {boolean} valueIsItem 默认返回id
 * @param {boolean} itemIsValue 是否把item作为选中值
 * @returns 
 */

const TagGroupContainer = (props) => {
  const {
    dataSource = [],
    selectedKeys = [],
    disabledKeys = [],
    onChange,
    itemIsValue,
    valueKey = 'id',
    groupItemPrefix,
    empty,
    style,
    tagsEmpty,
    hasSearchText,
    ...rest
  } = props

  // 获取下次选中的列表
  const getNextTagsBySelectedStatus = (arr, data, selected) => {
    const isObjectItem = isPlainObject(data)
    if (selected) {
      return [...arr, (isObjectItem && valueKey && !itemIsValue) ? data[valueKey] : data]
    } else {
      // 如果非选中时，从已选择的keys中移除当前项
      return arr.filter(ele => {
        if (valueKey) {
          const eleVal = isPlainObject(ele) ? ele[valueKey] : ele
          const dataVal = isObjectItem ? data[valueKey] : data
          return eleVal !== dataVal
        } else {
          return ele !== data
        }
      })
    }
  }

  const onSelectTag = (item, flag) => {
    if (typeof onChange === 'function') {
      onChange(getNextTagsBySelectedStatus(selectedKeys, item, flag))
    }
  }

  return (
    <>
     {
         dataSource.map((ele, idx) => {
          const tags = Array.isArray(ele.tags) ? ele.tags : []
          return (
            <TagGroupItem
              prefix={typeof groupItemPrefix === 'function' ? groupItemPrefix(ele, idx) : null}
              disabledKeys={disabledKeys}
              tags={tags}
              groupName={ele.name}
              selectedKeys={selectedKeys}
              key={valueKey ? ele[valueKey] : ele}
              valueKey={valueKey}
              itemIsValue={itemIsValue}
              onSelect={onSelectTag}
              empty={tagsEmpty}
            />
          )
        })
      }
    </>
  );
};


export default TagGroupContainer