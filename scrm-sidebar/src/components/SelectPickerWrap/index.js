import { forwardRef, useMemo } from 'react'
import { isEmpty } from 'lodash'
import { RightOutline, CloseCircleFill } from 'antd-mobile-icons'

import { useModalHook } from 'src/hooks'
import PickerPopup from './PickerPopup'
import RadioGroupList from 'components/RadioGroupList'

import styles from './index.module.less'

/**
 * @param {string} type 类型 radio
 */
export default forwardRef(
  (
    {
      children,
      onSelect,
      renderContent,
      placeholder,
      value,
      onChange,
      disabled,
      onClear,
      type = '',
      eleProps = {},
      ...rest
    },
    ref
  ) => {
    const { openModal, closeModal, visibleMap, modalInfo } = useModalHook([
      'picker',
    ])

    const renderCustomComp = () => {
      if (typeof renderContent === 'function') {
        return renderContent(value, { onChange })
      }
      if (type === 'radio') {
        const { label: labelKey = 'label', value: valueKey = 'value' } = eleProps.fieldNames || {}
        return eleProps.list?.find(ele => ele[valueKey] === value)?.[labelKey]
      }
      return value
    }
    const handleClear = (e) => {
      e.stopPropagation()
      if (typeof onClear === 'function') {
        onClear({ value, onChange })
      } else {
        onChange('')
      }
    }
    const handleSelect = () => {
      if (typeof onSelect === 'function' && !disabled) {
        onSelect(value)
      }
      if (type === 'radio') {
        openModal('picker', {
          value,
        })
      }
    }

    const onPickerOk = (val) => {
      closeModal()
      if (typeof onChange === 'function') {
        onChange(val)
      }
    }

    const valueIsEmpty = useMemo(() => {
      if (value === 0) {
        return false
      }
      if (value) {
        return typeof value === 'object' ? isEmpty(value) : false
      } else {
        return true
      }
    }, [value])
    return (
      <>
        <PickerPopup
          visible={visibleMap.pickerVisible}
          value={modalInfo.data?.value}
          onOk={onPickerOk}
          onCancel={closeModal}
          title={placeholder}
          render={(renderProps) => {
            if (type === 'radio') {
              return <RadioGroupList {...renderProps} {...eleProps} />
            } else {
              return null
            }
          }}
        />
        <div
          className={styles['select-item']}
          ref={ref}
          {...rest}
          onClick={handleSelect}>
          <div className={styles['select-content']}>
            {valueIsEmpty ? (
              <span className={styles['select-placeholder']}>
                {placeholder}
              </span>
            ) : children ? (
              children
            ) : renderCustomComp()}
          </div>
          {!disabled ? (
            <div className={styles['select-icon']}>
              {valueIsEmpty ? (
                <RightOutline className={styles['arrow-icon']} />
              ) : (
                <CloseCircleFill onClick={handleClear} />
              )}
            </div>
          ) : null}
        </div>
      </>
    )
  }
)
