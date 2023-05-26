import { useMemo } from 'react'
import { Row, Col, Form, Input, DatePicker, message } from 'antd'
import { difference } from 'lodash'
import TagCell from 'components/TagCell'
import WeChatCell from 'components/WeChatCell'
import TagSelect from 'components/TagSelect'
import UserTag from 'components/UserTag'
import GroupOwnerSelect from 'components/GroupOwnerSelect'
import TableSide from '../TableSide'
import ChooseModal from '../../ChooseModal'

const { RangePicker } = DatePicker
const customerColumns = [
  {
    title: '客户名称',
    width: 140,
    dataIndex: 'customer',
    render: (_, record) => <WeChatCell data={record} />,
  },
  {
    title: '客户标签',
    width: 120,
    dataIndex: 'tags',
    render: (val) => {
      return <TagCell dataSource={val} />
    },
  },
  {
    dataIndex: 'extCreatorName',
    title: '所属员工',
    width: 120,
    render: (_, record) => (
      <UserTag
        data={{
          avatarUrl: record.extCreatorAvatar,
          name: record.extCreatorName,
        }}
      />
    ),
  },
  {
    title: '添加时间',
    dataIndex: 'createdAt',
  },
]
const CustomerFormContent = () => {
  return (
    <>
      <Row>
        <Col span={24}>
          <Form.Item
            name="name"
            label="客户昵称"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}>
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            name="times"
            label="添加时间"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}>
            <RangePicker format="YYYY-MM-DD" style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            name="tags"
            label="客户标签"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}>
            <TagSelect
              placeholder="请选择客户标签"
              tagType="customer"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            name="extCreatorIds"
            label="所属员工"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}>
            <GroupOwnerSelect
              placeholder="请选择所属员工"
              style={{ width: '100%' }}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}
export default (props) => {
  const { ...rest } = props

  const formatList = (list = []) => {
    return list.map((ele) => {
      return {
        ...ele,
        key: `${ele.id}_${ele.extCreatorId}`,
      }
    })
  }

  const renderSelectedItem = (data) => {
    return <WeChatCell data={data} />
  }

  return (
    <ChooseModal
      leftContent={({
        responeData,
        selectedArr,
        onFilterChange,
        onKeysChange,
        valueKey,
      }) => (
        <LeftSide
          responeData={responeData}
          selectedArr={selectedArr}
          onFilterChange={onFilterChange}
          onKeysChange={onKeysChange}
          valueKey={valueKey}
          formatList={formatList}
          max={rest.max}
        />
      )}
      renderSelectedItem={renderSelectedItem}
      width={920}
      {...rest}
    />
  )
}

const LeftSide = ({
  responeData,
  selectedArr,
  onFilterChange,
  onKeysChange,
  valueKey,
  formatList,
  max,
}) => {
  const { dataSource = [], ...restTableProps } = responeData
  const onTableKeysChange = (arr, { key = '', isAdd }) => {
    if (isAdd && key) {
      const [customerId] = key.split('_')
      const isExist = arr.some(
        (ele) => ele.id === customerId && ele.key !== key
      )
      if (isExist) {
        message.warning('已选择此客户')
        return
      }
    }
    onKeysChange(arr)
  }

  const tableSelectedKeys = useMemo(() => {
    return selectedArr.map((ele) => ele[valueKey])
  }, [selectedArr, valueKey])

  const onRowChange = (keys, rows, e) => {
    const isAdd = keys.length > tableSelectedKeys.length
    const diffKeys = isAdd
      ? difference(keys, tableSelectedKeys)
      : difference(tableSelectedKeys, keys)
    const newArr = rows.filter((ele) =>
      ele ? diffKeys.includes(ele[valueKey]) : false
    )
    let nextKeys = []
    if (isAdd) {
      if (newArr[0] && selectedArr.length) {
        const isExist = selectedArr.some(
          (ele) => ele.extId === newArr[0].extId && ele.key !== newArr[0].key
        )
        if (isExist) {
          message.warning('已选择此客户')
          return
        }
      }
      if (tableSelectedKeys.length >= max) {
        if (max === 1) {
          nextKeys = newArr
        } else {
          message.warning(`最多只能选择${max}项数据`)
          return
        }
      } else {
        nextKeys = [...selectedArr, ...newArr]
      }
    } else {
      // 移除
      nextKeys = selectedArr.filter((ele) => !diffKeys.includes(ele[valueKey]))
    }
    onKeysChange(nextKeys, { key: diffKeys[0], isAdd })
  }

  return (
    <TableSide
      valueKey={valueKey}
      tableProps={{
        columns: customerColumns,
        dataSource: formatList(dataSource),
        ...restTableProps,
        rowSelection: {
          preserveSelectedRowKeys: true,
          selectedRowKeys: tableSelectedKeys,
          onChange: onRowChange,
        },
      }}
      selectedArr={selectedArr}
      onKeysChange={onTableKeysChange}
      onFilterChange={onFilterChange}
      formContent={<CustomerFormContent />}
      max={max}
    />
  )
}
