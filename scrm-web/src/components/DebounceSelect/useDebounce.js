import React, { useEffect, useMemo } from 'react'
import { useAntdTable } from 'ahooks'
import { debounce } from 'lodash';

/**
 * 
 * @param {*} param
 * @returns 
 * 说明
 * 1. 默认进入时，搜索空字段
 * 2. 当有输入时，从第一页开始
 * 3. 当滚动时，翻页查询
 */
/**
 * 
 * @param {*} config 
 * @returns 
 */
const useDebounce = (config = {}) => {
  const { debounceTimeout = 200, request } = config
  const [fetching, setFetching] = React.useState(false);
  const [optionList, setOptionList] = React.useState([]);

  const { run: runGetUser, tableProps: { pagination }, params: searchParams, loading: getUerLoading, cancel: cacelGetUser, mutate } = useAntdTable(request, {
    manual: true,
    onFinally: ([{ current }], resData) => {
      setFetching(false)
      if (current > 1) {
        setOptionList(arr => [...arr, ...resData.list])
      } else {
        setOptionList(resData.list)
      }
    }
  })

  const hasMore = useMemo(() => {
    const { total, pageSize, current } = pagination
    return total > 0 && pageSize * current < total
  }, [pagination])

  const onPopupScroll = () => {
    if (hasMore && !getUerLoading) {
      const [pager, { name }] = searchParams
      runGetUser({
        ...pager,
        current: pager.current + 1
      }, {
        name
      })
    }
  }

  useEffect(() => {
    getOptions()
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [])

  const getOptions = (searchText = '') => {
    if (getUerLoading) {
      cacelGetUser()
    }
    mutate({
      list: [],
      total: 0
    })
    runGetUser({
      current: 1,
      pageSize: 10
    }, {
      name: searchText
    })
  }

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value) => {
      setOptionList([]);
      setFetching(true);
      getOptions(value)
    };
    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout]);
  return {
    onSearch: debounceFetcher,
    onPopupScroll,
    optionList,
    fetching
  }
}
export default useDebounce