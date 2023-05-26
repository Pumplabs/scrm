import React, { useEffect, useRef, useMemo } from 'react';
import { Form } from 'antd';
import { get } from 'lodash'
import CommonModal from 'components/CommonModal'
import { PictureUpload, UploadImgBtn } from 'components/CommonUpload'
import { WX_IMG_FILE_TYPE, WX_IMG_FILE_SIZE } from  'src/utils/constants'

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

  const handleOk = ({ file}) => {
    if (typeof onOk === 'function') {
      onOk({
        file,
        name: file[0].name
      })
    }
  }
  
  const formVals = useMemo(() => ({
    file: get(data, 'content.file'),
  }), [data])

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
  };

  return (
    <CommonModal
      title="添加图片附件"
      visible={visible}
      {...rest}
      onOk={form.submit}
    >
      <Form
        form={form}
        onFinish={handleOk}
        initialValues={formVals}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
      >
        <Form.Item
          label="图片"
          name="file"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: true,
              type: 'array',
              message: "请上传图片"
            }
          ]}
        >
          <PictureUpload
            listType="picture-inline"
            maxCount={1}
            validOptions={{
              maxFileSize: WX_IMG_FILE_SIZE,
              acceptTypeList: WX_IMG_FILE_TYPE
            }}
            onBeforeUpload={(_, flag) => flag}
          >
            <UploadImgBtn title="上传图片" />
          </PictureUpload>
        </Form.Item>
      </Form>
    </CommonModal>
  )
}