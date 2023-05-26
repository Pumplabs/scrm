import { Button, Form } from 'antd'
import { useAntdTable, useRequest } from 'ahooks'
import { HistoryOutlined, GoldOutlined } from '@ant-design/icons'
import SearchForm from 'components/SearchForm'
import TableContent from 'components/TableContent'
import { PageContent } from 'layout'
import UserTag from 'components/UserTag'
import { DepNames } from 'components/DepName'
import HistoryDrawer from './components/HistoryDrawer'
import AllotCustomerDrawer from './components/AllotCustomerDrawer'
import TransferTipModal from './components/TransferTipModal'
import CustomerListDrawer from './components/CustomerListDrawer'
import { getUserByDepId } from 'services/modules/userManage'
import { TransferCustomer } from 'services/modules/incumbencyTransfer'
import { useModalHook } from 'src/hooks'
import { transferRequestData } from './utils'

export default () => {
  const [searchForm] = Form.useForm()
  const { openModal, closeModal, visibleMap, modalInfo, requestConfirmProps, confirmLoading } =
    useModalHook([
      'allot',
      'customerList',
      'allotCustomer',
      'transferTip',
      'history',
    ])
  const {
    tableProps,
    refresh: refreshTable,
    search,
  } = useAntdTable(getUserByDepId, {
    form: searchForm,
  })

  const { run: runTransferCustomer } = useRequest(TransferCustomer, {
    manual: true,
    ...requestConfirmProps,
    ...transferRequestData({
      successFn: () => {
        closeModal()
        refreshTable()
      },
    }),
  })

  const onHistory = () => {
    openModal('history')
  }

  const onAllotOk = (vals) => {
    openModal('transferTip', {
      ...vals,
    })
  }

  const onAllot = () => {
    openModal('allotCustomer')
  }

  const onTipOk = (msg) => {
    const { customers, users } = modalInfo.data
    let customerStaffIds = []
    const [user] = users
    customers.forEach((item) => {
      if (item.creatorStaff) {
        customerStaffIds = [
          ...customerStaffIds,
          {
            customerId: item.id,
            extStaffId: item.creatorStaff.extId,
          },
        ]
      }
    })
    runTransferCustomer({
      customerStaffIds,
      takeoverStaffId: user.id,
      transferMsg: msg,
    })
  }

  const onLookCustomerRecord = (record) => {
    openModal('customerList', record)
  }

  const columns = [
    {
      dataIndex: 'extCreatorName',
      title: '员工名称',
      render: (_, record) => (
        <UserTag data={{ avatarUrl: record.avatarUrl, name: record.name }} />
      ),
    },
    {
      title: '部门',
      ellipsis: true,
      dataIndex: 'dpe33',
      render: (val, record) => {
        return <DepNames dataSource={record.departmentList} />
      },
    },
    {
      title: '客户数',
      dataIndex: 'customerCount',
      render: val=> val ? val : 0
    },
    {
      dataIndex: 'createdAt',
      title: '入职时间',
    },
  ]
  const searchConfig = [
    {
      type: 'input',
      label: '员工名称',
      name: 'name',
    },
  ]

  return (
    <PageContent>
      <SearchForm
        name="customerSearch"
        configList={searchConfig}
        form={searchForm}
        onSearch={search.submit}
        onReset={search.reset}
      />
      <AllotCustomerDrawer
        data={modalInfo.data}
        visible={visibleMap.allotCustomerVisible}
        onCancel={closeModal}
        onOk={onAllotOk}
        title="分配客户"
      />
      <TransferTipModal
        data={modalInfo.data}
        visible={visibleMap.transferTipVisible}
        onCancel={closeModal}
        confirmLoading={confirmLoading}
        onOk={onTipOk}
      />
      <CustomerListDrawer
        data={modalInfo.data}
        visible={visibleMap.customerListVisible}
        onCancel={closeModal}
        footer={null}
        title="客户列表"
      />
      <HistoryDrawer
        data={modalInfo.data}
        visible={visibleMap.historyVisible}
        onCancel={closeModal}
        title="分配历史"
      />
      <TableContent
        {...tableProps}
        rowKey="id"
        columns={columns}
        operationCol={{ width: 120 }}
        actions={[
          {
            title: '查看客户列表',
            disabled: record =>  !record.customerCount > 0,
            onClick: onLookCustomerRecord,
          },
        ]}
        toolBar={[
          <Button
            key="async"
            onClick={onAllot}
            type="primary"
            ghost
            icon={<GoldOutlined />}>
            分配客户
          </Button>,
          <Button
            key="history"
            onClick={onHistory}
            type="primary"
            ghost
            icon={<HistoryOutlined />}>
            分配记录
          </Button>,
        ]}
      />
    </PageContent>
  )
}
export { TransferTipModal }
