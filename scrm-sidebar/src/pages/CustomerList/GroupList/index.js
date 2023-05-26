import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import InfiniteList from 'components/InfiniteList'
import ListItem from './ListItem'
import useInfiniteHook from 'src/hooks/useInfiniteHook'
import { GetGroupList } from 'src/services/modules/group'
import styles from './index.module.less'

export default forwardRef((props, ref) => {
  const { searchText, searchCount, visible } = props
  const curSearchCountRef = useRef()
  const navigate = useNavigate()
  const {
    tableProps,
    params: fetchParams,
    runAsync: runList,
  } = useInfiniteHook({
    manual: true,
    request: GetGroupList,
    rigidParams: {
      isPermission: true,
    },
  })

  useEffect(() => {
    const curCount = curSearchCountRef.current
    if (visible && curCount !== searchCount) {
      searchByText(searchText)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, searchCount])

  useImperativeHandle(ref, () => ({
    searchByText,
  }))

  const searchByText = (text = '') => {
    curSearchCountRef.current = searchCount
    runList(
      {},
      {
        name: text,
      }
    )
  }

  const onSelectedItem = (item) => {
    navigate(`/groupDetail?extGroupId=${item.extChatId}`)
  }

  return (
    <div ref={ref}>
      <InfiniteList
        searchParams={fetchParams}
        loadNext={runList}
        rowKey={(record) => `${record.id}_${record.extCreatorId}`}
        listItemClassName={styles['ul-list-item']}
        bordered={false}
        renderItem={(item) => (
          <ListItem onSelect={onSelectedItem} data={item} />
        )}
        {...tableProps}
      />
    </div>
  )
})
