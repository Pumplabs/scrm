import React, { useMemo } from 'react'
import cls from 'classnames'
import { InfiniteScroll, List, DotLoading, Empty } from 'antd-mobile'
import styles from './index.module.less'

export default (props) => {
  const {
    dataSource = [],
    pagination = {},
    searchParams,
    loading = false,
    children,
    wrapClassName,
    listItemClassName,
    listClassName,
    listStyle = {},
    loadNext,
    rowKey = 'id',
    renderItem,
    bordered = true
  } = props

  const hasMore = useMemo(() => {
    const { pageSize, current, total } = pagination
    return total > 0 && pageSize * current < total
  }, [pagination])

  const loadMoreData = async () => {
    const { pageSize, current } = pagination
    const [pager = { current: 1, pageSize: 10 }, formVals] = searchParams || []
    await loadNext(
      {
        current: current + 1,
        pageSize: pageSize,
      },
      formVals
    )
  }

  const getRowKey = (record) => {
    if (typeof rowKey === 'function') {
      return rowKey(record)
    } else {
      return record[rowKey]
    }
  }
  
  const nodeBorderStyle = {
    '--border-bottom': '0 none',
    '--border-inner': 'none'
  }
  return (
    <>
      {dataSource.length > 0 ? (
        <>
          <div className={wrapClassName}>
            {children ? (
              children
            ) : (
              <List
                className={cls({
                  [styles['list']]: true,
                  [listClassName]: listClassName,
                })}
                style={bordered ? listStyle : {
                  ...nodeBorderStyle,
                  ...listStyle
                }}
                >
                {dataSource.map((item, index) => {
                  const itemKey = getRowKey(item, index)
                  return (
                    <List.Item
                      key={itemKey}
                      className={cls({
                        [styles['list-item']]: true,
                        [listItemClassName]: listItemClassName,
                      })}>
                      {typeof renderItem === 'function'
                        ? renderItem(item, index)
                        : null}
                    </List.Item>
                  )
                })}
              </List>
            )}
          </div>
          <InfiniteScroll loadMore={loadMoreData} hasMore={hasMore} />
        </>
      ) : (
        <>
          {loading ? (
            <div className={styles.placeholder}>
              <div className={styles.loadingWrapper}>
                <DotLoading />
              </div>
              正在拼命加载数据
            </div>
          ) : (
            <Empty description="暂时没有数据哦" />
          )}
        </>
      )}
    </>
  )
}
