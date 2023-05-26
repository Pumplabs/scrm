import { useMemo, useState } from 'react'
import { getListByPager } from './utils'

export default (props) => {
  const { dataSource = [], pagination, request, titleKey } = props
  const [pager, setPager] = useState({ current: 1, pageSize: 1 })
  const [searchText, setSearchText] = useState('')
  const isDefinedPagination = typeof request === 'function'
  // 全部数据
  const allList = useMemo(() => {
    if (isDefinedPagination) {
      return []
    } else {
      return dataSource.filter(ele => ele[titleKey].includes(searchText))
    }
  }, [isDefinedPagination, dataSource, titleKey, searchText])

  const curPager = useMemo(() => {
    return isDefinedPagination ? pagination : {...pager, total: allList.length}
  }, [pager, isDefinedPagination, pagination, allList.length])

  const curList = useMemo(() => {
    const list = isDefinedPagination ? dataSource : getListByPager(curPager, allList)
   return list
  }, [isDefinedPagination, dataSource, allList, curPager])


  const fetchData = (pager, keyword = searchText) => {
    if (isDefinedPagination) {
      console.log('isDefinedPagination', isDefinedPagination)
      request(pager, {keyword})
    } else {
      setPager(pager)
    }
  }

  const onChange = (current, pageSize) => {
    fetchData({ current, pageSize })
  }

  // 处理查询
  const handleSearch = (e) => {
    const text = e.target.value
    setSearchText()
    fetchData({
      ...curPager,
      current: 1
    }, text)
  }

  return {
    onChange,
    pagination: curPager,
    dataSource: curList,
    onSearch: handleSearch,
    searchText
  }
}