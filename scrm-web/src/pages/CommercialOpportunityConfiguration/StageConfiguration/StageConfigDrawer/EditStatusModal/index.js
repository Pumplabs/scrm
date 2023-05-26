import { useEffect, useRef } from 'react'
import { Form, Input, Row, Col } from 'antd'
import MyColorPicker from 'components/MyColorPicker'
import { formatRgbColor, parseRgb } from 'components/MyColorPicker/utils'
import CommonModal from 'components/CommonModal'

export default (props) => {
  const { visible, data = {}, onOk, ...rest } = props
  const preVisibleRef = useRef(visible)
  const [statusForm] = Form.useForm()

  useEffect(() => {
    if (!visible) {
      if (preVisibleRef.current !== visible) {
        statusForm.resetFields()
      }
    }
    if (visible && data.id) {
      let color = {}
      const {
        r,
        g,
        b,
        a = 1,
      } = parseRgb(
        data.color.startsWith('#') ? formatRgbColor(data.color, 1) : data.color
      )
      color = {
        r,
        g,
        b,
        a,
      }
      statusForm.setFieldsValue({
        name: data.name,
        color,
      })
    }
    preVisibleRef.current = visible
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onFinish = (vals) => {
    if (typeof onOk === 'function') {
      onOk(vals)
    }
  }

  const initialValues = {
    name: '',
    color: {
      a: 1,
      b: 91,
      g: 166,
      r: 87,
    },
  }
  return (
    <CommonModal
      visible={visible}
      width={680}
      onOk={statusForm.submit}
      scrollToFirstError={true}
      formProps={{
        labelCol: {
          span: 4,
        },
        wrapperCol: {
          span: 18,
        },
      }}
      {...rest}>
      <Form
        form={statusForm}
        onFinish={onFinish}
        initialValues={initialValues}
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 18,
        }}>
        <Row>
          <Col span={18}>
            <Form.Item
              label="阶段名称"
              name="name"
              rules={[
                {
                  required: true,
                  message: '请输入阶段名称'
                },
              ]}>
              <Input
                maxLength={20}
                placeholder="请输入阶段名称"
                allowClear={true}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={18}>
            <Form.Item
              label="颜色"
              name="color"
              rules={[
                {
                  required: true,
                  type: 'object',
                  message: '颜色不能为空',
                },
              ]}>
              <MyColorPicker disableAlpha={true} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CommonModal>
  )
}
