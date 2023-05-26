import { Row, Col, Form, Input, DatePicker } from 'antd'
import UserTag from 'components/UserTag'
import TagSelect from 'components/TagSelect'
import TagCell from 'components/TagCell'
import GroupOwnerSelect from 'components/GroupOwnerSelect'
import GroupChatCell from 'components/GroupChatCell'
import TableSide from '../TableSide'
import ChooseModal from '../../ChooseModal'
import { GetGroupOwnerList } from 'services/modules/groupMass'
import { UNSET_GROUP_NAME } from 'utils/constants'

const groupColumns = [
  {
    title: '群名称',
    dataIndex: 'name',
    render: (val) => (val ? val : UNSET_GROUP_NAME),
  },
  {
    title: '群主',
    dataIndex: 'owner',
    render: (val) => <UserTag data={val ? {name: val} : {}} />,
  },
  {
    title: '群标签',
    dataIndex: 'tags',
    render: (val) => {
      return <TagCell dataSource={val} />
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
  },
]

const GroupFormContent = () => {
  return (
    <>
      <Row>
        <Col span={12}>
          <Form.Item
            name="name"
            label="群名称"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}>
            <Input placeholder="请输入" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="ownerExtIds"
            label="群主"
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}>
            <GroupOwnerSelect
              style={{ width: '100%' }}
              placeholder="全部"
              allowClear={true}
              request={GetGroupOwnerList}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item name="times" label="创建时间">
            <DatePicker.RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item name="tags" label="群标签">
            <TagSelect tagType="group" style={{ width: '100%' }} />
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
    valueKey
  }) => {
    return (
      <TableSide
        valueKey={valueKey}
        tableProps={{
          columns: groupColumns,
          ...responeData,
        }}
        selectedArr={selectedArr}
        onKeysChange={onKeysChange}
        onFilterChange={onFilterChange}
        formContent={<GroupFormContent />}
      />
    )
  }
  const renderSelectedItem = (data) => {
    return (
      <GroupChatCell
        data={data}
        borded={false}
        style={{ maxWidth: '100%' }}
      />
    )
  }

  return (
    <ChooseModal
      leftContent={renderLeftContent}
      renderSelectedItem={renderSelectedItem}
      {...rest}
    />
  )
}
