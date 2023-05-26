import React, { useEffect, useState } from 'react'
import { message, Button } from 'antd'
import { useRequest, useAntdTable } from 'ahooks'
import { PlusOutlined } from '@ant-design/icons'
import cls from 'classnames'
import CommonModal from 'components/CommonModal'
import AddTagModal from 'pages/CustomerManage/CustomerTags/components/AddTagModal'
import ModalContent from './ModalContent'
import { getRequestError } from 'services/utils'
import reqMethodsConfig from '../reqMethodsConfig'
import AddTagBtn from './AddTagBtn'
import { useModalHook } from 'src/hooks'
import { SUCCESS_CODE } from 'utils/constants'
import styles from './index.module.less'

/**
 * 选择标签弹窗
 * @param {Object} data
 * * @param {Array} tags
 * @param {boolean} valueIsItem 默认返回id
 * @param {string} tagType 标签类型 ['customer', 'group', 'material']
 * @returns
 */
const tagTypeArr = ['customer', 'group', 'material']
const AddModal = (props) => {
  const {
    onOk,
    visible,
    data = {},
    disabledTags = [],
    tagType = 'customer',
    allowAddTag,
    allowAddGroup,
    maxCount,
    className,
    onCancel,
    ...rest
  } = props
  const reqMap =
    reqMethodsConfig[tagTypeArr.includes(tagType) ? tagType : 'customer']
  const { openModal, closeModal, visibleMap, modalInfo, setConfirm, confirmLoading } =
    useModalHook(['addGroup', 'addTag'])
  const {
    run: runGetTag,
    refresh: refreshTags,
    tableProps,
    params: searchParams,
    mutate,
  } = useAntdTable(reqMap.list, {
    manual: true,
    onFinally: ([{ current = 1 }]) => {
      if (current === 1) {
        setTagList([...tableProps.dataSource])
      } else {
        setTagList([...tagList, ...tableProps.dataSource])
      }
    },
  })
  const [selectedTagList, setSelectedTagList] = useState([])
  const [tagList, setTagList] = useState([])
  const [searchText, setSearchText] = useState('')
  const filterPropName = 'name'
  // 新增标签组
  const { run: runAddCustomerTagGroup } = useRequest(reqMap.addGroup, {
    manual: true,
    onBefore: () => {
      setConfirm()
    },
    onFinally() {
      setConfirm(false)
    },
    onSuccess: (res) => {
      if (res.code === SUCCESS_CODE) {
        message.success('新增成功')
        closeModal()
        refreshTags()
      } else {
        message.error(res.msg || '新增失败')
      }
    },
    onError: (e) => getRequestError(e, '新增失败'),
  })
  const { run: runAddTag } = useRequest(reqMap.addTag, {
    manual: true,
    onBefore() {
      setConfirm()
    },
    onFinally() {
      setConfirm(false)
    },
    onSuccess: (res) => {
      if (res.code === SUCCESS_CODE) {
        message.success('新增成功')
        closeModal()
        refreshTags()
      } else {
        message.error(res.msg || '新增失败')
      }
    },
    onError: (e) => getRequestError(e, '新增失败'),
  })

  const formatParams = (type, params) => {
    if (typeof reqMap.formatParams === 'function') {
      return reqMap.formatParams(type, params) || params
    } else {
      return params
    }
  }

  useEffect(() => {
    if (visible) {
      runGetTag({ current: 1 }, formatParams('list'))
      setSelectedTagList(data.tags || [])
    } else {
      setTagList([])
      setSearchText('')
      mutate({
        dataSource: [],
        pagination: {
          current: 1,
          pageSize: 0,
          total: 0,
        },
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onTagsSelectChange = (keys) => {
    if (typeof maxCount === 'number' && keys.length > maxCount) {
      message.warning(`最多只能选择${maxCount}个标签`)
    } else {
      setSelectedTagList(keys)
    }
  }

  const handleOk = () => {
    if (typeof onOk === 'function') {
      onOk({
        tags: selectedTagList,
      })
    }
  }

  const onAddModalOk = (values) => {
    const { department, addList, name } = values
    let baseParams = {
      name,
      departmentList: department ? JSON.stringify(department) : undefined,
    }
    if (modalInfo.type === 'addGroup') {
      const params = {
        ...baseParams,
        tagList: addList,
      }
      runAddCustomerTagGroup(formatParams('addGroup', params))
    }
  }

  const onAddGroup = () => {
    openModal('addGroup')
  }

  // 新增标签
  const onAddTag = (item) => {
    openModal('addTag', item)
  }

  const onTagInputOk = (text) => {
    setConfirm()
    if (typeof runAddTag === 'function' && !confirmLoading) {
      runAddTag(
        formatParams('addTag', {
          name: text,
          groupData: modalInfo.data,
        })
      )
    }
  }

  const onSearch = (text) => {
    const [pager = {}] = searchParams
    setSearchText(text)
    runGetTag({ ...pager, current: 1 }, formatParams('list', { keyword: text }))
  }

  const handleCancel = () => {
    if (typeof onCancel === 'function') {
      onCancel()
    }
  }

  const onModalCancel = () => {
    if (visibleMap.addTagVisible) {
      return;
    } else {
      handleCancel()
    }
  }

  const handleValidInput = (text, data) => {
    const tags = Array.isArray(data.tags) ? data.tags : []
    const nameIsExist = tags.some((ele) => ele[filterPropName] === text)
    if (nameIsExist) {
      return '标签名称已存在'
    }
  }

  const renderGroupItemPrefix = (ele) => {
    return (
      <AddTagBtn
        onClick={() => {
          onAddTag(ele)
        }}
        inputVisible={visibleMap.addTagVisible && modalInfo.data.id === ele.id}
        onSave={onTagInputOk}
        onCancel={closeModal}
        validMsg={(text) => {
          handleValidInput(text, ele)
        }}
      />
    )
  }

  const loadMoreData = () => {
    const [pager = { current: 1 }] = searchParams
    runGetTag(
      { ...pager, current: pager.current + 1 },
      formatParams('list', { keyword: searchText })
    )
  }

  return (
    <CommonModal
      onOk={handleOk}
      visible={visible}
      className={cls({
        [styles.addCompanyModal]: true,
        [className]: className,
      })}
      title="选择标签"
      bodyStyle={{
        minHeight: '320px',
        paddingBottom: 0,
      }}
      onCancel={onModalCancel}
      {...rest}
      okButtonProps={{
        disabled: selectedTagList.length === 0,
      }}>
      <AddTagModal
        visible={visibleMap.addGroupVisible}
        onCancel={closeModal}
        onOk={onAddModalOk}
        modalType={modalInfo.type}
        title="新增标签组"
      />
      {typeof maxCount === 'number' ? (
        <div style={{ marginBottom: 12 }}>
          <SelectedTip total={maxCount} count={selectedTagList.length} />
        </div>
      ) : null}
      {visible && (
        <ModalContent
          pagination={
            visible
              ? tableProps.pagination
              : { total: 0, current: 0, pageSize: 0 }
          }
          loadMoreData={loadMoreData}
          onSearch={onSearch}
          loading={tableProps.loading}
          dataSource={tagList}
          placeholder="请输入要查找的标签"
          scrollWrapStyle={!allowAddGroup ? { height: 300 } : { height: 200 }}
          itemIsValue={true}
          selectedKeys={selectedTagList}
          disabledKeys={disabledTags}
          onChange={onTagsSelectChange}
          groupItemPrefix={allowAddTag ? renderGroupItemPrefix : null}
          tagsEmpty={
            allowAddTag ? null : (
              <span style={{ fontSize: 12, color: '#999' }}>
                暂时没有标签哦
              </span>
            )
          }
          footer={
            allowAddGroup ? (
              <div className={styles.addTagBtnWrap}>
                <Button onClick={onAddGroup} size="small" type="primary" ghost>
                  <PlusOutlined />
                  新增标签组
                </Button>
              </div>
            ) : null
          }
          valueKey="id"
        />
      )}
    </CommonModal>
  )
}

const SelectedTip = (props) => {
  const { total, count } = props
  return (
    <span>
      <span style={{ marginRight: 4 }}>
        最多只能选择<span className={styles['label-colon']}>:</span>
        <span className={styles['total-num']}>{total}</span>个标签
      </span>
      , 当前已选择<span className={styles['label-colon']}>:</span>
      <span className={styles['count-num']}>{count}</span>个标签
    </span>
  )
}
export default AddModal
export { ModalContent }
