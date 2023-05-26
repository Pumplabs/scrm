import { useState, useMemo, useRef, forwardRef } from 'react'
import { Empty,Spin, Divider} from 'antd'
import cls from 'classnames'
import InfiniteScroll from 'react-infinite-scroll-component';
import { merge, uniqueId } from 'lodash'
import { LeftItem, LeftCol, RightCol } from '../TransferCol'
import usePagedHook from '../PagedTransfer/usePagedHook'
import { modifyList, getListByPager } from '../PagedTransfer/utils'
import styles from './index.module.less'

/**
 * @param {Array<Object>} dataSource 数据源
 * @param {function} onChange
 * @param {Array<Object>} selectedKeys
 * @param {Object} fieldNames 自定义字段属性
 * @param {Boolean} itemIsValue 是否将整个选项作为值
 */

const defaultFieldNames = {
  title: 'name',
  value: 'id'
}

export default forwardRef((props, ref) => {
  const { dataSource = [], pagination = {}, request, onChange, loading, selectedKeys: defineKeys, fieldNames = {}, showSearch = true, contentProps, renderTooltipTitle, className, footer, renderLabel, ...rest } = props
  const itemFieldNames = useMemo(() => {
    return merge(defaultFieldNames, fieldNames)
  }, [fieldNames])
  const { title: titleKey, value: valueKey } = itemFieldNames
  const [selectedKeys, setSelectedKeys] = useState([])
  const domId = useRef(uniqueId('domId'))
  const isDefinedValue = typeof defineKeys !== 'undefined'
  const selfSelectedKeys = isDefinedValue ? defineKeys : selectedKeys
  const { dataSource: leftList, pagination: leftPager, onChange: onLeftPagerChange, onSearch, searchText } = usePagedHook({
    dataSource,
    pagination,
    titleKey,
    request,
    needAccum: true
  })

  const handleChange = (item, checked) => {
    const nextKeys = modifyList(selfSelectedKeys, item, checked, valueKey, true)
    if (typeof onChange === 'function') {
      onChange(nextKeys)
    }
    if (!isDefinedValue) {
      setSelectedKeys(nextKeys)
    }
  }

  const onReset = () => {
    setSelectedKeys([])
    if (typeof onChange === 'function') {
      onChange([])
    }
  }

  const loadMoreData = () => {
    onLeftPagerChange(leftPager.current + 1, leftPager.pageSize)
  }

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
      return searchText ? '没有查询到相关数据哦~' : '目前没有数据哦~'
    } else {
      return ''
    }
  }, [dataSource, loading, searchText])

  return (
    <div style={{ width: "100%" }} ref={ref}>
      <div
        className={cls({
          [styles.transferContainer]: true,
          [className]: className,
          'ant-transfer': true
        })}
        {...rest}
      >
        <LeftCol
          selectedKeys={selfSelectedKeys}
          dataSource={leftList}
          fieldNames={itemFieldNames}
          showSearch={showSearch}
          onSearch={onSearch}
          title={`${selfSelectedKeys.length}/${leftPager.total}项`}
          contentProps={{
            id: domId.current,
            className: styles.leftColContent,
            ...contentProps,
          }}
          renderTooltipTitle={renderTooltipTitle}
        >
         <InfiniteScroll
            dataLength={pagination.total}
            next={loadMoreData}
            hasMore={hasMore}
            hasChildren={true}
            loader={loading ? <Spin spinning={true}></Spin>: null}
            endMessage={noResult ? null : <div><Divider style={{margin: "0"}}>已经到底咯</Divider></div>}
            scrollableTarget={domId.current}
            style={{overflow: "hidden"}}
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
                leftList.map((ele) => {
                  const isChecked = selfSelectedKeys.some(item => item[valueKey] === ele[valueKey])
                  return (
                    <LeftItem
                      ele={ele}
                      key={ele[valueKey]}
                      valueKey={valueKey}
                      titleKey={titleKey}
                      onChange={handleChange}
                      checked={isChecked}
                      renderTooltipTitle={renderTooltipTitle}
                      renderLabel={(...args) => {
                        if (typeof renderLabel === 'function') {
                          return renderLabel('left', ...args)
                        }
                      }}
                    />
                  )
                })
              )
            }
          </InfiniteScroll>
        </LeftCol>
        <RightCol
          total={selfSelectedKeys.length}
          fieldNames={itemFieldNames}
          onReset={onReset}
          onChange={handleChange}
          dataSource={selfSelectedKeys}
          contentProps={contentProps}
          renderLabel={renderLabel}
          renderTooltipTitle={renderTooltipTitle}
        />
      </div>
    </div>
  )
}
)