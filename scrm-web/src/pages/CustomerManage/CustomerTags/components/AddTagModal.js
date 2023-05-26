import React, { useMemo, useRef } from 'react'
import { Form, Input, Row, Col, Modal } from 'antd'
import { TagFormList, handleTagsParams } from 'components/TagsFormList'
import DrawerForm from 'components/DrawerForm'
import { CUSTOMER_TAG_GROUP_NAME } from 'utils/fields'

const AddModal = (props) => {
  const { data = {}, modalType, onOk, visible, ...rest } = props
  const form = useRef(null)

  const formInitValues = useMemo(() => {
    if (visible && modalType === 'edit') {
      const tags = Array.isArray(data.tags) ? data.tags : []
      return {
        name: data.name || '',
        tags,
        department: data.departmentList ? JSON.parse(data.departmentList) : [],
      }
    } else {
      return {}
    }
  }, [modalType, data, visible])

  const onRemove = (idx, removeFn, itemData) => {
    if (itemData.id) {
      Modal.confirm({
        title: '提示',
        content: (
          <>
            确定要删除标签"{itemData.name}"吗？
            <br />
            删除后，已添加到客户信息的标签也一起删除
          </>
        ),
        centered: true,
        onOk: () => {
          removeFn(idx)
        },
      })
    } else {
      removeFn(idx)
    }
  }
  const handleFinish = (values) => {
    const { name, tags } = values
    const {
      addList,
      editList,
      noChangeList,
      removeIds: removeTagIds,
    } = handleTagsParams(tags, data.tags)
    const nextValues = {
      name,
      addList,
      editList,
      removeTagIds,
      noChangeList
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
              onRemove={onRemove}
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
