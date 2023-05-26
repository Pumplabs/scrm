import { useContext, useEffect } from 'react'
import { Form, Button, Input, TextArea, Ellipsis } from 'antd-mobile'
import cls from 'classnames'
import { MobXProviderContext, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRequest } from 'ahooks'
import { get } from 'lodash'
import { FileOutline } from 'antd-mobile-icons'
import { UploadFormItem } from 'components/UploadFile'
import TagSection from 'components/TagSection'
import MyForm from '../../MyForm'
import FormLabel from '../../FormLabel'
import NoticeItem from '../../NoticeItem'
import { AddTrackMaterial } from 'services/modules/material'
import { actionRequestHookOptions } from 'services/utils'
import { MATERIAL_TYPE_EN_VALS } from 'src/pages/Material/constants'
import { ATTACH_TYPES } from 'components/UploadFile/constants'
import styles from './index.module.less'

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
      const { title, description, files, link } = toJS(
        ModifyStore.addMaterialData
      )
      form.setFieldsValue({
        files,
        title,
        link,
        description,
      })
    }
  }, [ModifyStore.addMaterialData.init])

  const onValuesChange = (vals) => {
    ModifyStore.updateMaterialData(vals)
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
      type: MATERIAL_TYPE_EN_VALS.LINK,
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
        name="link"
        label={<FormLabel label="链接地址" extra="格式:http://xxx.xx" />}
        rules={[
          {
            required: true,
            message: '请输入链接地址',
          },
          {
            type: 'url',
            message: '请输入链接地址',
          },
        ]}>
        <TextArea placeholder="请输入链接地址" rows={6} autoSize />
      </MyForm.Item>
      <MyForm.Item
        name="files"
        className={cls({
          [styles['file-form-item']]: true,
        })}
        label={
          <FormLabel
            label="上传封面"
            extra="封面大小不能超过10M且为jpg格式或png格式"
          />
        }
        rules={[
          {
            required: true,
            message: '请上传封面',
          },
          {
            type: 'array',
          },
        ]}
        valuePropName="fileList"
        >
        <UploadFormItem
          showLabel={false}
          acceptTypeList={['.jpg', '.png']}
          className={styles['file-upload']}
          maxFileCount={1}
          attachmentConfig={{
            showTrackMaterial: false,
            showNormalMaterial: false,
          }}
        />
      </MyForm.Item>
      <MyForm.Item
        name="title"
        label={<FormLabel label="链接标题" extra="链接标题小于20字" />}
        rules={[{ required: true, message: '链接标题不能为空' }]}>
        <Input placeholder="请输入链接标题" maxLength={20} />
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
        label={<FormLabel label="链接摘要" extra="不超过120字" />}
        rules={[
          {
            required: true,
            message: '请输入链接摘要',
          },
        ]}>
        <TextArea
          placeholder="请输入链接摘要"
          maxLength={120}
          showCount={true}
          rows={6}
        />
      </MyForm.Item>
      <MyForm.Item>
        <NoticeItem
          checked={materialFormData.hasInform}
          onChange={onSwitchChange}
        />
      </MyForm.Item>
      <MyForm.Item
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
