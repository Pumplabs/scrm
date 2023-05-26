import { useEffect } from 'react'
import { useAntdTable } from 'ahooks'
import TableContent from 'components/TableContent'
import WeiChatCell from 'components/WeChatCell'
import TagCell from 'components/TagCell'
import { DepNames } from 'components/DepName'
import UserTag from 'components/UserTag'
import { GetTransferHistoryList } from 'services/modules/incumbencyTransfer'
import CommonDrawer from 'components/CommonDrawer'
import { handleHandleStatus } from '../utils'

export default (props) => {
  const { data = {}, visible, ...rest } = props
  const {
    tableProps,
    run: runGetTable,
    cancel,
  } = useAntdTable(GetTransferHistoryList, {
    manual: true,
  })

  useEffect(() => {
    if (visible) {
      runGetTable({
        current: 1,
      })
    } else {
      if (tableProps.loading) {
        cancel()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const columns = [
    {
      dataIndex: 'customerInfo',
      title: '客户名',
      width: 220,
      render: (_, record) => {
        return <WeiChatCell data={record.customer} />
      },
    },
    {
      dataIndex: 'tags',
      width: 160,
      title: '客户标签',
      render: (val, record) => {
        return <TagCell dataSource={val} />
      },
    },
    {
      title: '转接状态',
      dataIndex: 'status',
      width: 120,
      render: (_, record) => handleHandleStatus(record)
    },
    {
      dataIndex: 'takeover',
      title: '接替员工',
      width: 120,
      render: (val, record) => <UserTag data={val} />,
    },
    {
      title: '接替员工所属部门',
      ellipsis: true,
      dataIndex: 'takeover1',
      render: (_, record) => (
        <DepNames
          dataSource={record.takeover ? record.takeover.departmentList : []}
        />
      ),
    },
    {
      dataIndex: 'handover',
      title: '原添加人',
      width: 120,
      render: (val, record) => <UserTag data={val} />,
    },
    {
      title: '原添加人所属部门',
      ellipsis: true,
      dataIndex: 'handover1',
      render: (_, record) => (
        <DepNames
          dataSource={record.takeover ? record.takeover.departmentList : []}
        />
      ),
    },
    {
      dataIndex: 'createTime',
      title: '添加时间',
      width: 160,
    },
  ]
  return (
    <CommonDrawer visible={visible} {...rest} width={1000} footer={null}>
      <TableContent
        {...tableProps}
        columns={columns}
      />
    </CommonDrawer>
  )
}
