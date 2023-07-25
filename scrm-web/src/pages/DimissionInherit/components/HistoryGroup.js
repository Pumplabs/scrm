import { useEffect } from 'react'
import { useAntdTable } from 'ahooks'

import CustomerDrawer from 'components/CommonDrawer'
import UserTag from 'components/UserTag'
import { DepNames } from 'components/DepName'
import { Table } from 'components/TableContent'
import TagCell from 'components/TagCell'
import { GetGroupTransferHistory } from 'services/modules/dimissionInherit'

export default (props) => {
  const { visible, data = {}, ...rest } = props
  const { tableProps, run: runGetTableList  } = useAntdTable(GetGroupTransferHistory, {
    manual: true
  })
  useEffect(() => {
    if (visible ) {
      runGetTableList(
        {
          current: 1,
          pageSize: 10,
        }
      )
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])
  
  const columns = [
    {
      title: '群聊名称',
      dataIndex: 'name',
      render: (_, record) => record?.groupChat?.name
    },
    {
      title: '群标签',
      dataIndex: 'tags',
      render: (_, record) => <TagCell dataSource={record.groupChat?.tags}/>
    },
    {
      title: '群人数',
      dataIndex: 'total',
      render: (_, record) => record.groupChat?.total
    },
    {
      title: '新群主',
      dataIndex: 'takeoverStaff',
      render: val => <UserTag data={val}/>
    },
    {
      title: '新群主所属部门',
      dataIndex: 'newDep',
      render: (_, record) => {
        const dep = record.takeoverStaff?.departmentList || []
        return <DepNames dataSource={dep}/>
      },
    },
    {
      title: '原群主',
      dataIndex: 'handoverStaff',
      render: (val, record) => <UserTag data={{
        name: record.handoverStaffExtId
      }}/>
    },
    // handoverStaff
    {
      title: '分配时间',
      dataIndex: 'createTime'
    }
  ]
  return (
    <CustomerDrawer footer={false} visible={visible} width={1000} {...rest}>
        <Table
        columns={columns}
        {...tableProps}
      />
    </CustomerDrawer>
  )
}
