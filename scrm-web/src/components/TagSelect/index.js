import { forwardRef, Fragment, useMemo } from 'react'
import { Tag, Button } from 'antd'
import { isPlainObject } from 'lodash'
import cls from 'classnames'
import {
  CaretDownOutlined,
  PlusOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons'
import ChooseTagModal, { ModalContent } from './ChooseTagModal'
import { useModalHook } from 'src/hooks'
import styles from './index.module.less'

/**
 * 标签选择
 * @param {ReactNode} tagModal 标签弹窗
 * @param {Array} disabledTags 禁用标签
 * @param {Boolean} allowAddTag 是否允许新增标签
 * @param {Boolean} allowAddGroup 是否允许新增分组
 * @param {Number} maxCount 最多可选择标签数
 * @param {String} mode
 * @returns
 */
const TagSelect = forwardRef((props, ref) => {
  const {
    value = [],
    onChange,
    className,
    tagModal: TagModal,
    disabledTags = [],
    tagType,
    allowAddTag,
    allowAddGroup,
    maxCount,
    mode,
    ...rest
  } = props
  const { openModal, closeModal, visibleMap } = useModalHook(['tags'])

  const { isEmptyValue, tags, modalData, isObjectValue } = useMemo(() => {
    let tags = []
    const isObjectValue = isPlainObject(value)
    if (isObjectValue) {
      tags = Array.isArray(value.tags) ? value.tags : []
    } else {
      tags = Array.isArray(value) ? value : []
    }
    // 有值
    const flag = tags.length > 0
    return {
      tags,
      isEmptyValue: !flag,
      isObjectValue,
      modalData: isObjectValue
        ? value
        : {
            tags,
          },
    }
  }, [value])

  const onOpenChooseTag = (e) => {
    e.stopPropagation()
    openModal('tags')
  }

  const triggerChange = (values = {}) => {
    let nextValue = values
    if (Array.isArray(values)) {
      nextValue =
        values.length === 0 || !isObjectValue
          ? { tags: values }
          : {
              ...value,
              tags: values,
            }
    }
    onChange(isObjectValue ? nextValue : nextValue.tags)
  }

  const onChooseTagOk = (values) => {
    triggerChange(values)
    closeModal()
  }

  const onCloseTag = (e, item) => {
    e.preventDefault()
    const nextTags = tags.filter((ele) => `${ele.id}` !== item.id)
    triggerChange(nextTags)
  }

  const onClear = (e) => {
    e.stopPropagation()
    triggerChange({})
  }

  return (
    <Fragment>
      {typeof TagModal === 'undefined' ? (
        <ChooseTagModal
          allowAddTag={allowAddTag}
          allowAddGroup={allowAddGroup}
          visible={visibleMap.tagsVisible}
          data={modalData}
          tagType={tagType}
          valueIsItem={true}
          disabledTags={disabledTags}
          maxCount={maxCount}
          className={'wy-tag-select-modal'}
          onCancel={closeModal}
          onOk={onChooseTagOk}
        />
      ) : (
        <TagModal
          visible={visibleMap.tagsVisible}
          data={modalData}
          valueIsItem={true}
          className={'wy-tag-select-modal'}
          disabledTags={disabledTags}
          onCancel={closeModal}
          onOk={onChooseTagOk}
        />
      )}
      <TagSection
        mode={mode}
        onClear={onClear}
        className={className}
        tags={tags}
        onCloseTag={onCloseTag}
        isEmptyValue={isEmptyValue}
        onOpenChooseTag={onOpenChooseTag}
        {...rest}
      />
    </Fragment>
  )
})

const TagSection = ({ mode, ...rest }) => {
  if (mode === 'input') {
    return <InputSection {...rest} />
  } else {
    return <AreaSection {...rest} />
  }
}

const InputSection = forwardRef((props, ref) => {
  const {
    onClear,
    className,
    tags = [],
    onOpenChooseTag,
    onCloseTag,
    isEmptyValue,
    ...rest
  } = props
  return (
    <div
      ref={ref}
      className={cls({
        [styles.tagSelect]: true,
        'wy-tag-select': true,
        [className]: className,
      })}
      {...rest}
      onClick={onOpenChooseTag}>
      <div className={styles['tagSelect-content']}>
        {isEmptyValue ? (
          <span className={styles['tagSelect-placeholder']}>请选择标签</span>
        ) : (
          tags.map((ele) => (
            <Tag
              key={ele.id}
              className={styles['tag-ele']}
              closable={true}
              onClose={(e) => onCloseTag(e, ele)}>
              {ele.name}
            </Tag>
          ))
        )}
      </div>
      {isEmptyValue ? (
        <CaretDownOutlined className={styles['tagSelect-arrow']} />
      ) : (
        <CloseCircleOutlined
          onClick={onClear}
          className={styles['tagSelect-clear']}
        />
      )}
    </div>
  )
})

const AreaSection = forwardRef((props, ref) => {
  const {
    onClear,
    onOpenChooseTag,
    className,
    tags = [],
    onCloseTag,
    isEmptyValue,
    ...rest
  } = props

  return (
    <div
      ref={ref}
      className={cls({
        [styles['area-section']]: true,
        'wy-tag-select': true,
        [className]: className,
      })}
      {...rest}>
      <Button
        onClick={onOpenChooseTag}
        className={styles['add-btn']}
        icon={<PlusOutlined/>}
        ghost
        type="primary"
      >
        选择标签
      </Button>
      {tags.length ? (
        <div className={styles['tags-section']}>
          {tags.map((ele) => (
            <Tag
              key={ele.id}
              className={styles['tag-ele']}
              closable={true}
              onClose={(e) => onCloseTag(e, ele)}>
              {ele.name}
            </Tag>
          ))}
        </div>
      ) : null}
    </div>
  )
})

export default TagSelect
export { default as ChooseTagModal } from './ChooseTagModal'
export { ModalContent }
