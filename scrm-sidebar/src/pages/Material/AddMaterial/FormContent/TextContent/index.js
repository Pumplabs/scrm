import { useContext, useEffect } from 'react'
import { Form, Button, Input, TextArea } from 'antd-mobile'
import { MobXProviderContext, observer } from 'mobx-react'
import { toJS } from 'mobx'
import { useRequest } from 'ahooks'
import TagSection from 'components/TagSection'
import MyForm from '../../MyForm'
import FormLabel from '../../FormLabel'
import { AddTrackMaterial } from 'services/modules/material'
import { actionRequestHookOptions } from 'services/utils'
import { MATERIAL_TYPE_EN_VALS } from 'src/pages/Material/constants'

const FormItem = MyForm.Item
export default observer((props) => {
  const [form] = Form.useForm()
  const { ModifyStore } = useContext(MobXProviderContext)
  const materialFormData = toJS(ModifyStore.addMaterialData)
  const {
    onSelectMaterialTag,
    onRemoveMaterialTag,
    onBack
  } = props
  const { materialTags } = materialFormData
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
      const { title, content } = toJS(ModifyStore.addMaterialData)
      form.setFieldsValue({
        title,
        content,
      })
    }
  }, [ModifyStore.addMaterialData.init])

  const onValuesChange = (vals) => {
    ModifyStore.updateMaterialData(vals)
  }

  const onFinish = (values) => {
    const params = {
      mediaTagList: materialTags.map((ele) => ele.id),
      ...values,
      hasInform: false,
      type: MATERIAL_TYPE_EN_VALS.TEXT,
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
        name="title"
        required={false}
        label={<FormLabel label={`文本名称`} extra={`文本小于20字`} />}
        rules={[{ required: true, message: `文本名称不能为空` }]}>
        <Input placeholder={`请输入文本名称`} maxLength={20}
         clearable={true}
         />
      </FormItem>
      <FormItem
        name="content"
        required={false}
        label={<FormLabel label="文本内容" extra="不超过500字" />}
        rules={[{ required: true, message: `文本内容不能为空` }]}
        >
        <TextArea
          placeholder="请输入文本内容"
          maxLength={500}
          showCount={true}
          rows={6}
          autoSize
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
