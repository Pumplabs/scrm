import React, { useMemo } from 'react';
import { Form, Input, Row, Col, message } from 'antd';
import { get } from 'lodash'
import TagSelect from 'components/TagSelect'
import DrawerForm from 'components/DrawerForm'
import { PictureUpload, UploadImgBtn } from 'components/CommonUpload'
import { TITLE_LEN } from '../../constants'
import { WX_IMG_FILE_TYPE,WX_IMG_FILE_SIZE } from 'src/utils/constants'

const AddDrawer = (props) => {
  const { data = {}, modalType, onOk, visible, ...rest } = props

  const formInitValues = useMemo(() => {
    if (visible && modalType === 'edit') {
      return {
        title: data.title,
        files: [{
          uid: data.fileId,
          isOld: true,
          url: data.filePath,
          name: `${data.title}.${data.mediaSuf}`
        }],
        mediaTagList: Array.isArray(data.mediaTagDetailList) ? data.mediaTagDetailList : [],
      }
    } else {
      return {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalType, visible])

  const handleFinish = (values) => {
    const { mediaTagList = [], files, ...rest } = values
    const [file] = files
    const fileId = file.isOld ? file.uid : get(files[0], 'response.data.id')
    const nextValues = {
      fileId,
      mediaTagList: mediaTagList.map(ele => ele.id),
      ...rest
    }
    const hasUploading = files.some(ele => ele.status === 'uploading')
    if (hasUploading) {
      message.warning('文件还在上传中，请稍等')
      return
    }
    if (typeof onOk === 'function') {
      onOk(nextValues)
    }
  }

  const normFile = (e) => {
    if (Array.isArray(e)) {
      return e;
    }
    return e && e.fileList;
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
            label="上传图片"
            name="files"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: true,
                type: 'array',
                message: "请上传图片"
              }
            ]}
            extra={
              <div>
                1. 仅支持上传{WX_IMG_FILE_TYPE.join('、')}类型文件
                <br />
                2. 文件大小不超过{WX_IMG_FILE_SIZE}M
              </div>
            }
          >
            <PictureUpload
              listType="picture-inline"
              maxCount={1}
              validOptions={{
                maxFileSize: WX_IMG_FILE_SIZE,
                maxFileTotalLen: 2,
                acceptTypeList: WX_IMG_FILE_TYPE
              }}
              onBeforeUpload={(_, flag) => flag}
            >
              <UploadImgBtn title="上传图片" />
            </PictureUpload>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="图片名称"
            name="title"
            rules={[{ required: true, message: '请输入图片名称' }]}
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