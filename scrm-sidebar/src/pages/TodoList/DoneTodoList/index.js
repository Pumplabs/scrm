import { useEffect } from 'react'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import InfiniteList from 'src/components/InfiniteList'
import PageContent from 'components/PageContent'
import TodoListItem from '../components/TodoListItem'
import { useInfiniteHook } from 'src/hooks'
import { createUrlSearchParams } from 'src/utils'
import { GetTodoList } from 'src/services/modules/todo'
import { TODO_STAUTS, TODO_TYPE } from '../constants'
import styles from './index.module.less'

export default () => {
  const navigate = useNavigate()
  const {
    tableProps,
    loading,
    params: searchParams,
    runAsync: runList,
  } = useInfiniteHook({
    request: GetTodoList,
    rigidParams: {
      status: TODO_STAUTS.DONE,
    },
  })
  const total = tableProps.pagination.total

  useEffect(() => {
    document.title = `已完成(${total})`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total])

  useEffect(() => {
    if (typeof window.wx.onHistoryBack === 'function') {
      window.wx.onHistoryBack(function () {
        onBack()
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onBack = () => {
    navigate(`/todoList`)
  }

  const onDetail = (item) => {
    let url = ''
    const searchText = createUrlSearchParams({
      ruleId: item.businessId,
      executeAt: item.createTime
        ? Math.floor(moment(item.createTime).valueOf() / 1000)
        : 0,
      jobId: item.businessId1,
    })
    if (item.type === TODO_TYPE.CUSTOMER_SOP) {
      url = `/customerSopRemind?${searchText}`
    } else if (item.type === TODO_TYPE.GROUP_SOP) {
      url = `/groupSopRemind?${searchText}`
    }
    if (url) {
      navigate(url)
    }
  }

  return (
    <PageContent>
      <div className={styles['todo-page']}>
        <InfiniteList
          loading={loading}
          loadNext={runList}
          {...tableProps}
          searchParams={searchParams}
          wrapStyle={{
            maxHeight: `calc(100vh - 60px)`,
            // maxHeight: "100vh"
          }}
          listItemClassName={styles['todo-list-item']}
          renderItem={(item) => (
            <TodoListItem data={item} key={item.id} onDetail={onDetail} />
          )}></InfiniteList>
      </div>
    </PageContent>
  )
}
