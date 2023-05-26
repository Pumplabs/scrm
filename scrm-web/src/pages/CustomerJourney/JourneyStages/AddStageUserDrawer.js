import { useMemo, useRef, useContext } from 'react'
import { Form, Select, Row, Col, Divider } from 'antd'
import DrawerForm from 'components/DrawerForm'
import CustomerFilter from './CustomerFilter'
import StageContext from '../StageContext'

export default ({ visible, data = {}, modalType, ...rest }) => {
  const form = useRef()
  const {allStageList = []} = useContext(StageContext)

  const initialValues = useMemo(() => {
    if (visible && data.stageId) {
      return {
        stageId: data.stageId,
        users: []
      }
    } else {
      return {
        users: []
      }
    }
  }, [data, visible])

  return (
    <DrawerForm
      visible={visible}
      getForm={(ref) => (form.current = ref)}
      {...rest}
      width={1000}
      formProps={{
        initialValues,
      }}>
      <Row>
        <Col span={12}>
          <Form.Item
            label="选择阶段"
            name="stageId"
            style={{marginBottom: 0}}
            rules={[
              {
                required: true,
                message: '请选择阶段',
              },
            ]}>
            <Select
              disabled={modalType === 'addStageUser'}
              placeholder="请选择阶段">
              {allStageList.map((ele) => (
                <Select.Option key={ele.id} value={ele.id}>
                  {ele.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Divider />
      <Form.Item
        label=""
        colon={false}
        name="users"
        labelCol={{ span: 0 }}
        wrapperCol={{ span: 24 }}
        rules={[
          {
            required: true,
            type: 'array',
            message: '请选择客户',
          },
        ]}>
        <CustomerFilter journeyId={data.journeyId}/>
      </Form.Item>
    </DrawerForm>
  )
}
