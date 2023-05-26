import { forwardRef, useEffect, useMemo, useContext } from 'react'
import { difference } from 'lodash'
import { Form, message } from 'antd'
import { Table } from 'components/TableContent'
import ModalContext from '../../ModalContext'

/**
 * @param {Object} tableProps 表格属性
 * @param {Function(vals)} onFilterChange 查询值变化时
 * @param {ReactNode} formContent 查询表单内容
 * @param {Array<Object>} selectedArr 已选择数据
 * @param {function(Array)} onKeysChange 当勾选变化
 */
const TableSide = forwardRef((props, ref) => {
  const {
    valueKey,
    tableProps,
    onFilterChange,
    formContent,
    selectedArr,
    onKeysChange, 
    max
  } = props
  const [form] = Form.useForm()
  const { visible } = useContext(ModalContext)
  useEffect(() => {
    if (visible) {
      form.resetFields()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const tableSelectedKeys = useMemo(() => {
    return selectedArr.map((ele) => ele[valueKey])
  }, [selectedArr, valueKey])

  const onRowChange = (keys, rows, e) => {
    const isAdd = keys.length > tableSelectedKeys.length
    if (isAdd && tableSelectedKeys.length >= max) {
      message.warning(`最多只能选择${max}项数据`)
      return
    }
    const diffKeys = isAdd
      ? difference(keys, tableSelectedKeys)
      : difference(tableSelectedKeys, keys)
    const newArr = rows.filter((ele) =>
      ele ? diffKeys.includes(ele[valueKey]) : false
    )
    const nextKeys = isAdd
      ? [...selectedArr, ...newArr]
      : selectedArr.filter((ele) => !diffKeys.includes(ele[valueKey]))
    onKeysChange(nextKeys, { key: diffKeys[0], isAdd })
  }

  return (
    <div ref={ref}>
      <Form
        onValuesChange={onFilterChange}
        form={form}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{ span: 20 }}>
        {formContent}
      </Form>
      <div>
        <Table
          rowKey={valueKey}
          rowSelection={{
            preserveSelectedRowKeys: true,
            selectedRowKeys: tableSelectedKeys,
            onChange: onRowChange,
          }}
          scroll={{ y: 320 }}
          {...tableProps}
        />
      </div>
    </div>
  )
})

export default TableSide
