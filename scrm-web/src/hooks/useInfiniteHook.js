import { useRef } from 'react'
import { useAntdTable } from 'ahooks'

const getNewList = async (handleList, dataSource) => {
  let newList = []
  if (typeof handleList === 'function') {
    let res = []
    try {
      res = await handleList(dataSource)
    } catch (e) {
      res = handleList(dataSource)
    }
    newList = Array.isArray(res) ? res : dataSource
  } else {
    newList = dataSource
  }
  return newList
}

// 更新列表
const refreshList = async ({
  dataSource,
  pagination,
  preList,
  mutateFn,
  handleList,
}) => {
  const newList = await getNewList(handleList, dataSource)

  mutateFn({
    list: [...preList, ...newList],
    total: pagination.total,
  })
}

/**
 * @param {String} 文件类型, 同MATERIAL_TYPE_EN_VALS的key值
 * @param {Function} handleList 处理列表数据
 * @param {Boolean} manual 是否自动请求
 * @param {Object} rigidParams 固定参数
 * @param {Function} request 默认请求方法
 * @param {Function} onDone 已经更新完数据
 * @returns
 * @param {Object} tableProps
 * @param {Boolean} loading
 * @param {Function} run
 *
 */
export default (options) => {
  const {
    handleList,
    manual,
    rigidParams,
    request,
    defaultPageSize = 20,
    onDoneUpdate,
    onBefore,
    ...rest
  } = options
  const preList = useRef([])
  const lastPager = useRef({})
  const {
    loading,
    tableProps,
    run: runGetList,
    params,
    mutate,
    refresh,
    ...otherHook
  } = useAntdTable(
    async (pager, vals = {}, ...args) => {
      lastPager.current = { ...tableProps.pagination }
      preList.current = [...tableProps.dataSource]
      return await request(pager, { ...vals, ...rigidParams }, ...args)
    },
    {
      manual,
      pageSize: defaultPageSize,
      ...rest,
      onBefore: (nextParams) => {
        preList.current = tableProps.dataSource
        if (typeof onBefore === 'function') {
          onBefore(nextParams)
        }
      },
      onFinally: ([pager = { current: 1 }], res) => {
        const { current: pageNo = 1, pageSize = defaultPageSize } = pager
        if (pageNo === 1) {
          preList.current = []
        }
        if (res) {
          refreshList({
            dataSource: res.list,
            pagination: {
              current: pageNo,
              pageSize: pageSize,
              total: res.total,
            },
            lastPager: lastPager.current,
            preList: preList.current,
            mutateFn: mutate,
            handleList,
          })
          if (typeof onDoneUpdate === 'function') {
            onDoneUpdate([pager])
          }
        }
      },
    }
  )

  const refreshByIdx = (idx = 0) => {
    const [pager, ...formVals] = params
    const nextCurrent = Math.ceil((idx + 1) / pager.pageSize)
    runGetList(
      {
        ...pager,
        current: nextCurrent,
      },
      ...formVals
    )
  }

  const toFirst = () => {
    const [pager, ...formVals] = params
    runGetList({
      ...pager,
      current: 1
    }, ...formVals)
  }

  return {
    tableProps,
    params,
    loading,
    refresh,
    run: runGetList,
    toFirst,
    refreshByIdx,
    ...otherHook,
  }
}
