import React, { useMemo } from 'react';
import { Form, Input, Row, Col, Switch, message } from 'antd';
import { get } from 'lodash'
import TagSelect from 'components/TagSelect'
import DrawerForm from 'components/DrawerForm'
import { PictureUpload, UploadImgBtn } from 'components/CommonUpload'
import { TITLE_LEN, DESC_LEN } from '../../constants'
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
          name: `${data.title}.${data.mediaSuf}`
        }],
        link: data.link,
        title: data.title,
        description: data.description,
        mediaTagList: Array.isArray(data.mediaTagDetailList) ? data.mediaTagDetailList : [],
        wxTagList: Array.isArray(data.wxTagDetailList) ? data.wxTagDetailList : [],
        hasInform: data.hasInform,
      }
    } else {
      return {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalType, visible])


  const handleFinish = (values) => {
    const { files, mediaTagList = [], wxTagList = [], ...rest } = values
    const [file] = files
    const fileId = file.isOld ? file.uid : get(files[0], 'response.data.id')
    const nextValues = {
      fileId,
      mediaTagList: mediaTagList.map(ele => ele.id),
      wxTagList: wxTagList.map(ele => ele.id),
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
  };

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
            label="链接地址"
            name="link"
            rules={[{ required: true, type: 'url', message: '请输入链接地址' }]}
          >
            <Input
              maxLength={Number.MAX_SAFE_INTEGER}
              placeholder="请输入链接地址"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="链接封面"
            name="files"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: true,
                type: 'array',
                message: "请上传链接封面"
              }
            ]}
            extra={
              <div>
                1. 仅支持上传{COVER_IMG_TYPES.join()}类型文件
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
            label="链接标题"
            name="title"
            rules={[{ required: true, message: '请输入链接标题' }]}
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
            label="链接摘要"
            name="description"
            rules={[{ required: true, message: '请输入链接摘要' }]}
          >
            <Input.TextArea
              maxLength={DESC_LEN}
              placeholder={`请输入不超过${DESC_LEN}个字符`}
              rows={4}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="分类标签"
            name="mediaTagList"
            rules={[{ required: false, type: 'array', message: '请输入链接地址' }]}
          >
            <TagSelect
              placeholder="请选择标签"
              style={{ width: "100%" }}
              tagType="material"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="动态通知"
            name="hasInform"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch
              checkedChildren="开启"
              unCheckedChildren="关闭"
            />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="客户标签"
            name="wxTagList"
            rules={[{ required: false, type: 'array', message: '请输入链接地址' }]}
          >
            <TagSelect
              placeholder="请选择标签"
              style={{ width: "100%" }}
            />
          </Form.Item>
        </Col>
      </Row>
    </DrawerForm>
  );
};
export default AddDrawer