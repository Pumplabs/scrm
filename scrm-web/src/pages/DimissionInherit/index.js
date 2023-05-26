import { Button, Form } from 'antd'
import { useAntdTable, useRequest } from 'ahooks'
import { HistoryOutlined } from '@ant-design/icons'
import SearchForm from 'components/SearchForm'
import TableContent from 'components/TableContent'
import { PageContent } from 'layout'
import UserTag from 'components/UserTag'
import { DepNames } from 'components/DepName'
import { GetDimmissionInherit } from 'services/modules/dimissionInherit'
import { useModalHook } from 'src/hooks'
import CustomerDrawer from './components/CustomerDrawer'
import GroupDrawer from './components/GroupDrawer'
import HistoryDrawer from './components/HistoryDrawer'

export default () => {
  const [searchForm] = Form.useForm()
  const {
    openModal,
    closeModal,
    visibleMap,
    modalInfo
  } = useModalHook(['customer', 'group', 'history'])
  const {
    tableProps,
    refresh: refreshTable,
    search,
  } = useAntdTable(GetDimmissionInherit, {
    form: searchForm,
    pageSize: 10,
    defaultParams: [
      {
        current: 1,
        pageSize: 10,
      },
    ],
  })

  const onHistory = () => {
    openModal('history')
  }

  const onAllotOk = () => {}

  const onDetailCustomer = (record) => {
    openModal('customer', record)
  }

  const onDetailGroup = (record) => {
    openModal('group', record)
  }

  const columns = [
    {
      dataIndex: 'staff',
      title: '员工名称',
      width: 200,
      render: (val) => <UserTag data={val} />,
    },
    {
      title: '部门',
      ellipsis: true,
      dataIndex: 'dep',
      render: (_, record) => {
        const depArr = record.staff ? record.staff.departmentList : []
        return <DepNames dataSource={depArr} />
      },
    },
    {
      title: '待分配客户数',
      dataIndex: 'waitTransferCustomerNum',
      width: 120,
      render: (val) => (val > 0 ? val : 0),
    },
    {
      dataIndex: 'waitTransferGroupChatNum',
      width: 120,
      title: '待分配群聊数',
      render: (val) => (val > 0 ? val : 0),
    },
    {
      dataIndex: 'resignedTime',
      title: '离职时间',
      width: 160,
    },
  ]
  const searchConfig = [
    {
      type: 'rangTime',
      label: '离职时间',
      name: 'createTime',
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
      <HistoryDrawer
        data={modalInfo.data}
        visible={visibleMap.historyVisible}
        onCancel={closeModal}
        title="分配记录"
      />
      <CustomerDrawer
        data={modalInfo.data}
        visible={visibleMap.customerVisible}
        onCancel={closeModal}
        onOk={onAllotOk}
        title="待分配客户"
      />
      <GroupDrawer
        data={modalInfo.data}
        visible={visibleMap.groupVisible}
        onCancel={closeModal}
        onOk={onAllotOk}
        title="待分配群"
      />
      <TableContent
        tableLayout="auto"
        {...tableProps}
        scroll={{ x: 1000 }}
        rowKey="staffId"
        columns={columns}
        operationCol={{ width: 160 }}
        actions={[
          {
            title: '待分配客户',
            visible: record => record.waitTransferCustomerNum > 0,
            onClick: onDetailCustomer,
          },
          {
            title: '待分配群',
            onClick: onDetailGroup,
            visible: record => record.waitTransferGroupChatNum > 0,
          },
        ]}
        toolBar={[
          <Button
            key="async"
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
