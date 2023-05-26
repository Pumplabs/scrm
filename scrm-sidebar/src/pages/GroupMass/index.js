import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { encode } from 'js-base64'
import { get } from 'lodash'
import { AddCircleOutline } from 'antd-mobile-icons'
import PageContent from 'components/PageContent'
import InfiniteList from 'components/InfiniteList'
import SearchBar from 'components/SearchBar'
import { MassItem } from '../CustomerMass/MassItem'
import { useBack } from 'src/hooks'
import useInfiniteHook from 'src/hooks/useInfiniteHook'
import { GetMassList } from 'src/services/modules/groupMass'
import { SEND_STATUS_VAL} from './contants'
import styles from './index.module.less'
const MassListItem = ({ data = {}, onDetail}) => {
  const { noSendStaffCount = 0, sendStaffCount = 0 } = data
  const total = noSendStaffCount + sendStaffCount
  return (
    <MassItem
      data={data}
      onDetail={onDetail}
      statusVals={SEND_STATUS_VAL}
      createName={get(data, 'creatorInfo.name')}
      statCounts={{
        done: sendStaffCount,
        notDone: noSendStaffCount,
        total: total,
      }}
    />
  )
}
export default () => {
  const navigate = useNavigate()
  const [searchText, setSearchText] = useState('')
  const {
    tableProps,
    params: fetchParams,
    runAsync: runList,
  } = useInfiniteHook({
    request: GetMassList,
  })
  useBack({
    backUrl: `/home`
  })

  const onSearchTextChange = (e) => {
    setSearchText(e.target.value)
  }

  const onAdd = () => {
    navigate('/addGroupMass')
  }

  const onSearch = () => {
    runList(
      {},
      {
        name: searchText,
      }
    )
  }

  const onClearSearch = () => {
    runList(
      {},
      {
        name: '',
      }
    )
  }

  const onDetailItem = (item) => {
    navigate(`/groupMassDetail/${encode(item.id)}`)
  }
  return (
    <PageContent footer={<Footer onClick={onAdd} />}>
      <div className={styles['mass-page']}>
        <div className={styles['mass-search']}>
          <SearchBar
            className={styles['search-bar']}
            value={searchText}
            onChange={onSearchTextChange}
            onSearch={onSearch}
            onClear={onClearSearch}
          />
        </div>
        <div>
          <InfiniteList
            searchParams={fetchParams}
            loadNext={runList}
            rowKey={(record) => `${record.id}_${record.extCreatorId}`}
            listItemClassName={styles['customer-list-item']}
            renderItem={(item) => {
              return (
                <MassListItem data={item} key={item.id} onDetail={onDetailItem} />
              )
            }}
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
