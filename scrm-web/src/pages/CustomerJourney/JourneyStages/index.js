import { useState, useRef, useEffect, useContext } from 'react'
import { PlusOutlined, TableOutlined, ProjectOutlined, SettingOutlined } from '@ant-design/icons'
import { Button, Form, Modal, Tooltip, Divider, Select } from 'antd'
import { get } from 'lodash'
import { useAntdTable, useRequest, usePrevious } from 'ahooks'
import cls from 'classnames'
import SimplePageCard from 'components/SimplePageCard'
import { Table } from 'components/TableContent'
import WeChatCell from 'components/WeChatCell'
import UserTag from 'components/UserTag'
import CustomerDetailDrawer from 'pages/CustomerManage/CustomerList/components/DetailDrawer'
import StageList from './StageList'
import AddStageUserDrawer from './AddStageUserDrawer'
import { useModalHook } from 'src/hooks'
import { actionRequestHookOptions } from 'services/utils'
import StageContext from '../StageContext'
import {
  GetJourneyStageCustomer,
  AddJourneyCustomer,
  EditJourneyCustomer,
  RemoveJourneyCustomer,
  // GetJourneyAllStage,
} from 'services/modules/customerJourney'
import styles from './index.module.less'

export default ({ selectedJourney, getAllJourney, onStageConfig }) => {
  const [mode, setMode] = useState('table')
  const stageListRef = useRef(null)
  const searchFormVals = useRef({})
  const { allStageList = [] } = useContext(StageContext)
  const {
    openModal,
    closeModal,
    visibleMap,
    modalInfo,
    setConfirm,
    confirmLoading,
  } = useModalHook(['add', 'edit', 'detail'])
  // 获取阶段客户表格数据
  const {
    tableProps,
    run: runGetTableData,
    refresh: refreshData,
    params: searchParams
  } = useAntdTable(
    (pager, vals = {}) =>
      GetJourneyStageCustomer(pager, {
        ...vals,
        journeyId: selectedJourney.id,
      }),
    {
      pageSize: 10,
      // form: searchForm,
    }
  )
  const preSearchParams = usePrevious(searchParams)
  // 阶段信息
  // const { run: runGetJourneyStageList, data: stageList } = useRequest(
  //   GetJourneyAllStage,
  //   {
  //     manual: true,
  //   }
  // )
  // 新增阶段客户
  const { run: runAddJourneyCustomer } = useRequest(AddJourneyCustomer, {
    manual: true,
    onBefore() {
      setConfirm(true)
    },
    onFinally() {
      setConfirm(false)
    },
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: (_, [{ journeyStageId }]) => {
        if (mode === 'list') {
          if (stageListRef.current && stageListRef.current.refreshById) {
            stageListRef.current.refreshById(journeyStageId)
          }
        } else {
          refreshData()
        }
        closeModal()
      },
    }),
  })

  // 删除阶段客户
  const { run: runRemoveJourneyCustomer } = useRequest(RemoveJourneyCustomer, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        runGetTableData(
          {},
          {
            ...searchFormVals.current,
            journeyId: selectedJourney.id,
          }
        )
      },
    }),
  })

  // 修改
  const { run: runEditJourneyCustomer } = useRequest(EditJourneyCustomer, {
    manual: true,
    onBefore() {
      setConfirm(true)
    },
    onFinally() {
      setConfirm(false)
    },
    ...actionRequestHookOptions({
      actionName: '编辑',
      successFn: () => {
        refreshData()
        closeModal()
      },
    }),
  })

  useEffect(() => {
    if (mode && selectedJourney.id) {
      getPageData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, selectedJourney.id])

  const onDetailRecord = (record) => {
    openModal('detail', record)
  }

  const onCloseCustomerModal = (hasEdit) => {
    if (hasEdit) {
      refreshData()
    }
    closeModal()
  }

  const getPageData = () => {
    if (mode === 'table') {
      runGetTableData(
        {},
        {
          journeyStageName: searchFormVals.current.name,
          journeyId: selectedJourney.id,
        }
      )
    }
  }

  const onRemoveRecord = (record) => {
    const item = allStageList.find((ele) => ele.id === record.journeyStageId)
    const newStageName = item ? `“${item.name}”` : ''
    Modal.confirm({
      title: '提示',
      content: `确定要将客户“${get(
        record,
        'customer.name'
      )}”从${newStageName}中移除吗`,
      centered: true,
      onOk: () => {
        runRemoveJourneyCustomer({
          id: record.id,
        })
      },
    })
  }

  const onModeChange = (val) => {
    setMode(val)
  }

  const onChangeStage = (val, record) => {
    const item = allStageList.find((ele) => ele.id === val)
    const newStageName = item ? item.name : ''
    Modal.confirm({
      title: '提示',
      content: `确定要将客户“${get(record, 'customer.name')}”的阶段更改为${newStageName ? '“' + newStageName + '”' : ''
        }吗？`,
      centered: true,
      onOk: () => {
        runEditJourneyCustomer({
          customerId: get(record, 'customer.id'),
          id: record.id,
          journeyStageId: val,
        })
      },
    })
  }
  const onAdd = () => {
    openModal('add', {
      journeyId: selectedJourney.id,
    })
  }

  const onAddJourneyCustomerOk = ({ users, stageId }) => {
    const customerIds = users.map((ele) => ele.id)
    if (modalInfo.type === 'add') {
      runAddJourneyCustomer({
        customerIds,
        journeyStageId: stageId,
      })
    }
  }

  const columns = [
    {
      title: '客户名称',
      dataIndex: 'customer',
      render: (val) => <WeChatCell data={val} />,
    },
    {
      title: '操作员工',
      dataIndex: 'creatorStaff',
      render: (val) => <UserTag data={val} />,
    },
    {
      title: '阶段',
      dataIndex: 'journeyStageId',
      render: (val, record) => (
        <Select value={val} onChange={(value) => onChangeStage(value, record)}>
          {allStageList.map((ele) => (
            <Select.Option key={ele.id} value={ele.id}>
              {ele.name}
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: '流失状态',
      dataIndex: 'hasDelete',
      render: (_, record) => {
        const flag = record.customer ? record.customer.isDeletedStaff : false
        return flag ? '已流失' : '未流失'
      },
    },
    {
      title: '添加时间',
      dataIndex: 'createdAt',
    },
  ]
  return (
    <>
      <AddStageUserDrawer
        modalType={modalInfo.type}
        name="旅程客户"
        confirmLoading={confirmLoading}
        visible={visibleMap.addVisible || visibleMap.editVisible}
        onCancel={closeModal}
        data={modalInfo.data}
        onOk={onAddJourneyCustomerOk}
      />
      <CustomerDetailDrawer
        title="客户详情"
        data={modalInfo.data}
        params={{
          customerId: get(modalInfo, 'data.customerId'),
          customerExtId: get(modalInfo, 'data.customer.extId'),
          staffId: get(modalInfo, 'data.creator'),
        }}
        staff={get(modalInfo, 'data.creatorStaff')}
        customerAvatar={get(modalInfo, 'data.customer')}
        visible={visibleMap.detailVisible}
        onCancel={onCloseCustomerModal}
      />
      {/* <SearchForm
        form={searchForm}
        configList={searchConfig}
        onSearch={onSearch}
        onReset={onReset}
      /> */}
      <SimplePageCard
        bodyStyle={{
          height: 'calc(100vh - 232px)',
        }}
        style={{ padding: 0 }}
        name={
          <span>
            <ModeItem mode={mode} onChange={onModeChange} />
            <span style={{ marginLeft: 10 }}>
            </span>
            <span className={styles['view-mode-box']}>
              <SettingOutlined
                onClick={() => {
                  onStageConfig(selectedJourney)
                }}
                className={cls({
                  [styles['mode-item']]: true,
                })}
              />
            </span>
          </span>
        }
        toolBar={[
          <Button
            key="add"
            type="primary"
            onClick={onAdd}
            ghost
            icon={<PlusOutlined />}>
            添加旅程客户
          </Button>,
        ]}>
        {mode === 'table' ? (
          <Table
            {...tableProps}
            columns={columns}
            actions={[
              {
                title: '删除',
                onClick: onRemoveRecord,
              },
            ]}
          />
        ) : (
          <StageList
            dataSource={allStageList}
            ref={(ref) => (stageListRef.current = ref)}
          />
        )}
      </SimplePageCard>
    </>
  )
}

const ModeItem = ({ onChange, mode }) => {
  const onClickTable = () => {
    onChange('table')
  }
  const onClickList = () => {
    onChange('list')
  }
  return (
    <span className={styles['view-mode-box']}>
      <Tooltip title="表格">
        <TableOutlined
          onClick={onClickTable}
          className={cls({
            [styles['mode-item']]: true,
            [styles['active-mode-item']]: mode === 'table',
          })}
        />
      </Tooltip>
      <Tooltip title="列表">
        <ProjectOutlined
          onClick={onClickList}
          className={cls({
            [styles['mode-item']]: true,
            [styles['active-mode-item']]: mode === 'list',
          })}
        />
      </Tooltip>
    </span>
  )
}
