import { useEffect } from 'react'
import { Button } from 'antd'
import { useAntdTable, useRequest } from 'ahooks'
import { GoldOutlined } from '@ant-design/icons'
import CommonDrawer from 'components/CommonDrawer'
import { Table } from 'components/TableContent'
import TagCell from 'components/TagCell'
import { MySelectModal } from 'components/MySelect'
import { useTableRowSelect, useModalHook } from 'src/hooks'
import { GetWaitTransferGroup, TransferGroup } from 'services/modules/dimissionInherit'
import { transferRequestData } from 'src/pages/IncumbencyTransfer/utils'

export default ({ visible, onCancel, data = {}, refreshChatList, ...rest }) => {
  const { tableProps, run: runGetTableList } = useAntdTable(GetWaitTransferGroup, {
    manual: true
  })
  const refreshTable = () => {
    runGetTableList(
      {
        current: 1,
        pageSize: 10,
      },
      {
        handoverStaffExtId: data.handoverStaffExtId,
      }
    )
  }
  const { openModal ,closeModal, confirmLoading, visibleMap, requestConfirmProps } = useModalHook(['user'])
  const { selectedProps, clearSelected, selectedKeys } = useTableRowSelect()
  const { run: runTransferGroup } = useRequest(TransferGroup, {
    manual: true,
    ...requestConfirmProps,
    ...transferRequestData({
      successFn: () => {
        clearSelected()
        closeModal()
        refreshChatList()
        refreshTable()
      }
    })
  })

  useEffect(() => {
    if (visible && data.handoverStaffExtId) {
      refreshTable()
    } else {
      if (selectedKeys.length) {
        clearSelected()
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, data])

  const onAllot = () => {
    openModal('user')
  }

  const onChooseOk = (users = []) => {
    const [{extId } = {}] = users
    runTransferGroup({
      "groupChatExtIds": selectedKeys,
      "takeoverStaffExtId": extId,
    })
  }

  const columns = [
    {
      title: '群聊名称',
      dataIndex: 'groupChat',
      render: val => val?.name
    },
    {
      title: '群标签',
      dataIndex: 'tags',
      render:(val, record) => {
        const tags = record.groupChat?.tags
        return tags?.length ?  <TagCell dataSource={tags}/> : null
      }
    },
    {
      title: '群人数',
      dataIndex: 'total',
      render: (_, record) => record.groupChat?.total
    },
    {
      title: '创建时间',
      dataIndex: 'createTime'
    }
  ]
  return (
    <CommonDrawer
      columns={columns}
      footer={false}
      visible={visible}
      onCancel={onCancel}
      width={1000}
      {...rest}
    >
      <MySelectModal
        type="user"
        confirmLoading={confirmLoading}
        disableArr={[`user_${data.staffId}`]}
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
        {...selectedProps}
        rowKey="groupChatExtId"
        name={selectedKeys.length ? `已选择${selectedKeys.length}条数据` : ''}
        toolBar={
          [
            <Button
              key="async"
              onClick={onAllot}
              type="primary"
              ghost
              icon={<GoldOutlined />}
              disabled={selectedKeys.length === 0}
            >
              分配给其他员工
            </Button>
          ]
        }
        {...tableProps}
      />
    </CommonDrawer>
  )
}