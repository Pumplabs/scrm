import { useMemo, useState } from 'react'
import { Tag, DatePicker, Row, Col } from 'antd'
import { CaretDownOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { get, isEmpty } from 'lodash'
import cls from 'classnames'
import moment from 'moment'
import { useModalHook } from 'src/hooks'
import GroupSelect from '../GroupSelect'
import ChooseTagModal, { ChooseTagWithFiltersModal } from '../ChooseTagModal'
import styles from './index.module.less'
import {
  ADVANCE_FILTER_OPTIONS,
  ADVANCE_FILTER,
  ADVANCE_FILTER_NAMES,
} from '../constants'

const { RangePicker } = DatePicker
export default (props) => {
  const { value, onChange } = props
  const isDefinedVals = typeof value !== 'undefined'
  const [filters, setFilters] = useState({})
  const curVals = isDefinedVals ? value : filters

  const handleChange = (nextVals) => {
    if (typeof onChange === 'function') {
      onChange(nextVals)
    }
    if (!isDefinedVals) {
      setFilters(nextVals)
    }
  }

  const triggerChange = (key, val) => {
    handleChange({
      ...curVals,
      [key]: val,
    })
  }

  const onGroupChatChange = (val) => {
    triggerChange('groupChat', val)
  }

  const onTimesChange = (val) => {
    triggerChange('times', val)
  }

  const onIgnoreTagsChange = (val) => triggerChange('ignoreTags', val)

  const onSelectedTagsChange = (val) => triggerChange('tags', val)

  const renderTagFilterOptionName = () => {
    const option = get(curVals, 'tags.option')
    const tags = get(curVals, 'tags.tags')
    const item = ADVANCE_FILTER_OPTIONS.find(
      (ele) => `${ele.value}` === `${option}`
    )
    // 如果标签
    if (!isEmpty(tags) && `${ADVANCE_FILTER.NONE}` !== `${option}`) {
      return item.label
    } else {
      return ''
    }
  }
  // const onTagsFilterChange = (val) => {
  //   triggerChange('tags', {
  //     tags: get(curVals, 'tags.tags'),
  //     option: val
  //   })
  // }

  return (
    <>
      <div className={styles['advance-comp']}>
        <FilterItem label="所在群聊">
          <GroupSelect
            value={curVals.groupChat}
            onChange={onGroupChatChange}
            style={{ width: 288 }}
            placeholder="请选择群聊"
          />
        </FilterItem>
        <FilterItem label="添加时间">
          <RangePicker
            placeholder={['开始日期', '结束日期']}
            onChange={onTimesChange}
            value={curVals.times}
            disabledDate={(current) => current.isAfter(moment(), 'day')}
          />
        </FilterItem>
        <FilterItem label="标签">
          <Row>
            <Col span={12}>
              <TagSelect
                value={curVals.tags}
                onChange={onSelectedTagsChange}
                style={{ width: 288 }}
                tagModal={ChooseTagWithFiltersModal}
                disabledTags={get(curVals, 'ignoreTags.tags')}
              />
            </Col>
            <Col span={12}>
              <span style={{ display: 'inline-block', lineHeight: '32px' }}>
                {renderTagFilterOptionName()}
              </span>
            </Col>
          </Row>
        </FilterItem>
        <FilterItem label="排除客户">
          <TagSelect
            value={curVals.ignoreTags}
            disabledTags={get(curVals, 'tags.tags')}
            onChange={onIgnoreTagsChange}
            style={{ width: 288 }}
          />
        </FilterItem>
      </div>
    </>
  )
}

const FilterItem = ({ label, children, extra }) => {
  return (
    <div className={styles['filter-item']}>
      <span className={styles['filter-item-label']}>{label}</span>
      <div className={styles['filter-item-cotent']}>
        {children}
        <p className={styles['filter-item-extra']}>{extra}</p>
      </div>
    </div>
  )
}

const TagSelect = ({
  value = {},
  onChange,
  className,
  tagModal: TagModal,
  disabledTags = [],
  ...rest
}) => {
  const { openModal, closeModal, visibleMap } = useModalHook(['tags'])

  const { isEmptyValue, tags } = useMemo(() => {
    const tags = Array.isArray(value.tags) ? value.tags : []
    // 有值
    const flag =
      tags.length > 0 || `${ADVANCE_FILTER.NONE}` === `${value.option}`
    return {
      tags,
      isEmptyValue: !flag,
    }
  }, [value])

  const onAddIgnore = () => {
    openModal('tags', value)
  }

  const onChooseTagOk = (values) => {
    onChange(values)
    closeModal()
  }

  const onCloseTag = (e, item) => {
    e.preventDefault()
    onChange({
      ...value,
      tags: tags.filter((ele) => `${ele.id}` !== item.id),
    })
  }

  const onClear = (e) => {
    e.stopPropagation()
    onChange({})
  }

  const renderContent = () => {
    // 如果是没有任何标签
    if (`${ADVANCE_FILTER.NONE}` === `${value.option}`) {
      return ADVANCE_FILTER_NAMES.NONE
    }
    if (tags.length > 0) {
      return tags.map((ele) => (
        <Tag
          key={ele.id}
          className={styles['tag-ele']}
          closable={true}
          onClose={(e) => onCloseTag(e, ele)}>
          {ele.name}
        </Tag>
      ))
    } else {
      const item = ADVANCE_FILTER_OPTIONS.find(
        (ele) => `${ele.value}` === `${value.option}`
      )
      return item ? item.label : ''
    }
  }

  return (
    <>
      {typeof TagModal === 'undefined' ? (
        <ChooseTagModal
          visible={visibleMap.tagsVisible}
          data={value}
          valueIsItem={true}
          disabledTags={disabledTags}
          onCancel={closeModal}
          onOk={onChooseTagOk}
        />
      ) : (
        <TagModal
          visible={visibleMap.tagsVisible}
          data={value}
          valueIsItem={true}
          disabledTags={disabledTags}
          onCancel={closeModal}
          onOk={onChooseTagOk}
        />
      )}
      <div
        className={cls({
          [styles.tagSelect]: true,
          [className]: className,
        })}
        onClick={onAddIgnore}
        {...rest}>
        <div className={styles['tagSelect-content']}>
          {isEmptyValue ? (
            <span className={styles['tagSelect-placeholder']}>请选择标签</span>
          ) : (
            renderContent()
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
    </>
  )
}
