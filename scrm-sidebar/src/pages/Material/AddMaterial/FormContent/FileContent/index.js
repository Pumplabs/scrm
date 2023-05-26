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
import { AddTrackMaterial } from 'services/modules/material'
import NoticeItem from '../../NoticeItem'
import { actionRequestHookOptions } from 'services/utils'
import { MATERIAL_TYPE_EN_VALS } from 'src/pages/Material/constants'
import { handleFormValsChange } from '../utils'
import styles from './index.module.less'

const fileTypes = ['.pdf', '.doc', '.docx', '.xls', '.ppt', '.xlsx', '.pptx']

const FormItem = MyForm.Item
export default observer((props) => {
  const [form] = Form.useForm()
  const { ModifyStore } = useContext(MobXProviderContext)
  const materialFormData = toJS(ModifyStore.addMaterialData)
  const {
    onRemoveCustomerTag,
    onSelectCustomerTag,
    onSelectMaterialTag,
    onRemoveMaterialTag,
    onBack,
  } = props
  const { materialTags, customerTags } = materialFormData
  const { run: runAddTrackMaterial } = useRequest(AddTrackMaterial, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '添加',
      successFn: onBack,
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
      type: MATERIAL_TYPE_EN_VALS.FILE,
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
      <FormItem
        name="files"
        className={cls({
          [styles['file-form-item']]: true,
        })}
        label={<FormLabel label="上传文件" extra="文件大小不能超过20M" />}
        rules={[
          {
            required: true,
            message: '请上传文件',
          },
          {
            type: 'array',
          },
        ]}
        valuePropName="fileList">
        <UploadFormItem
          showLabel={false}
          acceptTypeList={fileTypes}
          className={styles['file-upload']}
          maxFileCount={1}
          attachmentConfig={{
            showTrackMaterial: false,
            showNormalMaterial: false,
          }}
        />
      </FormItem>
      <FormItem
        name="title"
        label={<FormLabel label="文件名称" extra="文件名称小于20字" />}
        rules={[{ required: true, message: '文件名称不能为空' }]}>
        <Input placeholder="请输入文件名称" maxLength={20} clearable={true} />
      </FormItem>
      <FormItem label={<FormLabel label="分类标签" />}>
        <TagSection
          tagsArr={materialTags}
          onSelectTag={onSelectMaterialTag}
          onRemoveTag={onRemoveMaterialTag}
        />
      </FormItem>
      <FormItem
        name="description"
        required={false}
        label={<FormLabel label="文件描述" extra="不超过120字" />}>
        <TextArea
          placeholder="请输入文件描述"
          maxLength={120}
          showCount={true}
          rows={6}
        />
      </FormItem>
      <FormItem>
        <NoticeItem
          checked={materialFormData.hasInform}
          onChange={onSwitchChange}
        />
      </FormItem>
      <FormItem
        label={
          <FormLabel label="客户标签" extra="给打开素材的客户自动打上的标签" />
        }>
        <TagSection
          tagsArr={customerTags}
          onSelectTag={onSelectCustomerTag}
          onRemoveTag={onRemoveCustomerTag}
        />
      </FormItem>
    </MyForm>
  )
})
