import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { get } from 'lodash'
import InfiniteList from 'components/InfiniteList'
import CustomerListItem from './CustomerListItem'
import useInfiniteHook from 'src/hooks/useInfiniteHook'
import { GetAssistCustomers } from 'src/services/modules/customer'
import styles from './index.module.less'

export default forwardRef((props, ref) => {
    const { searchText, searchCount, visible } = props
    const navigate = useNavigate()
    const curSearchCountRef = useRef()
    const {
      tableProps,
      params: fetchParams,
      runAsync: runList,
    } = useInfiniteHook({
      request: GetAssistCustomers,
      manual: true,
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
      searchByText
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
      navigate(`/customerDetail?extCustomerId=${item.extId}&staffId=${get(item, 'creatorStaff.id')}`)
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
            <CustomerListItem onSelect={onSelectedItem} data={item} />
          )}
          {...tableProps}
        />
      </div>
    )
  })