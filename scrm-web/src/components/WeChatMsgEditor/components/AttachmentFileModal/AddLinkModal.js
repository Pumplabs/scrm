import React, { useEffect, useRef, useMemo, useState } from 'react';
import { Input, Form, Row, Col } from 'antd';
import CommonModal from 'components/CommonModal'
import { UploadImgBtn, PictureUpload } from 'components/CommonUpload'
import { COVER_IMG_TYPES } from 'src/utils/constants'

export default (props) => {
  const { data = {}, visible, onOk, ...rest } = props
  const [form] = Form.useForm()
  const hasVisible = useRef()
  useEffect(() => {
    if (hasVisible.current && visible) {
      form.resetFields()
    }
    if (!hasVisible.current && visible) {
      hasVisible.current = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleOk = (values) => {
    if (typeof onOk === 'function') {
      onOk(values)
    }
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const formVals = useMemo(() => {
    const { href = '', name, info, file } = (data.content || {})
    return {
      href,
      name,
      info,
      file
    }
  }, [data])

  return (
    <CommonModal
      visible={visible}
      {...rest}
      onOk={form.submit}
      bodyStyle={{
        minHeight: 220
      }}
    >
      <Form
        labelCol={{ span: 4 }}
        form={form}
        onFinish={handleOk}
        initialValues={formVals}
      >
        <Form.Item
          label="链接地址"
          name="href"
          rules={[
            {
              required: true,
              type: 'url',
              message: "请输入链接地址"
            }
          ]}
        >
          <Input
            placeholder={`请输入不超过200个字符`}
            maxLength={200}
            allowClear={true}
          />
        </Form.Item>
        <Row>
          <Col span={24}>
            <Form.Item
              label="链接标题"
              name="name"
              rules={[
                {
                  required: true,
                  message: "请输入链接标题"
                }
              ]}
            >
              <Input
                placeholder={`请输入不超过40个字符`}
                maxLength={40}
                allowClear={true}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="链接描述"
              name="info"
            >
              <Input.TextArea
                placeholder={`请输入不超过200个字符`}
                allowClear={true}
                rows={4}
                maxLength={200}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="链接封面"
              name="file"
              valuePropName="fileList"
              getValueFromEvent={normFile}
              rules={[
                {
                  required: false,
                  message: "请上传链接封面"
                }
              ]}
            >
              <PictureUpload
                listType="picture-inline"
                maxCount={1}
                validOptions={{
                  maxFileSize: 2,
                  acceptTypeList: COVER_IMG_TYPES
                }}
                onBeforeUpload={(_, flag) => flag}
              >
                <UploadImgBtn title="上传封面" />
              </PictureUpload>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CommonModal>
  )
}