import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PageContent from 'components/PageContent'
import InfiniteList from 'components/InfiniteList'
import SearchBar from 'components/SearchBar'
import ProductItem from './components/ProductItem'
import { GetProductList } from 'services/modules/product'
import { encode } from 'js-base64'
import { useInfiniteHook, useBack } from 'src/hooks'
import styles from './index.module.less'

export default () => {
  const navigate = useNavigate()
  const [inputText, setInputText] = useState('')
  const {
    tableProps,
    params: searchParams,
    runAsync: runList,
  } = useInfiniteHook({
    request: GetProductList,
    // handleList,
    rigidParams: {
      status: 2,
    },
  })

  useBack({
    backUrl: '/home',
  })

  const onTextChange = (e) => {
    setInputText(e.target.value)
  }

  const onSearch = () => {
    runList(
      {},
      {
        name: inputText,
      }
    )
  }

  const onDetail = (item) => {
    navigate(`/productDetail/${encode(item.id)}`)
  }

  return (
    <PageContent>
      <div className={styles['product-page']}>
        <div className={styles['search-bar']}>
          <SearchBar
            value={inputText}
            onChange={onTextChange}
            onSearch={onSearch}
          />
        </div>
        <div className={styles['product-page-body']}>
          <div className={styles['product-stat']}>
            共
            <span className={styles['product-total-count']}>
              {tableProps.pagination.total}
            </span>
            个产品
          </div>
          <div className={styles['infinite-list-wrap']}>
            <InfiniteList
              loadNext={runList}
              {...tableProps}
              searchParams={searchParams}
              listItemClassName={styles['product-list-item']}
              bordered={false}
              renderItem={(item) => (
                <ProductItem data={item} key={item.id} onDetail={onDetail} />
              )}></InfiniteList>
          </div>
        </div>
      </div>
    </PageContent>
  )
}
