import React, { useState, useMemo } from 'react';
import { Input, Button, Empty, Spin } from 'antd';
import { debounce, isPlainObject } from 'lodash'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import AddTagBtn from './AddTagBtn'
import TagGroupItem from './GroupItem'
import { useModalHook } from 'src/hooks'
import styles from './index.module.less';

/**
 * 选择标签弹窗
 * @param {array<string>} selectedKeys 选中的标签
 * @param {array<object>} tagList 标签源数据
 * @param {function} runAddTag 添加单个标签
 * @param {function} onAddGroup 点击添加标签组
 * @param {function} onSearch 点击查询
 * @param {string} placeholder 输入框提示语
 * @param {} valueKey 
 * @param {boolean} valueIsItem 默认返回id
 * @param {string} filterPropName 筛选项属性名,默认为name
 * @param {function} onFilterOption 自定义筛选项
 * @param {boolean} itemIsValue 是否把item作为选中值
 * @returns 
 */

const defaultFilterFn = (searchText, tagList, filterPropName) => {
  return tagList.filter(ele => {
    // 如果标签组名称存在关键词
    const nameIsExist = ele[filterPropName].includes(searchText)
    if (nameIsExist) {
      return true
    }
    const tags = Array.isArray(ele.tags) ? ele.tags : []
    return tags.some(item => item[filterPropName].includes(searchText))
  })
}
const AddModal = (props) => {
  const { selectedKeys = [], disabledKeys = [], onChange, tagList = [], loading = false, itemIsValue, valueKey = 'id', runAddTag, onAddGroup, onSearch, filterPropName = 'name', onFilterOption, placeholder, header, footer, searchProps = {}, ...rest } = props
  const { openModal, closeModal, visibleMap, modalInfo, setConfirm } = useModalHook(['addTag'])
  const [searchText, setSearchText] = useState("")

  // 新增标签
  const onAddTag = (item) => {
    openModal('addTag', item)
  }

  // 点击查询
  const handleSearch = (e) => {
    const text = e.target.value
    if (typeof onSearch === 'function') {
      onSearch(text)
    } else {
      setSearchText(text)
    }
  }

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

  const onTagInputOk = (text) => {
    setConfirm()
    if (typeof runAddTag === 'function') {
      runAddTag(text, modalInfo.data)
    }
  }

  const handleValidInput = (text, data) => {
    const tags = Array.isArray(data.tags) ? data.tags : []
    const nameIsExist = tags.some(ele => ele[filterPropName] === text)
    if (nameIsExist) {
      return '标签名称已存在'
    }
  }

  const filterTagList = useMemo(() => {
    if (searchText) {
      if (typeof onFilterOption === 'function') {
        return onFilterOption(searchText, tagList, filterPropName) || []
      } else {
        return defaultFilterFn(searchText, tagList, filterPropName)
      }
    } else {
      return tagList
    }
  }, [searchText, filterPropName, tagList, onFilterOption])

  const onSearchChange = debounce(handleSearch, 200)
  return (
    <div {...rest}>
      {
        typeof header === 'undefined' ? (
          <div className={styles.inputWrap}>
            <Input
              placeholder={placeholder}
              onKeyPress={handleSearch}
              prefix={
                <SearchOutlined />
              }
              onChange={onSearchChange}
              {...searchProps}
            />
          </div>
        ) : header
      }
      <Spin spinning={loading}>
        <div className={styles.tagSelection}>
          {
            filterTagList.length > 0 ? (
              filterTagList.map(ele => {
                const tags = Array.isArray(ele.tags) ? ele.tags : []
                return (
                  <TagGroupItem
                    prefix={
                      typeof runAddTag === 'function' ? (
                        <AddTagBtn
                          onClick={() => {
                            onAddTag(ele)
                          }}
                          inputVisible={visibleMap.addTagVisible && modalInfo.data.id === ele.id}
                          onSave={onTagInputOk}
                          onCancel={closeModal}
                          validMsg={(text) => {
                            handleValidInput(text, ele)
                          }}
                        />
                      ) : null
                    }
                    disabledKeys={disabledKeys}
                    tags={tags}
                    groupName={ele.name}
                    selectedKeys={selectedKeys}
                    key={valueKey ? ele[valueKey] : ele}
                    valueKey={valueKey}
                    itemIsValue={itemIsValue}
                    onSelect={onSelectTag}
                  />
                )
              })
            ) : <Empty description={
              <div>
                <p>
                  {searchText ? '没有搜到相关标签哦~' : '当前没有标签组数据哦~'}
                </p>
                {
                  typeof onAddGroup === 'function' && !searchText ? <Button
                    onClick={onAddGroup}
                    size="small"
                    type="primary"
                    ghost
                    style={{ marginTop: 10 }}
                  >
                    <PlusOutlined />
                    新增标签组
                  </Button> : null
                }
              </div>
            } />
          }
        </div>
      </Spin>
      {
        typeof footer === 'undefined' ? <div className={styles.addTagBtnWrap}>
          <Button onClick={onAddGroup}
            size="small"
            type="primary"
            ghost
          >
            <PlusOutlined />
            新增标签组
          </Button>
        </div> : footer
      }
    </div >
  );
};


export default AddModal