import { useState, useMemo, forwardRef } from 'react'
import { Row, Col } from 'antd'
import SelectedList from '../SelectedList'
import TableSide from '../../components/TableSide'

const Content = forwardRef((props, ref) => {
  const {
    value,
    valueKey,
    onChange,
    disableArr,
    max = Number.MAX_SAFE_INTEGER,
    onFilterChange,
    formContent,
    renderSelectedItem,
    leftContent,
    responeData,
  } = props
  const isDefinedValue = typeof value !== 'undefined'
  const [selectedList, setSelectedList] = useState([])
  const changeSelectedList = (arr) => {
    if (typeof onChange === 'function') {
      onChange(arr)
    }
    if (!isDefinedValue) {
      setSelectedList(arr)
    }
  }

  const onRemoveAll = () => {
    changeSelectedList([])
  }
  const onRemoveItem = (item) => {
    changeSelectedList(selectedArr.filter((ele) => ele[valueKey] !== item[valueKey]))
  }
  const selectedArr = useMemo(() => {
    return isDefinedValue ? (Array.isArray(value) ? value : []) : selectedList
  }, [isDefinedValue, value, selectedList])

  return (
    <Row gutter={20} ref={ref}>
      <Col span={16}>
        {typeof leftContent === 'function' ? (
          leftContent({
            valueKey,
            selectedArr,
            max,
            responeData,
            onFilterChange,
            disableArr,
            onKeysChange: changeSelectedList,
          })
        ) : (
          <TableSide
            tableProps={responeData}
            selectedArr={selectedArr}
            onKeysChange={changeSelectedList}
            onFilterChange={onFilterChange}
            formContent={formContent}
            valueKey={valueKey}
            max={max}
          />
        )}
      </Col>
      <Col span={8}>
        <SelectedList
          valueKey={valueKey}
          dataSource={selectedArr}
          onRemoveAll={onRemoveAll}
          onRemove={onRemoveItem}
          renderItem={renderSelectedItem}
          disableArr={disableArr}
        />
      </Col>
    </Row>
  )
})
export default Content
