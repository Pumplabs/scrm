import { Row, Col, Form, Input } from 'antd'
import TreeSide from '../TreeSide'
import UserCell from '../UserCell'
import ChooseModal from '../../ChooseModal'

export default (props) => {
  const { onlyChooseUser, ...rest } = props
  const renderLeftContent = ({
    responeData = [],
    selectedArr,
    onFilterChange,
    onKeysChange,
    valueKey,
    disableArr,
    max
  }) => {
    return (
      <TreeSide
        valueKey={valueKey}
        disabledDep={onlyChooseUser}
        disableArr={disableArr}
        dataSource={responeData}
        formContent={
          <Row>
            <Col span={24}>
              <Form.Item name="name" label="">
                <Input placeholder="搜索员工" />
              </Form.Item>
            </Col>
          </Row>
        }
        selectedArr={selectedArr}
        onKeysChange={onKeysChange}
        onFilterChange={onFilterChange}
        max={max}
      />
    )
  }
  const renderSelectedItem = (data) => {
    // console.log("user-modal", data)
    return <UserCell data={data} />
  }
  return (
    <ChooseModal
      leftContent={renderLeftContent}
      renderSelectedItem={renderSelectedItem}
      isTableRequest={false}
      {...rest}
    />
  )
}
