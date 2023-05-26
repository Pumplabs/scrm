import React, {  useMemo, useRef } from 'react'
import { Form, Input, Row, Col } from 'antd'
import DrawerForm from 'components/DrawerForm'
import { TagFormList, handleTagsParams } from 'components/TagsFormList'
import { CUSTOMER_TAG_GROUP_NAME } from 'utils/fields'

const AddModal = (props) => {
  const { data = {}, modalType, onOk, visible, ...rest } = props
  const form = useRef(null)

  const formInitValues = useMemo(() => {
    if (visible && modalType === 'edit') {
       const tags = Array.isArray(data.tags)
        ? data.tags.sort((a, b) => a.order - b.order)
        : []
      return {
        name: data.name || '',
        tags
      }
    } else {
      return {}
    }
  }, [modalType, data, visible])

  const handleFinish = (values) => {
    const { name, tags } = values
    const { addList, editList,removeIds: removeTagIds} = handleTagsParams(tags, data.tags)
    const nextValues = {
      name,
      addList,
      editList,
      removeTagIds
    }
    if (typeof onOk === 'function') {
      onOk(nextValues)
    }
  }

  return (
    <DrawerForm
      onOk={handleFinish}
      visible={visible}
      modalType={modalType}
      getForm={(ref) => (form.current = ref)}
      {...rest}
      formProps={{
        initialValues: formInitValues,
      }}>
      <Row>
        <Col span={24}>
          <Form.Item
            label="标签组名称"
            name="name"
            rules={[{ required: true, message: '请输入标签组名称' }]}>
            <Input
              maxLength={CUSTOMER_TAG_GROUP_NAME}
              placeholder={`请输入不超过${CUSTOMER_TAG_GROUP_NAME}个字符`}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item label="标签名称" required={true}>
            <TagFormList
              name="tags"
              getFieldValue={
                form.current ? form.current.getFieldValue : undefined
              }
              rules={[
                {
                  validator: async (_, value = []) => {
                    if (Array.isArray(value) && value.length) {
                      return Promise.resolve()
                    } else {
                      throw new Error('请输入标签')
                    }
                  },
                },
              ]}
            />
          </Form.Item>
        </Col>
      </Row>
    </DrawerForm>
  )
}

export default AddModal
