import React, { useState, useEffect } from 'react'
import { Form, Row, Col } from 'antd'
import MySelect from 'components/MySelect'
import DrawerForm from 'components/DrawerForm'

const AllotDrawer = ({
  data = {},
  modalType,
  visible,
  ...rest
}) => {

  const [disabledUsers, setDisabledUsers] = useState([])
  useEffect(() => {
   if (!visible) {
     setDisabledUsers([])
   }
  }, [visible])
  
  const onCustomerChange = (arr) => {
    let users = []
    arr.forEach(item => {
      if (item.creatorStaff) {
        const staffId = item.creatorStaff.id
        if (!users.includes(staffId)) {
          users = [...users, `user_${staffId}`]
        }
      }
    })
    setDisabledUsers(users)
  }

  return (
    <DrawerForm
      visible={visible}
      width={680}
      {...rest}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            label="客户"
            rules={[{ required: true, message: '请选择客户' }]}
            name="customers"
          >
            <MySelect
              type="allCustomer"
              title="选择客户"
              placeholder="选择客户"
              style={{ width: '50%' }}
              onChange={onCustomerChange}
              baseSearchParams={{
                noTransferInfoStatus: [2]
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="接替成员"
            name="users"
            rules={[{ required: true, message: '请选择接替成员' }]}>
            <MySelect
              onlyChooseUser={true}
              type="user"
              valueKey="id"
              title="选择成员"
              placeholder="选择成员"
              style={{ width: '50%' }}
              disabledValues={disabledUsers}
              max={1}
            />
          </Form.Item>
        </Col>
      </Row>
    </DrawerForm>
  )
}
export default AllotDrawer
