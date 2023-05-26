import { forwardRef, useMemo } from 'react'
import { Tag, Button } from 'antd'
import {
  PlusOutlined,
  CloseCircleOutlined,
  HomeOutlined,
  ApartmentOutlined,
} from '@ant-design/icons'
import cls from 'classnames'
import { isEmpty } from 'lodash'
import OpenEle from 'components/OpenEle'
import GroupChatCell from 'components/GroupChatCell'
import ModalContext from './ModalContext'
import MySelectModal from './components/MySelectModal'
import UserTag from 'components/UserTag'
import { useModalHook } from 'src/hooks'
import { UNSET_GROUP_NAME } from 'utils/constants'
import defaultAvatorUrl from 'assets/images/defaultAvator.jpg'
import { TYPES, DEFAULT_VALUE_KEY } from './constants'
import styles from './index.module.less'

/**
 * 选择
 * @param {Array} value
 * @param {function} onChange
 * @param {String} title
 * @param {String} type 类型 TYPES
 * @param {Boolean} allowEmpty 是否允许值为空
 * @param {Array} disabledValues 禁止勾选的值
 * @param {Object} baseSearchParams 查询条件
 */
export default forwardRef((props, ref) => {
  const {
    value,
    onChange,
    title,
    type = 'user',
    allowEmpty,
    children,
    fileldNames = {},
    disabledValues = [],
    onlyChooseUser,
    request,
    max,
    baseSearchParams,
    ...rest
  } = props

  const valueKey = useMemo(() => {
    if (!isEmpty(fileldNames)) {
      return fileldNames.value
    } else {
      return DEFAULT_VALUE_KEY[type]
    }
  }, [fileldNames, type])

  const { openModal, closeModal, visibleMap } = useModalHook(['tags'])

  const { isEmptyValue, tags } = useMemo(() => {
    const tags = Array.isArray(value) ? value : []
    // 有值
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

  const onAddTags = (e) => {
    e.stopPropagation()
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

  const updateTags = (arr) => {
    triggerChange(arr)
  }
  const onClear = (e) => {
    e.stopPropagation()
    triggerChange([])
  }

  const renderTagTitle = (item) => {
    if (type === TYPES.USER) {
      const type = item.isDep ? 'departmentName' : 'userName'
      return <OpenEle type={type} openid={item.name} />
    } else if (type === TYPES.GROUP) {
      return item.name ? item.name : UNSET_GROUP_NAME
    } else {
      return item.name
    }
  }

  return (
    <ModalContext.Provider value={{ visible: visibleMap.tagsVisible }}>
      <div ref={ref}>
        <MySelectModal
          selectedList={tags}
          visible={visibleMap.tagsVisible}
          onCancel={closeModal}
          onOk={onChooseTagOk}
          title={title}
          valueKey={valueKey}
          allowEmpty={allowEmpty}
          disableArr={disabledValues}
          type={type}
          onlyChooseUser={onlyChooseUser}
          max={max}
          baseSearchParams={baseSearchParams}
        />
        {typeof children === 'function' ? (
          children({
            tags,
            onCloseTag,
            isEmptyValue,
            onAddTags,
            updateTags,
          })
        ) : (
          <InputEle
            valueKey={valueKey}
            onAddTags={onAddTags}
            tags={tags}
            isEmptyValue={isEmptyValue}
            onCloseTag={onCloseTag}
            onClear={onClear}
            type={type}
            title={title}
            renderTitle={renderTagTitle}
            {...rest}
          />
        )}
      </div>
    </ModalContext.Provider>
  )
})
const InputEle = (props) => {
  const {
    className,
    valueKey,
    renderTitle,
    type,
    title,
    tags = [],
    onCloseTag,
    onClear,
    isEmptyValue,
    onAddTags,
    placeholder,
    ...rest
  } = props

  return (
    <div
      className={cls({
        [styles.tagSelect]: true,
        [className]: className,
      })}
      {...rest}>
      <Button
        icon={<PlusOutlined />}
        className={styles['choose-btn']}
        onClick={onAddTags}
        type="primary"
        ghost>
        {title}
      </Button>
      {Array.isArray(tags) && tags.length ? (
        <div className={styles['mySelect-content']}>
          {tags.map((item) => (
            <TagItem
              key={item.id}
              onClose={() => onCloseTag(item)}
              closeable={true}>
              <TagItemContent data={item} type={type} />
            </TagItem>
          ))}
        </div>
      ) : null}
    </div>
  )
}
export const TagItemContent = ({ type, data = {} }) => {
  if (type === 'user') {
    return <UserOrDepItem data={data} />
  } else if (type === 'group') {
    return <GroupChatCell data={data} />
  } else {
    return <UserItem data={data}>{data.name}</UserItem>
  }
}

export const TagItem = ({ children, onClose, closeable }) => {
  const handleClose = (e) => {
    e.stopPropagation()
    if (typeof onClose === 'function') {
      onClose()
    }
  }
  return (
    <div className={styles['tag-item']}>
      {closeable ? (
        <CloseCircleOutlined
          className={styles['tag-close']}
          onClick={handleClose}
        />
      ) : null}
      {children}
    </div>
  )
}
export const UserAndDepTags = ({ dataSource = [] }) => {
  if (Array.isArray(dataSource)) {
    return (
      <>
        {dataSource.map((depItem) => {
          if (depItem.isDep) {
            return (
              <Tag
                key={depItem.name}
                style={{ marginRight: 4, marginBottom: 4, padding: '4px 6px' }}>
                <ApartmentOutlined style={{ fontSize: 14, marginRight: 4 }} />
                <span style={{ fontSize: 14, marginLeft: 0 }}>
                  <OpenEle type="departmentName" openid={depItem.name} />
                </span>
              </Tag>
            )
          }
          return (
            <UserTag
              data={{ avatarUrl: depItem.avatarUrl, name: depItem.name }}
              key={depItem.name}
              style={{ marginRight: 4, marginBottom: 4 }}
            />
          )
        })}
      </>
    )
  } else {
    return null
  }
}

export const UserTags = ({ dataSource = [] }) => {
  if (!Array.isArray(dataSource)) {
    return null
  }
  return (
    <span>
      {dataSource.map((item) => {
        const type = item.isDep ? 'departmentName' : 'userName'
        return (
          <Tag key={item.key}>
            <OpenEle type={type} openid={item.name} />
          </Tag>
        )
      })}
    </span>
  )
}

// 部门
const DepItem = ({ data = {} }) => {
  return (
    <div className={styles['dep-item']}>
      <HomeOutlined className={styles['dep-icon']} />
      <span className={styles['dep-name']}>
        <OpenEle
          type="departmentName"
          openid={data.name}
          className={styles['user-name']}
        />
      </span>
    </div>
  )
}

const UserOrDepItem = ({ data = {} }) => {
  if (data.isDep) {
    return <DepItem data={data} />
  } else {
    return <UserItem data={data} />
  }
}

/**
 * 用户信息展示
 * @param {Object} data 用户信息
 * @returns
 */
export const UserItem = ({ data = {}, children }) => {
  return (
    <span className={styles['user-item']}>
      <img
        src={data.avatarUrl || data.avatar || defaultAvatorUrl}
        alt=""
        className={styles['user-avatar']}
      />
      {children ? (
        children
      ) : (
        <OpenEle
          type="userName"
          openid={data.name}
          className={styles['user-name']}
        />
      )}
    </span>
  )
}

export { MySelectModal }
