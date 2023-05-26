import React, { useState, useEffect } from 'react'
import { useAntdTable, useRequest } from 'ahooks'
import { isEmpty } from 'lodash'
import CommonModal from 'components/CommonModal'
import ChooseContent from './ChooseContent'

/**
 * @param {function} renderSelectedItem 渲染已选中项
 * @param {React.Node} leftContent 左边
 * @param {function} request 请求方法
 * @param {Boolean} isTableRequest 是否为表格请求,默认为true
 * @param {Array<Object>} columns 表格列
 * @param {React.Node} formContent 表单内容
 */
export default (props) => {
  const {
    valueKey,
    visible,
    leftContent,
    renderSelectedItem,
    request,
    isTableRequest = true,
    baseSearchParams = {},
    formContent,
    selectedList,
    allowEmpty,
    disableArr,
    onOk,
    max,
    ...rest
  } = props
  const [selectedVal, setSelectedVal] = useState(selectedList)

  const {
    tableProps,
    run: runGetTableList,
    cancel,
  } = useAntdTable(request, {
    manual: true,
  })

  const { data: listData, run: runGetListData } = useRequest(request, {
    manual: true,
  })
  const getData = (vals = {}) => {
    if (typeof request === 'function') {
      if (isTableRequest) {
        runGetTableList({
          current: 1,
        }, {
          ...baseSearchParams,
          ...vals
        })
      } else {
        runGetListData({
          ...baseSearchParams,
          ...vals
        })
      }
    }
  }

  useEffect(() => {
    if (visible) {
      getData()
      setSelectedVal(selectedList || [])
    } else {
      setSelectedVal([])
      cancel()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onChange = (arr) => {
    setSelectedVal(arr)
  }

  const handleOk = () => {
    if (typeof onOk === 'function') {
      onOk(selectedVal)
    }
  }

  return (
    <CommonModal
      visible={visible}
      width={800}
      onOk={handleOk}
      okButtonProps={{
        disabled: allowEmpty ? false : isEmpty(selectedVal),
      }}
      bodyStyle={{
        maxHeight: '440px',
        overflow: 'auto',
      }}
      {...rest}
    >
      <ChooseContent
        value={selectedVal}
        onChange={onChange}
        visible={visible}
        valueKey={valueKey}
        responeData={isTableRequest ? tableProps : listData}
        tableProps={tableProps}
        onFilterChange={getData}
        formContent={formContent}
        leftContent={leftContent}
        renderSelectedItem={renderSelectedItem}
        disableArr={disableArr}
        max={max}
      />
    </CommonModal>
  )
}
