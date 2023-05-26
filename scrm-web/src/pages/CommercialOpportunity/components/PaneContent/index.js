import { useEffect } from 'react'
import { Form, Modal, Button, Progress, Select } from 'antd'
import { useRequest } from 'ahooks'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import TableContent from 'components/TableContent'
import SearchForm from 'components/SearchForm'
import UserTag from 'components/UserTag'
import AddOpportunityDrawer from '../AddOpportunityDrawer'
import OpportunityDetailDrawer from '../OpportunityDetailDrawer'
import StatusItem from 'pages/CommercialOpportunityConfiguration/StageConfiguration/StageConfigDrawer/StatusItem'
import { useModalHook, useTable } from 'src/hooks'
import {
  GetOpportunityList,
  RemoveOpportunity,
  AddOpportunity,
  EditOpportunity,
  BatchRemoveOpportunity,
} from 'services/modules/commercialOpportunity'
import { formatNumber } from 'src/utils'
import { actionRequestHookOptions } from 'services/utils'
import { PRIORITY_OPTIONS, OPP_STATUS_VALS } from '../../constants'

export default ({
  status = '',
  groupList = [],
  stageList = [],
  sideLoading,
  activeGroup,
  shouldRefresh,
  updateRefreshStat,
}) => {
  const [searchForm] = Form.useForm()
  const {
    run: runGetOpportunityList,
    tableProps,
    selectedKeys,
    selectedRows,
    refresh: refreshTable,
    search,
    params: searchParams,
  } = useTable(GetOpportunityList, {
    selected: true,
    form: searchForm,
    pageSize: 10,
    manual: true,
    fixedParams: {
      status,
      groupId: activeGroup.id,
    },
  })
  const {
    openModal,
    closeModal,
    visibleMap,
    modalInfo,
    requestConfirmProps,
    confirmLoading,
  } = useModalHook([
    'detail',
    'addGroup',
    'editGroup',
    'editOpportunity',
    'addOpportunity',
    'opportunityDetail',
  ])
  const { run: runAddOpportunity } = useRequest(AddOpportunity, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: () => {
        refreshTable()
        updateRefreshStat()
        closeModal()
      },
    }),
  })
  const { run: runEditOpportunity } = useRequest(EditOpportunity, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '编辑',
      successFn: () => {
        refreshTable()
        updateRefreshStat()
        closeModal()
      },
    }),
  })
  const { run: runRemoveOpportunity } = useRequest(RemoveOpportunity, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        refreshTable()
      },
    }),
  })
  const { run: runBatchRemoveOpportunity } = useRequest(
    BatchRemoveOpportunity,
    {
      manual: true,
      ...actionRequestHookOptions({
        actionName: '删除',
        successFn: () => {
          refreshTable()
        },
      }),
    }
  )

  useEffect(() => {
    if (activeGroup.id) {
      runGetOpportunityList(
        {
          current: 1,
          pageSize: 10,
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeGroup.id])

  useEffect(() => {
    if (shouldRefresh) {
      runGetOpportunityList({
        current: 1,
        pageSize: 10,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRefresh])

  const onSearch = () => {
    const formVals = searchForm ? searchForm.getFieldsValue() : []
    const [pager = {}] = searchParams
    runGetOpportunityList(
      {
        current: 1,
        pageSize: pager.pageSize,
      },
      formVals
    )
  }

  const onDetailRecord = (data) => {
    openModal('opportunityDetail', data)
  }

  const onEditRecord = (data) => {
    openModal('editOpportunity', data)
  }

  const onRemoveRecord = (data) => {
    Modal.confirm({
      centered: true,
      title: '提示',
      content: `确定要删除商机"${data.name}"吗?`,
      onOk: () => {
        runRemoveOpportunity({
          id: data.id,
        })
      },
    })
  }

  const onAddOpportunity = () => {
    openModal('addOpportunity')
  }

  const onBatchRemove = () => {
    const total = selectedRows.length
    if (total === 1) {
      onRemoveRecord(selectedRows[0])
    } else {
      const [row] = selectedRows
      Modal.confirm({
        centered: true,
        title: '提示',
        content: `确定要删除"${row.name}"等${total}个商机吗吗?`,
        onOk: () => {
          runBatchRemoveOpportunity({
            ids: selectedKeys,
          })
        },
      })
    }
  }

  const onOpportunityOk = (vals) => {
    const {
      expectDealTime,
      expectMoney = '',
      stageId = '',
      ownerInfo = [],
      cooperatorIds = [],
      groupId = '',
      desp = '',
      priority = '',
      customerInfo = [],
      ...rest
    } = vals
    const partners =
      modalInfo.data && Array.isArray(modalInfo.data.cooperatorList)
        ? modalInfo.data.cooperatorList
        : []
    let params = {
      expectDealDate: expectDealTime
        ? `${expectDealTime.format('YYYY-MM-DD')} 23:59:59`
        : '',
      expectMoney,
      stageId,
      groupId,
      desp,
      priority,
      customerExtId: customerInfo[0].extId,
      owner: ownerInfo[0].extId,
      opportunityCooperatorList: cooperatorIds.map((item) => {
        let data = {
          canUpdate: item.editabled || false,
          cooperatorId: item.extId,
        }
        const oldItem = partners.length
          ? partners.find((ele) => ele.cooperatorId === item.extId)
          : null
        if (oldItem) {
          data.id = oldItem.id
        }
        return data
      }),
      ...rest,
    }
    if (modalInfo.type === 'addOpportunity') {
      runAddOpportunity(params)
    } else if (modalInfo.type === 'editOpportunity') {
      params.id = modalInfo.data.id
      runEditOpportunity(params)
    }
  }

  const columns = [
    {
      title: '商机名称',
      dataIndex: 'name',
    },
    {
      title: '阶段',
      dataIndex: 'stage',
      render: (val) => (
        <StatusItem color={val ? val.color : ''} name={val ? val.name : ''} />
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      render: (val) => {
        const item = PRIORITY_OPTIONS.find((ele) => ele.value === val)
        return item ? item.label : '-'
      },
    },
    {
      title: '金额',
      dataIndex: 'expectMoney',
      render: (val) =>
        val > 0
          ? `${formatNumber(val, {
              padPrecision: 2,
            })}`
          : '-',
    },
    {
      title: '成单概率',
      dataIndex: 'dealChance',
      render: (val) => (val > 0 ? <Progress percent={val} /> : '-'),
    },
    {
      title: '负责人',
      dataIndex: 'ownerStaff',
      render: (val) => <UserTag data={val} />,
    },
  ]

  const searchConfig = [
    {
      label: '商机阶段',
      name: 'stageId',
      renderEle: () => {
        return (
          <Select placeholder="请选择">
            {stageList.map((ele) => (
              <Select.Option key={ele.id} value={ele.id}>
                {ele.name}
              </Select.Option>
            ))}
          </Select>
        )
      },
    },
    {
      label: '负责人',
      type: 'userSelect',
      name: 'owner',
      eleProps: {
        valueKey: 'extId',
        mode: '',
      },
    },
    {
      type: 'select',
      label: '优先级',
      name: 'priority',
      eleProps: {
        options: PRIORITY_OPTIONS,
        fieldNames: {
          label: 'label',
          value: 'value',
        },
      },
    },
    {
      type: 'rangTime',
      label: '创建时间',
      name: 'createTime',
    },
  ]
  return (
    <div>
      <AddOpportunityDrawer
        defaultGroupId={activeGroup.id}
        title={visibleMap.editOpportunityVisible ? '编辑商机' : '添加商机'}
        groupList={groupList}
        data={modalInfo.data}
        onOk={onOpportunityOk}
        onCancel={closeModal}
        confirmLoading={confirmLoading}
        visible={
          visibleMap.addOpportunityVisible || visibleMap.editOpportunityVisible
        }
        isEdit={visibleMap.editOpportunityVisible}
      />
      <OpportunityDetailDrawer
        title="商机详情"
        groupName={activeGroup.name}
        visible={visibleMap.opportunityDetailVisible}
        data={modalInfo.data}
        onCancel={closeModal}
      />
      <SearchForm
        form={searchForm}
        onSearch={onSearch}
        onReset={search.reset}
        configList={searchConfig}
      />
      <TableContent
        columns={columns}
        loading={tableProps.loading || sideLoading}
        {...tableProps}
        operationCol={{ width: 140 }}
        actions={[
          {
            title: '编辑',
            visible: OPP_STATUS_VALS.FOLLOW === status,
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
          <Button key="add" onClick={onAddOpportunity} type="primary" ghost>
            <PlusOutlined />
            添加商机
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
  )
}
