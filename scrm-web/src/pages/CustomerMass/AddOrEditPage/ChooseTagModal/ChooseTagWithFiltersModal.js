import React, { useEffect, useState } from 'react';
import { message, Radio } from 'antd';
import { useRequest } from 'ahooks';
import { GetAllCustomerTagGroup, AddCustomerTagGroup } from 'services/modules/customerTag'
import CommonModal from 'components/CommonModal'
// import AddTagModal from 'pages/CustomerTag/components/AddTagModal'
import AddTagModal from 'pages/CustomerManage/CustomerTags/components/AddTagModal'
import SelectTagContent from './SelectTagContent'
import { useModalHook } from 'src/hooks'
import { SUCCESS_CODE } from 'utils/constants';
import { ADVANCE_FILTER, ADVANCE_FILTER_OPTIONS } from '../constants'
import styles from './index.module.less';

/**
 * 选择标签弹窗
 * @param {*} param0 
 * @param {boolean} valueIsItem 默认返回id
 * @returns 
 */
const AddModal = (props) => {
  const { onOk, visible, data = {}, disabledTags = [], ...rest } = props
  const { openModal, closeModal, visibleMap, modalInfo, setConfirm } = useModalHook(['addGroup', 'addTag'])
  const { run: runGetTag, refresh: refreshTags, data: tagList = [] } = useRequest(GetAllCustomerTagGroup)
  const [selectedTagList, setSelectedTagList] = useState([])
  const [filters, setFilters] = useState(ADVANCE_FILTER.IN)

  // 新增标签组
  const { run: runAddCustomerTagGroup } = useRequest(AddCustomerTagGroup, {
    manual: true,
    onBefore: () => {
      setConfirm()
    },
    onSuccess: (res) => {
      setConfirm(false)
      if (res.code === SUCCESS_CODE) {
        message.success("新增成功")
        closeModal()
        refreshTags()
      } else {
        message.error("新增失败")
      }
    },
    onError: () => {
      setConfirm(false)
      message.error("新增失败")
    }
  })


  useEffect(() => {
    if (visible) {
      runGetTag()
      setSelectedTagList(data.tags || [])
      setFilters(data.option || ADVANCE_FILTER.IN)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onFilterChange = (e) => {
    const val = e.target.value
    setFilters(val)
  }

  const onTagsSelectChange = (keys) => {
    setSelectedTagList(keys)
  }

  const handleOk = () => {
    if (typeof onOk === 'function') {
      onOk({
        tags: filters === ADVANCE_FILTER.NONE ? [] : selectedTagList,
        option: filters
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
        tagList: addList
      }
      runAddCustomerTagGroup(params)
    }
  }

  const onAddGroup = () => {
    openModal('addGroup')
  }

  return (
    <CommonModal
      onOk={handleOk}
      visible={visible}
      centered={true}
      maskClosable={false}
      className={styles.addCompanyModal}
      title="选择标签"
      bodyStyle={{
        minHeight: "320px",
        paddingBottom: 0
      }}
      {...rest}
      okButtonProps={{
        disabled: selectedTagList.length === 0 && filters !== ADVANCE_FILTER.NONE
      }}
    >
      <AddTagModal
        visible={visibleMap.addGroupVisible}
        onCancel={closeModal}
        onOk={onAddModalOk}
        modalType={modalInfo.type}
        title="新增标签组"
      />
      <div>
        <span style={{ marginRight: 10 }}>筛选条件
          <span style={{ paddingLeft: 4 }}>:</span>
        </span>
        <Radio.Group
          onChange={onFilterChange}
          value={filters}
          style={{ marginBottom: 10 }}
        >
          {
            ADVANCE_FILTER_OPTIONS.map(ele => (
              <Radio
                value={ele.value}
                key={ele.value}
              >{ele.label}</Radio>
            ))
          }
        </Radio.Group>
      </div>
      <p
        className={styles['no-tags']}
        style={filters === ADVANCE_FILTER.NONE ? {} : { display: "none" }}
      >选择无任何标签后，将筛选出没有被打上过任何标签的客户～</p>
      <SelectTagContent
        tagList={tagList}
        searchProps={{
          placeholder: "请输入要查找的标签",
        }}
        itemIsValue={true}
        selectedKeys={selectedTagList}
        disabledKeys={disabledTags}
        onAddGroup={onAddGroup}
        onChange={onTagsSelectChange}
        footer={null}
        style={filters === ADVANCE_FILTER.NONE ? { display: "none" } : {}}
        valueKey="id"
      />
    </CommonModal>
  );
};


export default AddModal