import { useEffect } from 'react'
import TableContent from 'components/TableContent'
import CommonDrawer from 'components/CommonDrawer'
import UserTag from 'components/UserTag'
import { DepNames } from 'components/DepName'
import CustomerDrawer from './HistoryCustomer'
import GroupDrawer from './HistoryGroup'
import { GetDimmissionInherit } from 'services/modules/dimissionInherit'
import { useModalHook, useTable } from 'src/hooks'

export default (props) => {
  const { visible, data = {}, ...rest } = props
  const { openModal, closeModal, visibleMap, modalInfo, confirmLoading } =
    useModalHook(['customer', 'group'])
  const { tableProps, run: runGetTable } = useTable(GetDimmissionInherit, {
    manual: true,
  })

  useEffect(() => {
    if (visible) {
      runGetTable({}, {
        waitAllocated: false,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onDetailCustomer = (record) => {
    openModal('customer', record)
  }

  const onDetailGroup = (record) => {
    openModal('group', record)
  }

  const columns = [
    {
      dataIndex: 'staff',
      title: '离职员工',
      width: 220,
      render: (val) => <UserTag data={val} />,
    },
    {
      dataIndex: 'depName1',
      width: 180,
      ellipsis: true,
      title: '部门',
      render: (_, record) => (
        <DepNames
          dataSource={record.staff ? record.staff.departmentList : []}
        />
      ),
    },
    {
      title: '已分配客户数',
      dataIndex: 'customerCount',
      width: 120,
      render: (_, record) => record.transferCustomerNum > 0 ? record.transferCustomerNum : 0
    },
    {
      title: '已分配群聊数',
      dataIndex: 'groupCount',
      width: 120,
      render: (_, record) => record.transferGroupChatNum > 0 ? record.transferGroupChatNum : 0
    },
    {
      dataIndex: 'resignedTime',
      title: '离职时间',
      width: 160,
    },
  ]

  return (
    <CommonDrawer footer={false} visible={visible} {...rest} width={1000}>
      <CustomerDrawer
        data={modalInfo.data}
        visible={visibleMap.customerVisible}
        onCancel={closeModal}
        confirmLoading={confirmLoading}
        title="已分配客户"
        footer={null}
      />
      <GroupDrawer
        data={modalInfo.data}
        visible={visibleMap.groupVisible}
        onCancel={closeModal}
        confirmLoading={confirmLoading}
        title="已分配群聊"
        footer={null}
      />
      <TableContent
        {...tableProps}
        scroll={{ x: 1000 }}
        operationCol={{ width: 180 }}
        rowKey={(record, idx) => `${record.staffId}_${idx}`}
        columns={columns}
        actions={[
          {
            title: '已分配客户',
            onClick: onDetailCustomer,
          },
          {
            title: '已分配群聊',
            onClick: onDetailGroup
          },
        ]}
      />
    </CommonDrawer>
  )
}
