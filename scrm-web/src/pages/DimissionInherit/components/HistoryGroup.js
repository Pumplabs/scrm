import { useEffect } from 'react'
import { get } from 'lodash'
import { useAntdTable } from 'ahooks'
import CommonModal from 'components/CommonModal'
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
    if (visible && data.staffId) {
      runGetTableList(
        {
          current: 1,
          pageSize: 10,
        },
        {
          beginTime: '',
          endTime: '',
          keyword: '',
          staffId: data.staffId,
          status: '',
        }
      )
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, data])
  const columns = [
    {
      title: '群聊名称',
      dataIndex: 'name'
    },
    {
      title: '群标签',
      dataIndex: 'tags',
      render: val => <TagCell dataSource={val}/>
    },
    {
      title: '群人数',
      dataIndex: 'total'
    },
    {
      title: '新群主',
      dataIndex: 'newOwner',
      render: val => <UserTag data={val}/>
    },
    {
      title: '新群主所属部门',
      dataIndex: 'newDep',
      render: (_, record) => {
        const dep = record.takeover ? record.takeover.departmentList : []
        return <DepNames dataSource={dep}/>
      },
    },
    {
      title: '分配时间',
      dataIndex: 'createTime'
    }
  ]
  return (
    <CommonModal visible={visible} {...rest}>
        <Table
        columns={columns}
        {...tableProps}
      />
    </CommonModal>
  )
}
