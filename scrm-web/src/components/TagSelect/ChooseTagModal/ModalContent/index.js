import React, { useState, useMemo, useRef } from 'react';
import { Input, Spin, Divider, Empty, Button } from 'antd';
import { debounce, uniqueId } from 'lodash'
import { SearchOutlined } from '@ant-design/icons'
import InfiniteScroll from 'react-infinite-scroll-component';
import GroupContainer from '../GroupContainer'
import styles from './index.module.less';

/**
 * 选择标签弹窗
 * @param {array<string>} selectedKeys 选中的标签
 * @param {array<object>} tagList 标签源数据
 * @param {function} onSearch 点击查询
 * @param {string} placeholder 输入框提示语
 * @param {} valueKey 
 * @param {boolean} valueIsItem 默认返回id
 * @param {string} filterPropName 筛选项属性名,默认为name
 * @param {function} onFilterOption 自定义筛选项
 * @param {boolean} itemIsValue 是否把item作为选中值
 * @returns 
 */

const ModalContent = (props) => {
  const {
    pagination = {},
    loadMoreData,
    dataSource,
    header,
    footer,
    onSearch,
    placeholder,
    loading = false,
    searchProps = {},
    scrollWrapStyle = {},
    wrapStyle,
    ...rest
  } = props
  const searchText = searchProps.value || ''
  const domId = useRef(uniqueId('scroll_'))
  // 点击查询
  const handleSearch = (e) => {
    const text = e.target.value
    if (typeof onSearch === 'function') {
      onSearch(text)
    }
  }

  const onSearchChange = debounce(handleSearch, 200)

  const noResult = useMemo(() => {
    return dataSource.length === 0 && !loading
  }, [dataSource, loading])

  const hasMore = useMemo(() => {
    const { pageSize, current, total } = pagination
    return total > 0 && pageSize * current < total
  }, [pagination])

  const emptyText = useMemo(() => {
    const isNoResult = dataSource.length === 0 && !loading
    if (isNoResult && searchText) {
      return searchText ? '没有查询到相关数据哦~' : '目前没有创建标签哦~'
    } else {
      return ''
    }
  }, [dataSource, loading, searchText])

  return (
    <div style={wrapStyle}>
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
      <div
        id={domId.current}
        style={{ ...scrollWrapStyle, overflow: "auto" }}
      >
        <InfiniteScroll
          dataLength={pagination.total}
          next={loadMoreData}
          hasMore={hasMore}
          hasChildren={true}
          loader={loading ? <Spin spinning={true}></Spin> : null}
          endMessage={noResult ? null : <Divider plain>已经到底咯</Divider>}
          scrollableTarget={domId.current}
        >
          {
            noResult ? (
              <Empty
                description={
                  <div>
                    <p style={{ marginBottom: 4 }}>{emptyText}</p>
                  </div>
                }
              />
            ) : (
              <GroupContainer
                dataSource={dataSource}
                hasSearchText={searchText.length > 0}
                {...rest}
              />
            )
          }
        </InfiniteScroll>
      </div>
      {footer}
    </div >
  );
};


export default ModalContent