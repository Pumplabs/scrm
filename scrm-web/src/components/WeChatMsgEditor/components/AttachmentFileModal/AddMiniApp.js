import React, { useEffect, useRef, useMemo } from 'react';
import { Input, Form, Alert } from 'antd';
import CommonModal from 'components/CommonModal'
import { UploadImgBtn, PictureUpload } from 'components/CommonUpload';
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

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  const formVals = useMemo(() => {
    const content = data.content ? data.content : {}
    const { name, appId, pathName, file } = content
    return {
      name,
      appId,
      pathName,
      file
    }
  }, [data])
  return (
    <CommonModal
      visible={visible}
      {...rest}
      width={640}
      onOk={form.submit}
    >
      <div style={{ marginBottom: 12 }}>
        <Alert
          message="请填写企业微信后台绑定的小程序id和路径，否则会造成发送失败"
          type="info"
          showIcon
        />
      </div>
      <Form
        form={form}
        onFinish={onOk}
        initialValues={formVals}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label="小程序标题"
          name="name"
          rules={[
            {
              required: true,
              message: "请输入小程序标题"
            }
          ]}
        >
          <Input
            placeholder={`请输入不超过20个字符`}
            allowClear={true}
            maxLength={20}
          />
        </Form.Item>
        <Form.Item
          label="小程序appID"
          name="appId"
          extra={
            <div style={{ paddingTop: 4 }}>
              <a href="https://www.baidu.com">如何获取小程序appID?</a>
            </div>
          }
          rules={[
            {
              required: true,
              message: "请输入小程序AppID"
            }
          ]}
        >
          <Input
            placeholder={`请输入不超过20个字符`}
            allowClear={true}
          />
        </Form.Item>
        <Form.Item
          label="小程序路径"
          name="pathName"
          extra={
            <div style={{ paddingTop: 4 }}>
              <span style={{ marginRight: 2 }}>注意：小程序路径应以html作为后缀。</span>
              <a href="https://www.baidu.com">如何获取小程序路径?</a>
            </div>
          }
          rules={[
            {
              required: true,
              message: "请输入小程序路径"
            }
          ]}
        >
          <Input
            placeholder={`请输入不超过20个字符`}
            allowClear={true}
            maxLength={20}
          />
        </Form.Item>
        <Form.Item
          label="小程序封面"
          name="file"
          valuePropName="fileList"
          rules={[
            {
              required: true,
              message: "请上传小程序封面"
            }
          ]}
          getValueFromEvent={normFile}
        // extra={'建议图片大小在2M以内，建议尺寸： 352* 282px'}
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
      </Form>
    </CommonModal>
  )
}