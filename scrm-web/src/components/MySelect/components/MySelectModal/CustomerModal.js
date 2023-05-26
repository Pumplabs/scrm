import { Row, Col, Form, Input, DatePicker } from 'antd'
import TagCell from 'components/TagCell'
import WeChatCell from 'components/WeChatCell'
import TagSelect from 'components/TagSelect'
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
    width: 140,
    dataIndex: 'tags',
    render: (val) => {
      return <TagCell dataSource={val} />
    },
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
              style={{ width: '50%' }}
            />
          </Form.Item>
        </Col>
      </Row>
    </>
  )
}
export default (props) => {
  const { ...rest } = props
  const renderLeftContent = ({
    responeData,
    selectedArr,
    onFilterChange,
    onKeysChange,
    valueKey,
  }) => {
    return (
      <TableSide
        valueKey={valueKey}
        tableProps={{
          columns: customerColumns,
          ...responeData,
        }}
        selectedArr={selectedArr}
        onKeysChange={onKeysChange}
        onFilterChange={onFilterChange}
        visible={rest.visible}
        formContent={<CustomerFormContent />}
        max={rest.max}
      />
    )
  }
  const renderSelectedItem = (data) => {
    return <WeChatCell data={data} />
  }

  return (
    <ChooseModal
      leftContent={renderLeftContent}
      renderSelectedItem={renderSelectedItem}
      {...rest}
    />
  )
}
