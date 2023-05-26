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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onTagsSelectChange = (keys) => {
    setSelectedTagList(keys)
  }

  const handleOk = () => {
    if (typeof onOk === 'function') {
      onOk({
        tags: selectedTagList
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
        disabled: selectedTagList.length === 0
      }}
    >
      <AddTagModal
        visible={visibleMap.addGroupVisible}
        onCancel={closeModal}
        onOk={onAddModalOk}
        modalType={modalInfo.type}
        title="新增标签组"
      />
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
        valueKey="id"
      />
    </CommonModal>
  );
};


export default AddModal
export { default as ChooseTagWithFiltersModal } from './ChooseTagWithFiltersModal'