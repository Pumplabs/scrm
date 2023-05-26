import { useState, useRef, useMemo } from 'react'
/**
 * @param {String} noMorePrefixStr 没有超出时信息前缀
 * @param {String} moreSuffixStr 超过时后缀
 * @param {Function} formatStr 提示信息，返回字符串
 * @param {Function} formatLabel 格式化单个文本，优先级高于label
 * @param {String} label 名称key
 * @param {Number} preCount 溢出数量 
 */
export default (options = {}) => {
  const { preCount = 1, label = 'name', formatLabel, formatStr, noMorePrefixStr = '', moreSuffixStr = ''} = options
  const [selectedKeys, setSelectedKeys] = useState([])
  const rowsRef = useRef([])

  const onRowChange = (keys, rows) => {
    setSelectedKeys(keys)
    rowsRef.current = rows
  }

  const clearSelected = () => {
    setSelectedKeys([])
    rowsRef.current = []
  }

  const getNameStat = (total) => {
    const preArr = rowsRef.current.slice(0, preCount)
    const hasMore = total > preCount
    const names = preArr.map(ele => {
      const name = typeof formatLabel === 'function' ? formatLabel(ele) : ele[label]
      return `"${name}"`
    }).join()
    return {
      hasMore,
      names
    }
  }

  const convertStr = (names, hasMore, total) => {
    if (typeof formatStr === 'function') {
      return formatStr(names, hasMore, total)
    } else {
      return  hasMore ? `${names}等${total}${moreSuffixStr}` : `${noMorePrefixStr}${names}`
    }
  }

  const selectedStr = useMemo(() => {
    const total = selectedKeys.length
    if (total > 0) {
      const { names, hasMore } = getNameStat(total)
     return convertStr(names, hasMore, total)
      
    } else {
      return ''
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedKeys])

  return {
    clearSelected,
    selectedKeys,
    selectedRows: rowsRef.current,
    selectedStatStr: selectedStr,
    selectedProps: {
      rowSelection: {
        selectedRowKeys: selectedKeys,
        onChange: onRowChange,
      }
    }
  }
}