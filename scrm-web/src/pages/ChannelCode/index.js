import { useState, useEffect, useMemo } from 'react'
import { Button, Form, Row, Col, Modal, Tooltip } from 'antd'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useAntdTable, useRequest } from 'ahooks'
import cls from 'classnames'
import SearchForm from 'components/SearchForm'
import TableContent from 'components/TableContent'
import UsersTagCell from 'components/UsersTagCell'
import ImmediateInput from 'components/ImmediateInput'
import TagCell from 'components/TagCell'
import { PageContent } from 'layout'
import QrCodeCell from 'components/QrCodeCell'
import DetailDrawer from './components/DetailDrawer'
import ModifyCodeDrawer from './components/ModifyCodeDrawer'
import { useModalHook, useTableRowSelect } from 'src/hooks'
import { actionRequestHookOptions } from 'services/utils'
import {
  GetGroupList,
  GetChannelTable,
  RemoveGroup,
  AddGroup,
  EditGroup,
  removeChannelCode,
  batchRemoveChannelCode,
  AddChannelCode,
  EditChannelCode,
} from 'services/modules/channelQrCode'
import {
  getMediaParams,
  getTextParamsWithNicknameParams,
} from 'components/WeChatMsgEditor/utils'
import GroupSide from 'components/GroupSide'
import styles from './index.module.less'

export default () => {
  const [searchForm] = Form.useForm()
  const [activeGroup, setActiveGroup] = useState({})
  const {
    openModal,
    closeModal,
    visibleMap,
    modalInfo,
    confirmLoading,
    setConfirm,
  } = useModalHook(['detail', 'addGroup', 'editGroup', 'addCode', 'editCode'])
  const { selectedProps, clearSelected, selectedKeys, selectedStatStr } =
    useTableRowSelect()
  const {
    tableProps,
    run: runTable,
    refresh: refreshTable,
    search,
    params: searchParams,
  } = useAntdTable(
    (pager, par = {}) =>
      GetChannelTable(pager, {
        ...par,
        groupId: activeGroup.id,
      }),
    {
      form: searchForm,
      manual: true,
      onSuccess: (res) => {
        clearSelected()
      },
    }
  )
  const {
    data: groupList = [],
    refresh: refreshGroup,
    loading: groupListLoading,
  } = useRequest(GetGroupList, {
    onSuccess: (res) => {
      const isExist = res.some((item) => item.id === activeGroup.id)
      if (!isExist && res[0]) {
        setActiveGroup(res[0])
      }
    },
  })

  const { run: runRemoveGroup } = useRequest(RemoveGroup, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        refreshGroup()
      },
    }),
  })
  const { run: runAddGroup } = useRequest(AddGroup, {
    manual: true,
    onBefore: () => {
      setConfirm(true)
    },
    onFinally: () => {
      setConfirm(false)
    },
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: () => {
        refreshGroup()
        closeModal()
      },
    }),
  })
  const { run: runEditGroup } = useRequest(EditGroup, {
    manual: true,
    onBefore: () => {
      setConfirm(true)
    },
    onFinally: () => {
      setConfirm(false)
    },
    ...actionRequestHookOptions({
      actionName: '编辑',
      successFn: () => {
        refreshGroup()
        closeModal()
      },
    }),
  })
  // 新增渠道码
  const { run: runAddChannelCode } = useRequest(AddChannelCode, {
    manual: true,
    onBefore: () => {
      setConfirm(true)
    },
    onFinally: () => {
      setConfirm(false)
    },
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: () => {
        refreshGroup()
        refreshTable()
        closeModal()
      },
    }),
  })
  // 编辑渠道码
  const { run: runEditChannelCode } = useRequest(EditChannelCode, {
    manual: true,
    onBefore: () => {
      setConfirm(true)
    },
    onFinally: () => {
      setConfirm(false)
    },
    ...actionRequestHookOptions({
      actionName: '编辑',
      successFn: () => {
        refreshTable()
        refreshGroup()
        closeModal()
      },
    }),
  })
  const { run: runRemoveChannelCode } = useRequest(removeChannelCode, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        refreshTable()
        refreshGroup()
      },
    }),
  })
  const { run: runBatchRemoveCode } = useRequest(batchRemoveChannelCode, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        refreshTable()
        refreshGroup()
      },
    }),
  })

  useEffect(() => {
    const groupId = activeGroup.id
    if (groupId) {
      runTable([
        {
          current: 1,
          pageSize: 10,
        },
        {
          groupId: groupId === 'all' ? '' : groupId,
        },
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGroup])

  const onDetailRecord = (data) => {
    openModal('detail', data)
  }

  const onEditRecord = (data) => {
    openModal('editCode', data)
  }

  const onRemoveRecord = (data) => {
    Modal.confirm({
      centered: true,
      title: '提示',
      content: `确定要删除渠道码"${data.name}"吗?`,
      onOk: () => {
        runRemoveChannelCode({
          id: data.id,
        })
      },
    })
  }

  const onAddGroup = () => {
    openModal('addGroup')
  }

  const onEditGroup = (data) => {
    openModal('editGroup', data)
  }

  const onSelectGroup = (item) => {
    setActiveGroup(item)
  }

  const onSaveGroup = (text) => {
    if (modalInfo.type === 'addGroup') {
      runAddGroup({
        name: text,
      })
    }
    if (modalInfo.type === 'editGroup') {
      runEditGroup({
        id: modalInfo.data.id,
        name: text,
      })
    }
  }

  const onRemoveGroup = (item) => {
    Modal.confirm({
      title: '提示',
      content: `确定要删除分组“${item.name}”吗`,
      centered: true,
      onOk: () => {
        runRemoveGroup({
          id: item.id,
        })
      },
    })
  }

  const onAddQrCode = () => {
    openModal('addCode')
  }
  const onBatchRemove = () => {
    Modal.confirm({
      title: '提示',
      content: `确定要是删除${selectedStatStr}吗`,
      centered: true,
      onOk: () => {
        runBatchRemoveCode({
          ids: selectedKeys,
        })
      },
    })
  }

  const onSearch = () => {
    const formVals = searchForm ? searchForm.getFieldsValue() : []
    const [pager = {}] = searchParams
    runTable(
      {
        current: 1,
        pageSize: pager.pageSize,
      },
      formVals
    )
  }

  const onAction = (key, item) => {
    switch (key) {
      case 'edit':
        onEditGroup(item)
        break
      case 'remove':
        onRemoveGroup(item)
        break
      default:
        break
    }
  }

  const onValidInputMsg = (text) => {
    const isExist = groupList.some(
      (ele) => ele.name === text && ele.id !== modalInfo.data.id
    )
    if (isExist) {
      return '分组名称已存在'
    }
  }

  const onSaveCode = (values) => {
    const {
      staffArr = [],
      backUsers = [],
      customerTags = [],
      msg = {},
      dailyAddCustomerLimitEnable,
      dailyAddCustomerLimit,
      ...rest
    } = values
    const autoReplyData = {
      text: getTextParamsWithNicknameParams(msg.text),
      media: getMediaParams(msg.media),
    }

    const params = {
      id: modalInfo.data.id,
      autoReplyType: 1,
      autoTagEnable: true,
      customerDesc: '',
      customerDescEnable: false,
      customerRemark: '',
      customerRemarkEnable: false,
      dailyAddCustomerLimitEnable,
      dailyAddCustomerLimit: dailyAddCustomerLimitEnable
        ? dailyAddCustomerLimit
        : undefined,
      customerTagExtIds: customerTags.map((ele) => ele.id),
      remark: '',
      staffIds: staffArr.map((ele) => (ele.staffId ? ele.staffId : ele.id)),
      backOutStaffIds: backUsers.map((ele) =>
        ele.staffId ? ele.staffId : ele.id
      ),
      // 欢迎语
      autoReply: autoReplyData,
      ...rest,
    }
    if (modalInfo.type === 'editCode') {
      runEditChannelCode(params)
    } else {
      runAddChannelCode(params)
    }
  }

  const groupName = useMemo(() => {
    if (modalInfo.data) {
      const item = groupList.find((ele) => ele.id === modalInfo.data.groupId)
      return item ? item.name : ''
    } else {
      return ''
    }
  }, [modalInfo.data, groupList])

  const columns = [
    {
      dataIndex: 'qrCode',
      title: '渠道码',
      width: 60,
      fixed: 'left',
      render: (val) => <QrCodeCell src={val} title="渠道码" />,
    },
    {
      dataIndex: 'name',
      title: '名称',
    },
    {
      dataIndex: 'addCustomerCount',
      title: '扫描次数',
    },
    {
      dataIndex: 'staffs',
      title: '使用员工',
      render: (val) => {
        return <UsersTagCell dataSource={val} />
      },
    },
    {
      dataIndex: 'backOutStaffs',
      title: '备选员工',
      render: (val) => {
        return <UsersTagCell dataSource={val} />
      },
    },
    {
      dataIndex: 'customerTags',
      title: '标签',
      render: (val, record) => {
        return <TagCell dataSource={val} />
      },
    },
    {
      dataIndex: 'createdAt',
      sorted: true,
      width: 160,
      title: '创建时间',
    },
  ]
  const searchConfig = [
    {
      type: 'input',
      label: '名称',
      ellipsis: true,
      name: 'name',
    },
    {
      label: '使用员工',
      type: 'userSelect',
      name: 'staffIds',
      eleProps: {
        valueKey: 'id',
      },
    },
    {
      type: 'rangTime',
      label: '创建时间',
      name: 'createTime',
    },
  ]

  const inputProps = {
    onSave: onSaveGroup,
    required: true,
    onCancel: closeModal,
    validMsg: onValidInputMsg,
    maxLength: 30,
    confirmLoading,
  }
  const groupJsonStr = useMemo(() => {
    return JSON.stringify(groupList)
  }, [groupList])
  const groupMaxCount = useMemo(() => {
    return groupList.reduce((res, item) => Math.max(res, item.count), 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupJsonStr])
  return (
    <PageContent>
      <Row>
        <DetailDrawer
          groupName={groupName}
          title="渠道码详情"
          data={modalInfo.data}
          visible={visibleMap.detailVisible}
          onCancel={closeModal}
        />
        <ModifyCodeDrawer
          groupList={groupList}
          defaultGroupId={activeGroup.id}
          title={`${modalInfo.type === 'editCode' ? '编辑' : '新增'}渠道码`}
          data={modalInfo.data}
          visible={visibleMap.addCodeVisible || visibleMap.editCodeVisible}
          onOk={onSaveCode}
          onCancel={closeModal}
          isEdit={modalInfo.type === 'editCode'}
        />
        <Col span={6} className={styles.groupCol}>
          <GroupSide
            title="全部分组"
            selectedKey={activeGroup.id}
            dataSource={groupList}
            onSelect={onSelectGroup}
            loading={groupListLoading}
            itemProps={{
              preAction: true,
              showAction: (item) => !item.isDefault,
              onAction: onAction,
            }}
            onAdd={onAddGroup}
            addonBefore={
              modalInfo.type === 'addGroup' ? (
                <div style={{ marginBottom: 6 }}>
                  <ImmediateInput {...inputProps} />
                </div>
              ) : null
            }
            renderItemContent={(item) => {
              return (
                <div
                  className={cls({
                    [styles['list-item']]: true,
                    [styles[
                      `count-${Math.floor(Math.log10(groupMaxCount))}`
                    ]]: true,
                  })}>
                  <Tooltip title={item.name} placement="topLeft">
                    <span className={styles['group-name']}>{item.name}</span>
                  </Tooltip>
                  <span className={styles['group-count']}>{item.count}</span>
                </div>
              )
            }}
            renderItem={(item) => {
              if (
                modalInfo.type === 'editGroup' &&
                item.id === modalInfo.data.id
              ) {
                return (
                  <div style={{ marginBottom: 6 }}>
                    <ImmediateInput defaultValue={item.name} {...inputProps} />
                  </div>
                )
              } else {
                return undefined
              }
            }}
          />
        </Col>
        <Col span={18}>
          <div>
            <SearchForm
              form={searchForm}
              onSearch={onSearch}
              onReset={search.reset}
              configList={searchConfig}
            />
            <TableContent
              {...tableProps}
              {...selectedProps}
              scroll={{ x: 1200 }}
              columns={columns}
              operationCol={{ width: 140 }}
              actions={[
                {
                  title: '编辑',
                  onClick: onEditRecord,
                },
                {
                  title: '删除',
                  onClick: onRemoveRecord,
                },
                {
                  title: '详情',
                  onClick: onDetailRecord,
                },
              ]}
              toolBar={[
                <Button key="add" onClick={onAddQrCode} type="primary" ghost>
                  <PlusOutlined />
                  新增渠道码
                </Button>,
                <Button
                  key="remove"
                  onClick={onBatchRemove}
                  type="primary"
                  ghost
                  disabled={!selectedKeys.length}>
                  <DeleteOutlined />
                  批量删除
                </Button>,
              ]}
            />
          </div>
        </Col>
      </Row>
    </PageContent>
  )
}
