import React, { useEffect, useState, useMemo } from 'react'
import { Form, message } from 'antd'
import { get } from 'lodash'
import { usePrevious } from 'ahooks'
import CommonModal from 'components/CommonModal'
import CommonUpload, {
  UploadFileBtn,
  UploadTips,
} from 'components/CommonUpload'
import { ACCEPT_VIDEO_FILE_TYPE } from 'src/utils/constants'

export default (props) => {
  const { data = {}, visible, onOk, onCancel, ...rest } = props
  const [form] = Form.useForm()
  const [hasFileUploading, setHasFileUploading] = useState(false)
  const preVisible = usePrevious(visible)
  useEffect(() => {
    if (!visible) {
      setHasFileUploading(false)
    }
    if (!visible && form && preVisible) {
      form.resetFields()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleCancel = () => {
    if (hasFileUploading) {
      message.warning("文件正在上传中,不能关闭弹窗哦")
      return;
    }
    if (typeof onCancel === 'function') {
      onCancel()
    }
  }

  const handleOk = ({ file}) => {
    if (typeof onOk === 'function') {
      onOk({
        file,
        name: file[0].name
      })
    }
  }

  const onFileChange = ({ file }) => {
    setHasFileUploading(file.status === 'uploading')
  }

  const formVals = useMemo(
    () => ({
      file: get(data, 'content.file'),
    }),
    [data]
  )

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e
    }
    return e && e.fileList
  }

  return (
    <CommonModal
      title="添加视频文件"
      visible={visible}
      {...rest}
      onCancel={handleCancel}
      onOk={form.submit}
      okButtonProps={{
        disabled: hasFileUploading
      }}
    >
      <Form
        form={form}
        onFinish={handleOk}
        initialValues={formVals}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}>
        <Form.Item
          label="上传视频"
          name="file"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          rules={[
            {
              required: false,
              type: 'array',
              message: '请上传视频',
            },
          ]}
          extra={
            <UploadTips
              rules={[
                {
                  type: 'acceptType',
                  types: ACCEPT_VIDEO_FILE_TYPE,
                },
                {
                  type: 'maxSize',
                  maxSize: 10,
                },
              ]}
            />
          }>
          <CommonUpload
            maxCount={1}
            validOptions={{
              maxFileSize: 10,
              maxFileTotalLen: 1,
              acceptTypeList: ACCEPT_VIDEO_FILE_TYPE,
            }}
            onBeforeUpload={(_, flag) => flag}
            onChange={onFileChange}
          >
            <UploadFileBtn title="上传文件" />
          </CommonUpload>
        </Form.Item>
      </Form>
    </CommonModal>
  )
}
