import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import moment from 'moment'
import { NavBar } from 'antd-mobile'
import InfiniteList from 'src/components/InfiniteList'
import PageContent from 'components/PageContent'
import LazyTabPanle from 'components/LazyTabPanle'
import Radio from './Radio'
import TodoListItem from './components/TodoListItem'
import { useInfiniteHook, useBack } from 'src/hooks'
import { createUrlSearchParams } from 'src/utils'
import { GetTodoList } from 'src/services/modules/todo'
import { TODO_STAUTS, TODO_TYPE } from './constants'
import styles from './index.module.less'

const TABS = [
  {
    label: '未完成',
    value: 'undone',
    status: TODO_STAUTS.UN_DONE,
  },
  {
    label: '已完成',
    value: 'done',
    status: TODO_STAUTS.DONE,
  },
  {
    label: '已逾期',
    value: 'overdue',
    status: TODO_STAUTS.OVERDUE,
  },
]
const TabPaneContent = ({ status }) => {
  const navigate = useNavigate()
  const {
    tableProps,
    loading,
    params: searchParams,
    runAsync: runList,
  } = useInfiniteHook({
    request: GetTodoList,
    rigidParams: {
      status: status,
    },
  })
  return (
    <InfiniteList
      loading={loading}
      loadNext={runList}
      {...tableProps}
      searchParams={searchParams}
      renderItem={(item) => (
        <TodoListItem
          data={item}
          key={item.id}
          status={status}
        />
      )}></InfiniteList>
  )
}

export default () => {
  const [activeTab, setActiveTab] = useState('undone')
  const navigate = useNavigate()
  useBack({
    backUrl: '/home'
  })

  const onTabChange = (key) => {
    setActiveTab(key)
  }
  return (
    <PageContent
      className={styles['todo-page-wrap']}
      >
      <div className={styles['todo-page']}>
        <div className={styles['todo-radio']}>
          <Radio
            options={TABS}
            onChange={onTabChange}
            value={activeTab}
            className={styles['type-radio']}
          />
        </div>
        <div className={styles['todo-page-body']}>
          {TABS.map((item) => {
            return (
              <LazyTabPanle
                tab={item.value}
                activeKey={activeTab}
                key={item.value}
              >
                <div key={item.value} className={styles['list-content']}>
                  <TabPaneContent tab={item.value} status={item.status} />
                </div>
              </LazyTabPanle>
            )
          })}
        </div>
      </div>
    </PageContent>
  )
}
