import { useRef } from 'react'
import { useAntdTable } from 'ahooks'

const refreshList = async ({
  dataSource,
  total,
  preList,
  mutateFn,
  handleList,
}) => {
  let newList = []
  if (typeof handleList === 'function') {
    let res = []
    try {
      res = await handleList(dataSource)
    } catch(e) {
      res =  handleList(dataSource)
    }
    newList = Array.isArray(res) ? res : dataSource
  } else {
    newList = dataSource
  }
  mutateFn({
    list: [...preList, ...newList],
    total,
  })
}

/**
 * @param {String} 文件类型, 同MATERIAL_TYPE_EN_VALS的key值
 * @param {Boolean} handleList 处理列表数据
 * @param {Boolean} manual 是否自动请求
 * @param {Object} rigidParams 固定参数
 * @param {Function} request 默认请求方法
 * @returns
 * @param {Object} tableProps
 * @param {Boolean} loading
 * @param {Function} run
 */
export default (options) => {
  const {
    handleList,
    manual,
    rigidParams,
    request,
    defaultPageSize = 20,
    onFinally,
  } = options
  const preList = useRef([])
  const {
    tableProps,
    run: runGetList,
    runAsync: runAsyncList,
    params,
    refresh,
    mutate,
  } = useAntdTable(
    (pager = {}, vals = {}, ...args) => {
      return request({
        current: 1,
        pageSize: defaultPageSize,
        ...pager
      }, { ...vals, ...rigidParams }, ...args)
    },
    {
      manual,
      defaultPageSize,
      onBefore: ([pager = {current: 1, pageSize : defaultPageSize}] = []) =>  {
        const pageNo = pager.current || 1
        if(pageNo !== 1) {
          preList.current = [...tableProps.dataSource]
        } else {
          preList.current = []
        }
      },
      onFinally: ([pager = { current: 1 }], res) => {
        const { current = 1, pageSize = defaultPageSize } = pager
        if (current === 1) {
          preList.current = []
        }
        if (typeof onFinally === 'function') {
          onFinally([pager], res)
        }
        if (res) {
          const endIdx = (current - 1) * pageSize
          refreshList({
            dataSource: res.list,
            total: res.total,
            preList: preList.current.slice(0, endIdx),
            mutateFn: mutate,
            handleList,
          })
        }
      },
      onError: (e, [pager= {current: 1}] = []) => {
        if (pager.current === 1) {
          preList.current = []
          mutate({
            list: [],
            total: 0
          })
        }
      }
    }
  )

  const runAsync = async (...args) => {
    const [pager = {current: 1}, vals = {}, ...rest] = args
    const pageNo = pager.current || 1
    try {
     await runAsyncList({
      current: 1,
      pageSize: defaultPageSize,
      ...pager
    }, { ...vals, ...rigidParams },...rest)
    } catch (e) {
      if (pageNo === 1) {
        mutate({
          list: [],
          total: 0
        })
      }
    }
  }

  return {
    tableProps,
    params,
    loading: tableProps.loading,
    run: runGetList,
    runAsync,
    refresh
  }
}
