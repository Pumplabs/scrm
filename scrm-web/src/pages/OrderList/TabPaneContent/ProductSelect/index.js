import { forwardRef, useMemo } from 'react'
import ModalContext from 'components/MySelect/ModalContext'
import MySelectModal from './ChooseModal'
import { useModalHook } from 'src/hooks'
import { GetProductList } from 'services/modules/productList'

export default forwardRef((props, ref) => {
  const {
    value,
    onChange,
    type = 'user',
    allowEmpty,
    children,
    disabledValues = [],
    onlyChooseUser,
    max,
    baseSearchParams
  } = props

  const valueKey = 'id'
  const { openModal, closeModal, visibleMap } = useModalHook(['tags'])

  const { isEmptyValue, tags } = useMemo(() => {
    const tags = Array.isArray(value) ? value : []
    const flag = tags.length > 0
    return {
      tags,
      isEmptyValue: !flag,
    }
  }, [value])

  const triggerChange = (val) => {
    if (typeof onChange === 'function') {
      onChange(val)
    }
  }

  const onAddTags = () => {
    openModal('tags', value)
  }

  const onChooseTagOk = (val) => {
    triggerChange(val)
    closeModal()
  }

  const onCloseTag = (item) => {
    const nextTags = tags.filter((ele) => `${ele[valueKey]}` !== item[valueKey])
    triggerChange(nextTags)
  }

  const updateSingle = (item) => {
    const nextTags = tags.map(ele => `${ele[valueKey]}` === `${item[valueKey]}` ? item : ele)
    triggerChange(nextTags)
  }

  return (
    <ModalContext.Provider value={{ visible: visibleMap.tagsVisible }}>
      <div ref={ref}>
        <MySelectModal
          title="选择产品"
          selectedList={tags}
          visible={visibleMap.tagsVisible}
          onCancel={closeModal}
          onOk={onChooseTagOk}
          valueKey={valueKey}
          allowEmpty={allowEmpty}
          disableArr={disabledValues}
          type={type}
          onlyChooseUser={onlyChooseUser}
          max={max}
          request={GetProductList}
          baseSearchParams={baseSearchParams}
        />
        {typeof children === 'function'
          ? children({
              tags,
              onCloseTag,
              isEmptyValue,
              onAddTags,
              updateTag: updateSingle
            })
          : null}
      </div>
    </ModalContext.Provider>
  )
})
