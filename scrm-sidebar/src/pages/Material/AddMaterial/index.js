import { useEffect, useContext } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import { MobXProviderContext, observer } from 'mobx-react'
import { encode } from 'js-base64'
import { toJS } from 'mobx'
import { useBack } from 'src/hooks'
import {
  VideoContent,
  TextContent,
  ImageContent,
  LinkContent,
  FileContent,
} from './FormContent'
import { MATERIAL_TYPE_EN_VALS, MATERIAL_TYPE_CN_VALS } from '../constants'
import styles from './index.module.less'

const Content = ({ type, ...rest }) => {
  switch (type) {
    case `${MATERIAL_TYPE_EN_VALS.VIDEO}`:
      return <VideoContent {...rest} />
    case `${MATERIAL_TYPE_EN_VALS.PICTUER}`:
      return <ImageContent {...rest} />
    case `${MATERIAL_TYPE_EN_VALS.POSTER}`:
      return <ImageContent isPoster={true}  {...rest}/>
    case `${MATERIAL_TYPE_EN_VALS.LINK}`:
      return <LinkContent {...rest} />
    case `${MATERIAL_TYPE_EN_VALS.FILE}`:
      return <FileContent {...rest} />
    case `${MATERIAL_TYPE_EN_VALS.TEXT}`:
      return <TextContent {...rest} />
    default:
      return null
  }
}
export default observer(() => {
  const [searchParams] = useSearchParams()
  const type = searchParams.get('type')
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const { ModifyStore } = useContext(MobXProviderContext)
  const materialFormData = toJS(ModifyStore.addMaterialData)
  const { materialTags, customerTags } = materialFormData
  const backUrl = `/materialList?tab=${type}`
  const currentPath = `${pathname}${search}`
  const onBack = () => {
    ModifyStore.clearMaterialData()
    navigate(backUrl)
  }

  useBack({
    onBack,
  })
  useEffect(() => {
    const typeName = MATERIAL_TYPE_CN_VALS[type] || ''
    document.title = `添加${typeName}素材`
  }, [type])

  const onSelectMaterialTag = () => {
    const mode = 'materialCategoryTag'
    ModifyStore.updateTagData('oldValue', materialTags)
    navigate(`/selectTag?lastPath=${encode(currentPath)}&mode=${mode}`)
  }

  const onRemoveMaterialTag = (tagItem) => {
    const arr = materialTags.filter((ele) => ele.id !== tagItem.id)
    ModifyStore.updateMaterialData('materialTags', arr)
  }

  const onSelectCustomerTag = () => {
    const mode = 'materialCustomerTag'
    ModifyStore.updateTagData('oldValue', customerTags)
    navigate(`/selectTag?lastPath=${encode(currentPath)}&mode=${mode}`)
  }

  const onRemoveCustomerTag = (tagItem) => {
    const arr = materialTags.filter((ele) => ele.id !== tagItem.id)
    ModifyStore.updateMaterialData('customerTags', arr)
  }

  return (
    <div className={styles['page']}>
      <Content
        type={type}
        onBack={onBack}
        onSelectMaterialTag={onSelectMaterialTag}
        onRemoveMaterialTag={onRemoveMaterialTag}
        onSelectCustomerTag={onSelectCustomerTag}
        onRemoveCustomerTag={onRemoveCustomerTag}
      />
    </div>
  )
})
