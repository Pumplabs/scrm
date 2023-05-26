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
import { TransferCustomer, GetWaitTransferCustomer } from 'services/modules/dimissionInherit'
import { actionRequestHookOptions } from 'services/utils'
import { transferRequestData } from 'src/pages/IncumbencyTransfer/utils'

export default ({ visible, onCancel, data = {}, ...rest }) => {
  const { tableProps, run: runGetTableList, selectedKeys } = useTable(
    GetWaitTransferCustomer,
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
        "staffId": data.staffId,
      }
    )
  }
  const { run: runTransferCustomer } = useRequest(TransferCustomer, {
    manual: true,
    ...requestConfirmProps,
    ...transferRequestData({
      successFn: () => {
        closeModal()
        refreshTable()
      }
    })
  })
  
  useEffect(() => {
    if (visible && data.staffId) {
      refreshTable()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, data])

  const onAllot = () => {
    openModal('user')
  }

  const onTipOk = (msg) => {
    const { takeoverStaffId, customerIds,handoverStaffId  } = modalInfo.data
    runTransferCustomer({
      takeoverStaffId,
      customerIds,
      handoverStaffId,
      "transferMsg": msg
    })
  }

  const onChooseOk = (users = []) => {
    const [{id} = {}] = users
    openModal('transferTip', {
      "customerIds": selectedKeys,
      "handoverStaffId": data.staffId,
      takeoverStaffId: id,
    })
  }

  const columns = [
    {
      title: '客户名',
      dataIndex: 'customerInfo',
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
      title: '客户标签',
      dataIndex: 'tags',
      render: (val) => <TagCell dataSource={val} />,
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
      columns={columns}
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
        valueKey="id"
        max={1}
      />
      <Table
        columns={columns}
        name={selectedKeys.length ? `已选择${selectedKeys.length}条数据` : ''}
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
