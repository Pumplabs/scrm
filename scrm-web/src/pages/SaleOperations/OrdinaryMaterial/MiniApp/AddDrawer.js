import React, { useMemo } from 'react';
import { Form, Input, Row, Col } from 'antd';
import { get } from 'lodash'
import TagSelect from 'components/TagSelect'
import DrawerForm from 'components/DrawerForm'
import  {PictureUpload, UploadImgBtn } from 'components/CommonUpload'
import { COVER_IMG_TYPES } from 'src/utils/constants'

const AddDrawer = (props) => {
  const { data = {}, modalType, onOk, visible, ...rest } = props

  const formInitValues = useMemo(() => {
    if (visible && modalType === 'edit') {
      return {
        files: [{
          uid: data.fileId,
          url: data.filePath,
          isOld: true,
          name: `${data.appInfo.name}.${data.mediaSuf}`
        }],
        appPath: data.appInfo.appPath,
        appId: data.appInfo.appId,
        name: data.appInfo.name,
        mediaTagList: Array.isArray(data.mediaTagDetailList) ? data.mediaTagDetailList : [],
      }
    } else {
      return {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalType, visible])

  const handleFinish = (values) => {
    const { name, files, mediaTagList = [], appPath, appId } = values
    const [file] = files
    const fileId = file.isOld ? file.uid : get(files[0], 'response.data.id')
    const nextValues = {
      title: name,
      fileId,
      mediaTagList: mediaTagList.map(ele => ele.id),
      appInfo: {
        name,
        appPath,
        appId
      },
      ...rest
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
            label="小程序名称"
            name="name"
            rules={[
              { required: true, message: '请输入小程序名称' },
            { min: 4, message: '小程序名称不能少于4个字符' }
          ]}
          >
            <Input
              maxLength={30}
              minLength={4}
              placeholder={`请输入4-30个字符`}
              allowClear={true}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="APPID"
            name="appId"
            rules={[{ required: true, message: '请输入APPID' }]}
          >
            <Input
              maxLength={500}
              placeholder={`请输入不超过500个字符`}
              style={{ resize: "none" }}
              rows={4}
              allowClear={true}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="APP路径"
            name="appPath"
            rules={[{ required: true, message: '请输入APP路径' }]}
          >
            <Input
              maxLength={Number.MAX_SAFE_INTEGER}
              placeholder="请输入APP路径"
              allowClear={true}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="APP封面"
            name="files"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: true,
                type: 'array',
                message: "请上传APP封面"
              }
            ]}
            extra={
              <div>
                1. 仅支持上传{COVER_IMG_TYPES.join('、')}类型文件
                <br />
                2. 文件大小不超过2M
              </div>
            }
          >
            <PictureUpload
              listType="picture-inline"
              maxCount={1}
              validOptions={{
                maxFileSize: 2,
                maxFileTotalLen: 2,
                acceptTypeList: COVER_IMG_TYPES
              }}
              onBeforeUpload={(_, flag) => flag}
            >
              <UploadImgBtn title="上传封面" />
            </PictureUpload>
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