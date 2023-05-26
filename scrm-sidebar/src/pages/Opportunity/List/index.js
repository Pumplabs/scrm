import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBack } from 'src/hooks'
import { encode } from 'js-base64'
import { AddCircleOutline } from 'antd-mobile-icons'
// import { useSearchParams } from 'react-router-dom'
import PageContent from 'components/PageContent'
import SearchBar from 'components/SearchBar'
import InfiniteList from 'components/InfiniteList'
import OppItem from './components/OppItem'
import useInfiniteHook from 'src/hooks/useInfiniteHook'
import { GetOpportunityList } from 'services/modules/opportunity'
import styles from './index.module.less'

export default () => {
  const [searchText, setSearchText] = useState('')
  const [searchCount, setSearchCount] = useState(0)
  const navigate = useNavigate()
  const {
    tableProps,
    params: fetchParams,
    runAsync: runList,
  } = useInfiniteHook({
    request: GetOpportunityList,
    // manual: true,
    rigidParams: {
      status: 0,
      // isPermission: true,
    },
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

  const onOppDetail = (item) => {
    navigate(`/opportunity/${encode(item.id)}`)
  }

  const onAdd = () => {
    navigate('/addOpp')
  }

  useEffect(() => {
    if (searchCount) {
      runList(
        {},
        {
          name: searchText,
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchCount])

  return (
    <PageContent footer={<Footer onClick={onAdd} />}>
      <div className={styles['page']}>
        <div className={styles['search-section']}>
          <SearchBar
            value={searchText}
            onChange={onSearchTextChange}
            onSearch={onSearch}
            onClear={onClearSearch}
          />
        </div>
        <div className={styles['page-stat']}>
          共
          <span className={styles['page-num']}>
            {tableProps.pagination.total}
          </span>
          个商机
        </div>
        <div className={styles['page-body']}>
          <InfiniteList
            searchParams={fetchParams}
            loadNext={runList}
            rowKey={(record) => `${record.id}_${record.extCreatorId}`}
            listItemClassName={styles['ul-list-item']}
            bordered={false}
            renderItem={(item) => (
              <OppItem data={item} onDetail={onOppDetail} />
            )}
            {...tableProps}
          />
        </div>
      </div>
    </PageContent>
  )
}

const Footer = ({ onClick }) => {
  return (
    <div className={styles['page-footer']}>
      <AddCircleOutline className={styles['add-icon-btn']} onClick={onClick} />
    </div>
  )
}

