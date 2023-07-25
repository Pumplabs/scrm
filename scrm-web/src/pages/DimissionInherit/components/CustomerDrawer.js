import { useEffect } from 'react'
import { Button } from 'antd'
import { useRequest } from 'ahooks'
import { GoldOutlined } from '@ant-design/icons'
import WeChatCell from 'components/WeChatCell'
import CustomerDrawer from 'components/CommonDrawer'
import { MySelectModal } from 'components/MySelect'
import { Table } from 'components/TableContent'
import TagCell from 'components/TagCell'
import { TransferTipModal } from 'src/pages/IncumbencyTransfer'
import { useModalHook, useTable } from 'src/hooks'
import { TransferCustomer, GetWaitTransferCustomerPage } from 'services/modules/dimissionInherit'
import { transferRequestData } from 'src/pages/IncumbencyTransfer/utils'

export default ({ visible, onCancel, data = {}, refreshCustomerList, ...rest }) => {
  const { tableProps, run: runGetTableList, selectedKeys } = useTable(
    GetWaitTransferCustomerPage,
    {
      manual: true,
      selected: true
    }
  )
  const { openModal ,closeModal, confirmLoading, visibleMap, requestConfirmProps, modalInfo } = useModalHook(['user', 'transferTip'])
  const refreshTable= () => {
    runGetTableList(
      {
        current: 1,
        pageSize: 10,
      },
      {
        "keyword": "",
        'dimissionTime': data.dimissionTime,
        "staffExtId": data.handoverStaffExtId,
      }
    )
  }
  const { run: runTransferCustomer } = useRequest(TransferCustomer, {
    manual: true,
    ...requestConfirmProps,
    ...transferRequestData({
      successFn: () => {
        closeModal()
        refreshCustomerList()
        refreshTable()
      }
    })
  })
  
  useEffect(() => {
    if (visible && data.handoverStaffExtId) {
      refreshTable()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, data])

  const onAllot = () => {
    openModal('user')
  }

  const onTipOk = (msg) => {
    const { takeoverStaffExtId, customerExtIds,handoverStaffExtId  } = modalInfo.data
    runTransferCustomer({
      "dimissionTime": data.dimissionTime,
      takeoverStaffExtId,
      customerExtIds,
      handoverStaffExtId,
      "transferMsg": msg
    })
  }

  const onChooseOk = (users = []) => {
    const [{extId} = {}] = users
    openModal('transferTip', {
      customerExtIds: selectedKeys,
      handoverStaffExtId: data.handoverStaffExtId,
      takeoverStaffExtId: extId,
    })
  }

  const columns = [
    {
      title: '客户名',
      dataIndex: 'customerInfo',
      render: (_, record) => {
        if (!record) {
          return null;
        }
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
      title: '添加时间',
      dataIndex: 'createdAt',
    },
    {
      title: '添加渠道',
      dataIndex: 'addWayName',
    }
  ]
  return (
    <CustomerDrawer
      footer={false}
      visible={visible}
      onCancel={onCancel}
      width={1000}
      {...rest}
    >
      <TransferTipModal
        data={modalInfo.data}
        visible={visibleMap.transferTipVisible}
        onCancel={closeModal}
        confirmLoading={confirmLoading}
        onOk={onTipOk}
      />
      <MySelectModal
        type="user"
        confirmLoading={confirmLoading}
        onlyChooseUser={true}
        visible={visibleMap.userVisible}
        onCancel={closeModal}
        onOk={onChooseOk}
        title="选择员工"
        valueKey="extId"
        max={1}
      />
      <Table
        columns={columns}
        name={selectedKeys.length ? `已选择${selectedKeys.length}条数据` : ''}
        rowKey="extId"
        toolBar={[
          <Button
            key="async"
            onClick={onAllot}
            type="primary"
            ghost
            icon={<GoldOutlined />}
            disabled={selectedKeys.length === 0}
          >
            分配给其他员工
          </Button>,
        ]}
        {...tableProps}
      />
    </CustomerDrawer>
  )
}
