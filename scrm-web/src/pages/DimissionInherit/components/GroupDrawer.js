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
import { actionRequestHookOptions } from 'services/utils'

export default ({ visible, onCancel, data = {}, ...rest }) => {
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
        keyword: '',
        staffId: data.staffId,
      }
    )
  }
  const { openModal ,closeModal, confirmLoading, visibleMap, requestConfirmProps } = useModalHook(['user'])
  const { selectedProps, clearSelected, selectedKeys, selectedStatStr } = useTableRowSelect()
  const { run: runTransferGroup } = useRequest(TransferGroup, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '分配',
      successFn: () => {
        clearSelected()
        refreshTable()
        closeModal()
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

  const onChooseOk = (users = []) => {
    const [{id} = {}] = users
    runTransferGroup({
      "groupChatIds": selectedKeys,
      "takeoverStaffId": id,
    })
  }

  const columns = [
    {
      title: '群聊名称',
      dataIndex: 'name'
    },
    {
      title: '群标签',
      dataIndex: 'tags',
      render:val => <TagCell dataSource={val}/>
    },
    {
      title: '群人数',
      dataIndex: 'total'
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt'
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