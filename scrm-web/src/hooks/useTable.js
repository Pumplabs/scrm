import { useAntdTable } from 'ahooks'
import useTableRowSelect from './useTableRowSelect'

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
  mutateFn,
  handleList,
}) => {
  const newList = await getNewList(handleList, dataSource)
  mutateFn({
    list: newList,
    total: pagination.total,
  })
}

/**
 * @param {Object} fixedParams 固定参数
 * @param {Boolean} selected 是否可勾选
 * @param {Function} onError 当请求异常时
 * @param {Function} onFinally 当请求完成时
 */
export default (request, options = {}) => {
  const { selectedProps, selectedRows, clearSelected, selectedKeys } =
    useTableRowSelect()
  const {
    fixedParams = {},
    selected,
    onError,
    onFinally,
    handleList,
    ...requestOptions
  } = options
  const { mutate, tableProps, ...exportData } = useAntdTable(
    (pager, vals = {}, ...args) => {
      return request(
        pager,
        {
          ...vals,
          ...fixedParams,
        },
        ...args
      )
    },
    {
      ...requestOptions,
      onFinally: ([pager = { current: 1 }], res) => {
        if (selected) {
          clearSelected()
        }
        refreshList({
          dataSource: res.list,
          pagination: {
            current: pager.current,
            pageSize: pager.pageSize,
            total: res.total,
          },
          mutateFn: mutate,
          handleList,
        })
        if (typeof onFinally === 'function') {
          onFinally()
        }
      },
      onError: () => {
        mutate({
          list: [],
          total: 0,
        })
        if (typeof onError === 'function') {
          onError()
        }
      },
    }
  )

  const toFirst = () => {
    const [pager = {}, ...args] = exportData.params
    exportData.run(
      {
        ...pager,
        current: 1,
      },
      ...args
    )
  }

  return {
    ...exportData,
    selectedRows,
    selectedKeys,
    tableProps: {
      ...tableProps,
      ...(selected ? selectedProps : {}),
    },
    toFirst,
    mutate,
  }
}
