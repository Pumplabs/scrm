import { useContext, useMemo, useState } from 'react'
import { NavBar, Button } from 'antd-mobile'
import { toJS } from 'mobx'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { decode } from 'js-base64'
import { observer, MobXProviderContext } from 'mobx-react'
import PageContent from 'components/PageContent'
import { ContentWrap } from 'components/SelectedTagModal'
import { useBack } from 'src/hooks'
import styles from './index.module.less'

export default observer(() => {
  const { ModifyStore } = useContext(MobXProviderContext)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const tagType = searchParams.get('mode') || 'customer'
  const [selectedTags, setSelectedTags] = useState([])
  const backUrl = useMemo(() => {
    const lastPath = decode(searchParams.get('lastPath'))
    return lastPath
      ? lastPath
      : tagType === 'customer'
      ? '/customerDetail'
      : '/groupDetail'
  }, [searchParams, tagType])

  useBack({
    backUrl,
  })

  const onBack = () => {
    navigate(backUrl)
  }

  const onOk = () => {
    ModifyStore.updateTagData('newValue', selectedTags)
    ModifyStore.updateTagData('hasChange', true)
    ModifyStore.updateTagData('mode', tagType)
    onBack()
  }

  const onRemoveTag = (item) => {
    handleTags(false, item)
  }

  const handleTags = (nextCheck, tagItem) => {
    setSelectedTags((arr) =>
      nextCheck
        ? [...arr, tagItem]
        : arr.filter((item) => item.id !== tagItem.id)
    )
  }

  const { oldSelectedTag, oldIds } = useMemo(() => {
    const data = toJS(ModifyStore.tagData)
    const ids = data.oldValue.map((item) => item.id)
    setSelectedTags(data.oldValue)
    return {
      oldSelectedTag: data.oldValue,
      oldIds: ids,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ModifyStore.tagData])

  const hasEdit = useMemo(() => {
    if (selectedTags.length === oldIds.length) {
      return selectedTags.some((item) => !oldIds.includes(item.id))
    } else {
      return true
    }
  }, [selectedTags, oldIds])

  return (
    <PageContent
      header={
        <NavBar
          right={
            <Button
              onClick={onOk}
              color="primary"
              fill="solid"
              disabled={!hasEdit}
              size="small">
              确定
            </Button>
          }
          onBack={onBack}>
          选择标签
        </NavBar>
      }>
      <div className={styles['tag-content']}>
        <ContentWrap
          visible={true}
          value={oldSelectedTag}
          tagType={tagType}
          onCheckTag={handleTags}
          selectedTags={selectedTags}
          onRemoveTag={onRemoveTag}
        />
      </div>
    </PageContent>
  )
})
