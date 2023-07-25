import { useContext, useEffect } from 'react'
import { Form, Button, Input } from 'antd-mobile'
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
import { actionRequestHookOptions } from 'services/utils'
import { MATERIAL_TYPE_EN_VALS } from 'src/pages/Material/constants'
import { handleFormValsChange } from '../utils'
import styles from './index.module.less'

const FormItem = MyForm.Item
export default observer((props) => {
  const [form] = Form.useForm()
  const { ModifyStore } = useContext(MobXProviderContext)
  const materialFormData = toJS(ModifyStore.addMaterialData)
  const { isPoster, onBack, onSelectMaterialTag, onRemoveMaterialTag } = props
  const { materialTags } = materialFormData

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
      const { title, files } = toJS(ModifyStore.addMaterialData)
      form.setFieldsValue({
        files,
        title,
      })
    }
  }, [ModifyStore.addMaterialData.init])

  const onValuesChange = (vals) => {
    const nextVals = handleFormValsChange(vals, form)
    ModifyStore.updateMaterialData(nextVals)
  }

  const onFinish = (values) => {
    const { files, ...rest } = values
    const [file] = files
    const fileId = get(file, 'content.fileId')
    const params = {
      fileId,
      mediaTagList: materialTags.map((ele) => ele.id),
      hasInform: false,
      ...rest,
      type: isPoster
        ? MATERIAL_TYPE_EN_VALS.POSTER
        : MATERIAL_TYPE_EN_VALS.PICTUER,
    }
    runAddTrackMaterial(params)
  }

  const categoryName = isPoster ? '海报' : '图片'
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
        required={false}
        className={cls({
          [styles['file-form-item']]: true,
        })}
        label={
          <FormLabel
            label={`上传${categoryName}`}
            extra="文件大小不能超过10M且格式为jpg,png"
          />
        }
        rules={[
          {
            required: true,
            message: `请上传${categoryName}`,
          },
          {
            type: 'array',
          },
        ]}
        valuePropName="fileList">
        <UploadFormItem
          showLabel={false}
          acceptTypeList={['.jpg', '.png', '.jpeg']}
          className={styles['video-upload']}
          maxFileCount={1}
          attachmentConfig={{
            showTrackMaterial: false,
            showNormalMaterial: false,
          }}
        />
      </FormItem>
      <FormItem
        name="title"
        required={false}
        label={
          <FormLabel
            label={`${categoryName}名称`}
            extra={`${categoryName}名称小于20字`}
          />
        }
        rules={[{ required: true, message: `${categoryName}名称不能为空` }]}>
        <Input placeholder={`请输入${categoryName}名称`} maxLength={20}
          clearable={true}
        />
      </FormItem>
      <FormItem label={<FormLabel label="分类标签" />}>
        <TagSection
          tagsArr={materialTags}
          onSelectTag={onSelectMaterialTag}
          onRemoveTag={onRemoveMaterialTag}
        />
      </FormItem>
    </MyForm>
  )
})
