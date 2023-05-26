import { useEffect, useRef } from 'react'
import { Form, Input } from 'antd'
import DrawerForm from 'components/DrawerForm'
import StageTags from './StageTags'
import { MAX_JOURNEY_STAGE } from '../constants'

export default ({ visible, data = {}, stageList = [], ...rest }) => {
  const form = useRef()
  useEffect(() => {
    if (visible && data.id && stageList.length) {
      if (form.current) {
        form.current.setFields([
          {
            name: 'stages',
            value: stageList,
          },
        ])
      }
    }
  }, [visible, data, stageList])

  useEffect(() => {
    if (visible && data.id) {
      if (form.current) {
        form.current.setFields([
          {
            name: 'name',
            value: data.name,
          },
        ])
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, data])

  return (
    <DrawerForm
      visible={visible}
      getForm={(ref) => (form.current = ref)}
      {...rest}>
      <Form.Item
        label="旅程名称"
        name="name"
        rules={[
          {
            required: true,
            message: '请输入旅程名称',
          },
        ]}>
        <Input placeholder="请输入不超过10个字符" maxLength={10} />
      </Form.Item>
      <Form.Item
        label="阶段"
        name="stages"
        rules={[
          {
            required: true,
            type: 'array',
            message: '请填写阶段信息',
          },
          {
            type: 'array',
            max: MAX_JOURNEY_STAGE,
            message: `阶段不能超过${MAX_JOURNEY_STAGE}个`,
          },
        ]}>
        <StageTags maxCount={10} />
      </Form.Item>
    </DrawerForm>
  )
}
