import React, { useMemo } from 'react';
import { Form, Input, Row, Col } from 'antd';
import TextAreaWithCount from 'components/TextAreaWithCount'
import TagSelect from 'components/TagSelect'
import DrawerForm from 'components/DrawerForm'
import { TITLE_LEN } from '../../constants'

const AddDrawer = (props) => {
  const { data = {}, modalType, onOk, visible, ...rest } = props

  const formInitValues = useMemo(() => {
    if (visible && modalType === 'edit') {
      return {
        title: data.title,
        content: data.content,
        mediaTagList: Array.isArray(data.mediaTagDetailList) ? data.mediaTagDetailList : [],
      }
    } else {
      return {}
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalType, visible])

  const handleFinish = (values) => {
    const {mediaTagList = [], ...rest } = values
    const nextValues = {
      mediaTagList: mediaTagList.map(ele => ele.id),
      ...rest
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
      {...rest}
      formProps={{
        initialValues: formInitValues
      }}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            label="文本名称"
            name="title"
            rules={[{ required: true, message: '请输入文本名称' }]}
          >
            <Input
              maxLength={TITLE_LEN}
              placeholder={`请输入不超过${TITLE_LEN}个字符`}
              allowClear={true}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="文本内容"
            name="content"
            rules={[{ required: true, message: '请输入文本内容' }]}
          >
            <TextAreaWithCount
              maxLength={500}
              placeholder={`请输入不超过500个字符`}
              style={{
                resize: "none",
                height: 340
              }}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="分类标签"
            name="mediaTagList"
            rules={[{ required: false, type: 'array', message: '请选择分类标签' }]}
          >
            <TagSelect
              placeholder="请选择标签"
              style={{ width: "100%" }}
              tagType="material"
            />
          </Form.Item>
        </Col>
      </Row>
    </DrawerForm>
  );
};
export default AddDrawer