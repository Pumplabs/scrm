import { useEffect } from 'react'
import { Button } from 'antd'
import { useAntdTable, useRequest } from 'ahooks'
import TableContent from 'components/TableContent'
import WeChatCell from 'components/WeChatCell'
import { MySelectModal } from 'components/MySelect'
import TagCell from 'components/TagCell'
import CommonDrawer from 'components/CommonDrawer'
import UserTag from 'components/UserTag'
import { DepNames } from 'components/DepName'
import TransferTipModal from './TransferTipModal'
import { GetCustomerList } from 'services/modules/customerManage'
import { TransferCustomer } from 'services/modules/incumbencyTransfer'
import { useModalHook, useTableRowSelect } from 'src/hooks'
import { handleHandleStatus, transferRequestData } from '../utils'
import { HANDLE_STATUS } from '../constants'

const shouldTransferCustomer = (record) => {
  if (record.staffTransferInfo) {
    return record.staffTransferInfo.status !== HANDLE_STATUS.WAIT
  } else {
    return true
  }
}
export default (props) => {
  const { visible, data = {}, ...rest } = props
  const { selectedProps, clearSelected, selectedKeys }  = useTableRowSelect()
  const {
    openModal,
    closeModal,
    visibleMap,
    modalInfo,
    requestConfirmProps,
    confirmLoading,
  } = useModalHook(['allot', 'transferTip'])
  const {
    tableProps,
    refresh: refreshTable,
    run: runGetCustomerList,
  } = useAntdTable(GetCustomerList, {
    manual: true,
    onFinally:() => {
      clearSelected()
    }
  })
  const { run: runTransferCustomer } = useRequest(TransferCustomer, {
    manual: true,
    ...requestConfirmProps,
    ...transferRequestData({
      successFn: () => {
        refreshTable()
        closeModal()
      },
    }),
  })
  const staffId = data.id

  useEffect(() => {
    if (visible) {
      runGetCustomerList(
        {
          current: 1,
          pageSize: 10,
        },
        {
          staffIds: [staffId],
        }
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onAllotRecord = (record) => {
    openModal('allot', {
      customerIds: [record.id],
    })
  }

  const onTipOk = (msg) => {
    const { user, customerIds } = modalInfo.data
    runTransferCustomer({
      customerStaffIds: customerIds.map(idItem => ({
        customerId: idItem,
        extStaffId: data.extId,
      })),
      takeoverStaffId: user.id,
      transferMsg: msg,
    })
  }

  const onAllot = () => {
    openModal('allot', {
      customerIds: selectedKeys,
    })
  }

  const onChooseUserOk = (users = []) => {
    const [user = {}] = users
    openModal('transferTip', {
      ...modalInfo.data,
      user,
    })
  }

  const columns = [
    {
      dataIndex: 'customerInfo',
      title: '客户名',
      width: 220,
      render: (_, record) => {
        return (
          <WeChatCell
            data={{
              avatarUrl: record.avatar,
              name: record.name,
              corpName: record.corpName,
            }}
          />
        )
      },
    },
    {
      dataIndex: 'extCreatorName',
      title: '所属员工',
      width: 120,
      render: (_, record) => (
        <UserTag
          data={{
            avatarUrl: record.extCreatorAvatar,
            name: record.extCreatorName,
          }}
        />
      ),
    },
    {
      title: '所属员工部门',
      ellipsis: true,
      dataIndex: 'deptIds',
      render: (_, record) => (
        <DepNames
          jsonStr={record.creatorStaff ? record.creatorStaff.deptIds : ''}
        />
      ),
    },
    {
      title: '转接状态',
      width: 160,
      dataIndex: 'status',
      render: (_, record) => {
        if (record.staffTransferInfo) {
          return handleHandleStatus(record.staffTransferInfo)
        } else {
          return ''
        }
      },
    },
    {
      dataIndex: 'tags',
      width: 180,
      title: '标签',
      render: (val, record) => {
        return <TagCell dataSource={val} />
      },
    },
    {
      dataIndex: 'createdAt',
      title: '添加时间',
      width: 160,
    },
    {
      dataIndex: 'updatedAt',
      width: 160,
      title: '更新时间',
    },
    {
      dataIndex: 'addWayName',
      title: '添加渠道',
      width: 160,
    },
  ]

  return (
    <CommonDrawer footer={false} visible={visible} {...rest} width={1000}>
      <TransferTipModal
        data={modalInfo.data}
        visible={visibleMap.transferTipVisible}
        onCancel={closeModal}
        confirmLoading={confirmLoading}
        onOk={onTipOk}
      />
      <MySelectModal
        type="user"
        disableArr={[`user_${staffId}`]}
        onlyChooseUser={true}
        visible={visibleMap.allotVisible}
        onCancel={closeModal}
        onOk={onChooseUserOk}
        title="选择员工"
        valueKey="id"
        max={1}
      />
      <TableContent
        tableLayout="auto"
        {...tableProps}
        scroll={{ x: 1000 }}
        rowKey="id"
        columns={columns}
        name={
          selectedKeys.length
            ? `已选择${selectedKeys.length}条数据`
            : null
        }
        operationCol={{ width: 100 }}
        rowSelection={{
          ...selectedProps.rowSelection,
          getCheckboxProps: (record) => {
            return {
              disabled: !shouldTransferCustomer(record)
            }
          }
        }}
        actions={[
          {
            title: '分配客户',
            disabled: record => !shouldTransferCustomer(record),
            onClick: onAllotRecord,
          },
        ]}
        toolBar={[
          <Button
            key="async"
            onClick={onAllot}
            type="primary"
            ghost
            disabled={selectedKeys.length === 0}>
            分配客户
          </Button>,
        ]}
      />
    </CommonDrawer>
  )
}
