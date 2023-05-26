import React, { useRef, useMemo } from 'react';
import { Form, Input, Row, Col, Switch, message } from 'antd';
import { get } from 'lodash'
import TagSelect from 'components/TagSelect'
import DrawerForm from 'components/DrawerForm'
import CommonUpload, { UploadFileBtn } from 'components/CommonUpload'
import { TITLE_LEN, DESC_LEN } from '../../constants'
import styles from './index.module.less'

const VIDEO_FILE_TYPE = ['.mp4']
const AddDrawer = (props) => {
  const { data = {}, modalType, onOk, visible, ...rest } = props
  const formRef = useRef()
  const formInitValues = useMemo(() => {
    if (visible && modalType === 'edit') {
      return {
        files: [{
          uid: data.fileId,
          isOld: true,
          name: `${data.title}.${data.mediaSuf}`
        }],
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

  const onRefillFileName = () => {
    if (!formRef.current) {
      return false;
    }
    const item = formRef.current.getFieldValue('files')
    if (item && item[0]) {
      formRef.current.setFields([{
        name: 'title',
        error: [],
        value: item[0].name.substr(0, TITLE_LEN)
      }])
    } else {
      message.warning('请先上传文件')
    }
  }


  const getForm = (form) => {
    formRef.current = form
  }

  const onFileChange = (e) => {
    const item = e.target
    if (!formRef.current) {
      return false;
    }
    if (item.files.length) {
      const file = item.files[0]
      const curTitleValue = formRef.current.getFieldValue('title')
      if (!curTitleValue) {
        formRef.current.setFields([{
          name: 'title',
          value: file.name.substr(0, TITLE_LEN)
        }])
      }
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
      getForm={getForm}
    >
      <Row>
        <Col span={24}>
          <Form.Item
            label="上传视频"
            name="files"
            valuePropName="fileList"
            getValueFromEvent={normFile}
            rules={[
              {
                required: true,
                type: 'array',
                message: "请上传视频"
              }
            ]}
            extra={
              <div>
                1. 仅支持上传{VIDEO_FILE_TYPE.join()}类型文件
                <br />
                2. 文件大小不超过10M
              </div>
            }
          >
            <CommonUpload
              maxCount={1}
              validOptions={{
                maxFileSize: 10,
                maxFileTotalLen: 1,
                acceptTypeList: VIDEO_FILE_TYPE
              }}
              onBeforeUpload={(_, flag) => flag}
            >
              <UploadFileBtn title="上传文件" />
            </CommonUpload>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="视频标题"
            name="title"
            rules={[{ required: true, message: '请输入视频标题' }]}
          >
            <Input
              maxLength={TITLE_LEN}
              placeholder={`请输入不超过${TITLE_LEN}个字符`}
              allowClear={true}
              className={styles['file-name-input']}
            />
          </Form.Item>
          <span
            onClick={onRefillFileName}
            className={styles['refill-action']}
          >填入文件名称</span>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="视频描述"
            name="description"
            rules={[{ required: true, message: '请输入视频描述' }]}
          >
            <Input.TextArea
              rows={4}
              maxLength={DESC_LEN}
              placeholder={`请输入不超过${DESC_LEN}个字符`}
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
            rules={[{ required: false, type: 'array', message: '请选择客户标签' }]}
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