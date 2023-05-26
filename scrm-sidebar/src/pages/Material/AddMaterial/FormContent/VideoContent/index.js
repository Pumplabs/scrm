import { useContext, useEffect } from 'react'
import { Form, Button, Input, TextArea } from 'antd-mobile'
import cls from 'classnames'
import { MobXProviderContext, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRequest } from 'ahooks'
import { get } from 'lodash'
import { UploadFormItem } from 'components/UploadFile'
import TagSection from 'components/TagSection'
import MyForm from '../../MyForm'
import FormLabel from '../../FormLabel'
import NoticeItem from '../../NoticeItem'
import { AddTrackMaterial } from 'services/modules/material'
import { actionRequestHookOptions } from 'services/utils'
import { MATERIAL_TYPE_EN_VALS } from 'src/pages/Material/constants'
import { handleFormValsChange } from '../utils'
import styles from './index.module.less'

export default observer((props) => {
  const {
    onRemoveCustomerTag,
    onSelectCustomerTag,
    onSelectMaterialTag,
    onRemoveMaterialTag,
    onBack
  } = props
  const [form] = Form.useForm()
  const { ModifyStore } = useContext(MobXProviderContext)
  const materialFormData = toJS(ModifyStore.addMaterialData)
  const { materialTags, customerTags } = materialFormData
  const { run: runAddTrackMaterial } = useRequest(AddTrackMaterial, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '添加',
      successFn: onBack
    }),
  })

  useEffect(() => {
    const tagData = toJS(ModifyStore.tagData)
    if (tagData.hasChange) {
      const key =
        tagData.mode === 'materialCustomerTag' ? 'customerTags' : 'materialTags'
      ModifyStore.updateMaterialData(key, tagData.newValue)
      ModifyStore.clearTagData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ModifyStore.tagData.hasChange])

  useEffect(() => {
    if (!ModifyStore.addMaterialData.init) {
      const { title, description, files } = toJS(ModifyStore.addMaterialData)
      form.setFieldsValue({
        files,
        title,
        description,
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ModifyStore.addMaterialData.init])

  const onValuesChange = (vals) => {
    const nextVals = handleFormValsChange(vals, form)
    ModifyStore.updateMaterialData(nextVals)
  }

  const onSwitchChange = (flag) => {
    ModifyStore.updateMaterialData('hasInform', flag)
  }

  const onFinish = (values) => {
    const { files, ...rest } = values
    const [file] = files
    const fileId = get(file, 'content.fileId')
    const params = {
      fileId,
      mediaTagList: materialTags.map((ele) => ele.id),
      wxTagList: customerTags.map((ele) => ele.id),
      hasInform: materialFormData.hasInform,
      ...rest,
      type: MATERIAL_TYPE_EN_VALS.VIDEO,
    }
    runAddTrackMaterial(params)
  }

  return (
    <MyForm
      form={form}
      mode="card"
      onValuesChange={onValuesChange}
      onFinish={onFinish}
      footer={
        <Button block type="submit" color="primary" size="large">
          添加素材
        </Button>
      }>
      <MyForm.Item
        name="files"
        className={cls({
          [styles['video-form-item']]: true,
        })}
        label={
          <FormLabel label="上传视频" extra="视频大小不能超过20M且为mp4格式" />
        }
        rules={[
          {
            required: true,
            message: '请上传视频',
          },
          {
            type: 'array',
          },
        ]}
        valuePropName="fileList">
        <UploadFormItem
          showLabel={false}
          acceptTypeList={['.mp4']}
          className={styles['video-upload']}
          maxFileCount={1}
          attachmentConfig={{
            showTrackMaterial: false,
            showNormalMaterial: false,
          }}
        />
      </MyForm.Item>
      <MyForm.Item
        name="title"
        label={<FormLabel label="视频名称" extra="视频名称小于20字" />}
        rules={[{ required: true, message: '视频名称不能为空' }]}>
        <Input placeholder="请输入视频名称" maxLength={20}
        clearable={true}
        />
      </MyForm.Item>
      <MyForm.Item label={<FormLabel label="分类标签" />}>
        <TagSection
          tagsArr={materialTags}
          onSelectTag={onSelectMaterialTag}
          onRemoveTag={onRemoveMaterialTag}
        />
      </MyForm.Item>
      <MyForm.Item
        name="description"
        label={<FormLabel label="视频描述" extra="不超过120字" />}
        rules={[{ required: true, message: `视频描述不能为空` }]}
        >
        <TextArea
          placeholder="请输入视频描述"
          maxLength={120}
          showCount={true}
          rows={6}
        />
      </MyForm.Item>
      <MyForm.Item className={styles['form-item']}>
        <NoticeItem
          checked={materialFormData.hasInform}
          onChange={onSwitchChange}
        />
      </MyForm.Item>
      <MyForm.Item
        required={false}
        label={
          <FormLabel label="客户标签" extra="给打开素材的客户自动打上的标签" />
        }>
        <TagSection
          tagsArr={customerTags}
          onSelectTag={onSelectCustomerTag}
          onRemoveTag={onRemoveCustomerTag}
        />
      </MyForm.Item>
    </MyForm>
  )
})
