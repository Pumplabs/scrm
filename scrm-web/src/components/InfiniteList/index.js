import { useMemo, useRef, forwardRef, useImperativeHandle } from 'react'
import cls from 'classnames'
import { uniqueId } from 'lodash'
import { Spin, Empty, Divider } from 'antd'
import InfiniteScroll from 'react-infinite-scroll-component'
import styles from './index.module.less'

/**无限下拉列表
 * @param {Boolean} loading
 * @param {Array} dataSource
 * @param {Array} searchParams
 * @param {Function(pager,formParams)} loadNext
 * @param {Object} pagination
 * @param {Function} renderItem
 * @param {ReactNode} empty 空节点
 * @param {String} domId
 */
export default forwardRef((props, ref) => {
  const {
    children,
    loading = false,
    dataSource = [],
    listItemStyle,
    searchParams,
    wrapClassName,
    loadNext,
    pagination = {},
    renderItem,
    domId,
    empty,
    style,
    ...rest
  } = props
  const wrapId = useRef(domId || uniqueId('domId_'))
  const listRef = useRef(null)

  // 置顶
  const toTop = () => {
    if (listRef.current) {
      listRef.current.scrollTo(0, 0)
    }
  }

  useImperativeHandle(ref, () => ({
    toTop
  }))
  const noResult = useMemo(() => {
    return dataSource.length === 0 && !loading
  }, [dataSource.length, loading])

  const hasMore = useMemo(() => {
    const { pageSize, current, total } = pagination
    return total > 0 && pageSize * current < total
  }, [pagination])

  const ListEmpty = useMemo(() => {
    if (empty) {
      return empty
    } else {
      return <DefaultEmpty />
    }
  }, [empty])

  const loadMoreData = () => {
    const [, formVals] = searchParams || []
    if (hasMore) {
      loadNext(
        {
          current: pagination.current + 1,
          pageSize: pagination.pageSize,
        },
        formVals
      )
    }
  }

  return (
    <div ref={ref}>
      <Spin spinning={loading}>
        <div
          ref={listRef}
          id={wrapId.current}
          className={cls({
            [styles['infinite-list']]: true,
            [wrapClassName]: true,
          })}
          {...rest}
        >
          <InfiniteScroll
            dataLength={dataSource.length}
            next={loadMoreData}
            hasMore={hasMore}
            loader={<Spin spinning={loading}></Spin>}
            endMessage={noResult ? null : <Divider plain>没有更多啦</Divider>}
            scrollableTarget={wrapId.current}>
            {noResult
              ? ListEmpty
              : typeof children === 'undefined'
              ? dataSource.map((ele, idx) => {
                  return (
                    <div
                      key={ele.id}
                      className={cls({
                        [styles['list-item']]: true,
                      })}
                      style={listItemStyle}>
                      {typeof renderItem === 'function'
                        ? renderItem(ele, idx)
                        : null}
                    </div>
                  )
                })
              : children}
          </InfiniteScroll>
        </div>
      </Spin>
    </div>
  )
})

const DefaultEmpty = ({ length, loading, searchParams }) => {
  const emptyText = useMemo(() => {
    const isNoResult = length === 0 && !loading
    if (isNoResult && searchParams) {
      return '没有查询到相关数据哦~'
    } else {
      return ''
    }
  }, [length, loading, searchParams])

  return (
    <Empty
      description={
        <div>
          <p style={{ marginBottom: 4 }}>{emptyText}</p>
        </div>
      }
    />
  )
}
