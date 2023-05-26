import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { RadioGroup } from 'components/MyRadio'
import SearchBar from 'components/SearchBar'
import LazyTabPanle from 'components/LazyTabPanle'
import CustomerList from './CustomerList'
import GroupList from './GroupList'
import styles from './index.module.less'

const TAB_TYPES = {
  CUSTOMER: 'customer',
  GROUP: 'group',
}
const tabOptions = [
  {
    label: '客户',
    value: 'customer',
  },
  {
    label: '客户群',
    value: 'group',
  },
]
export default () => {
  const [searchText, setSearchText] = useState('')
  const [searchCount, setSearchCount] = useState(0)
  const [searchParams] = useSearchParams()
  const [tab, setTab] = useState(() => {
    const tabVal = searchParams.get('tab')
    return tabVal ? tabVal : 'customer'
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

  return (
    <div className={styles['page']}>
      <div className={styles['search-section']}>
        <SearchBar
          value={searchText}
          onChange={onSearchTextChange}
          onSearch={onSearch}
          onClear={onClearSearch}
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
          <LazyTabPanle activeKey={tab} tab={TAB_TYPES.CUSTOMER}>
            <CustomerList
              searchText={searchText}
              searchCount={searchCount}
              visible={tab === TAB_TYPES.CUSTOMER}
            />
          </LazyTabPanle>
          <LazyTabPanle activeKey={tab} tab={TAB_TYPES.GROUP}>
            <GroupList
              searchText={searchText}
              searchCount={searchCount}
              visible={tab === TAB_TYPES.GROUP}
            />
          </LazyTabPanle>
        </div>
      </div>
    </div>
  )
}
