import { useRef } from 'react'
import { Form, Input, Row, Col, Select } from 'antd'
import DrawerForm from 'components/DrawerForm'

const DATA_SCOPE_OPTIONS = [
  {
    label: '全部数据权限',
    value: 1,
  },
  {
    label: '自定义数据权限',
    value: 2,
  },
  {
    label: '本部门数据权限',
    value: 3,
  },
  {
    label: '本部门及以下数据权限',
    value: 4,
  },
]
export default (props) => {
  const { data = {}, menuData = [], visible, ...rest } = props
  return (
    <DrawerForm {...rest} visible={visible}>
      <Row>
        <Col span={24}>
          <Form.Item
            label="角色名称"
            name="roleName"
            rules={[
              {
                required: true,
                message: '请输入角色名称',
              },
            ]}>
            <Input placeholder="请输入角色名称" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="角色备注"
            name="remark"
            rules={[
              {
                required: true,
                message: '请输入角色备注',
              },
            ]}>
            <Input.TextArea placeholder="请输入角色备注" />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="数据范围"
            name="dataScope"
            rules={[
              {
                required: true,
                message: '请选择数据范围',
              },
            ]}>
            <Select
              placeholder="请选择数据范围"
              options={DATA_SCOPE_OPTIONS}
              fieldNames={{
                title: 'label',
                value: 'value',
              }}
            />
          </Form.Item>
        </Col>
      </Row>
    </DrawerForm>
  )
}
