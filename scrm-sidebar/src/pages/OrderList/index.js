import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { AddCircleOutline } from 'antd-mobile-icons'
import { RadioGroup } from 'components/MyRadio'
import SearchBar from 'components/SearchBar'
import LazyTabPanle from 'components/LazyTabPanle'
import PageContent from 'components/PageContent'
import { useBack } from 'src/hooks'
import TabPaneList from './TabPaneList'
import styles from './index.module.less'

const TAB_TYPES = {
  ALL: 'all',
  DONE: 3,
}
const tabOptions = [
  {
    label: '全部',
    value: TAB_TYPES.ALL,
  },
  {
    label: '已完成',
    value: TAB_TYPES.DONE,
  },
]
export default () => {
  const [searchText, setSearchText] = useState('')
  const [searchCount, setSearchCount] = useState(0)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [tab, setTab] = useState(() => {
    const tabVal = searchParams.get('tab')
    return tabVal ? tabVal : TAB_TYPES.ALL
  })
  useBack({
    backUrl: '/home',
  })

  const onSearchTextChange = (e) => {
    setSearchText(e.target.value)
  }

  const onSearch = () => {
    setSearchCount((v) => v + 1)
  }

  const onClearSearch = () => {
    setSearchCount((v) => v + 1)
  }

  const onTabChange = (tab) => {
    setTab(tab)
  }

  const onAdd = () => {
    navigate('/addOrder')
  }

  return (
    <PageContent footer={<Footer onClick={onAdd} />}>
      <div className={styles['page']}>
        <div className={styles['search-section']}>
          <SearchBar
            value={searchText}
            onChange={onSearchTextChange}
            onSearch={onSearch}
            onClear={onClearSearch}
            placeholder="请输入"
          />
        </div>
        <div className={styles['page-body']}>
          <div className={styles['tabs-info']}>
            <RadioGroup
              className={styles['radio-tabs']}
              options={tabOptions}
              activeKey={tab}
              onChange={onTabChange}
            />
          </div>
          <div className={styles['selected-ul-wrap']}>
            <LazyTabPanle activeKey={tab} tab={TAB_TYPES.ALL}>
              <TabPaneList
                searchText={searchText}
                searchCount={searchCount}
                visible={tab === TAB_TYPES.ALL}
              />
            </LazyTabPanle>
            <LazyTabPanle activeKey={tab} tab={TAB_TYPES.DONE}>
              <TabPaneList
                searchText={searchText}
                searchCount={searchCount}
                status={TAB_TYPES.DONE}
                visible={tab === TAB_TYPES.DONE}
              />
            </LazyTabPanle>
          </div>
        </div>
      </div>
    </PageContent>
  )
}

const Footer = ({ onClick }) => {
  return (
    <div className={styles['icon-wrap']}>
      <AddCircleOutline className={styles['add-icon-btn']} onClick={onClick} />
    </div>
  )
}
