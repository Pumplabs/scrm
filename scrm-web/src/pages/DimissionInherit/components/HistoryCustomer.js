import { useEffect } from 'react'
import { useAntdTable } from 'ahooks'
import CommonModal from 'components/CommonModal'
import WeChatCell from 'components/WeChatCell'
import UserTag from 'components/UserTag'
import { Table } from 'components/TableContent'
import TagCell from 'components/TagCell'
import { DepNames } from 'components/DepName'
import { GetCustomerTransferHistoryList } from 'services/modules/dimissionInherit'

export default (props) => {
  const { visible, data = {}, ...rest } = props
  const { tableProps, run: runGetTableList } = useAntdTable(
    GetCustomerTransferHistoryList,
    {
      manual: true,
    }
  )

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
      title: '客户昵称',
      dataIndex: 'customer',
      render: (val) => <WeChatCell data={val} />,
    },
    {
      title: '客户标签',
      dataIndex: 'tags',
      render: (val) => <TagCell dataSource={val} />,
    },
    {
      title: '分配时间',
      dataIndex: 'takeoverTime',
    },
    {
      title: '接替人',
      dataIndex: 'takeover',
      render: (val) => <UserTag data={val} />,
    },
    {
      title: '接替人部门',
      dataIndex: 'takeoverDep',
      render: (_, record) => {
        const dep = record.takeover ? record.takeover.departmentList : []
        return <DepNames dataSource={dep}/>
      },
    },
  ]
  return (
    <CommonModal visible={visible} {...rest}>
       <Table columns={columns} {...tableProps} />
    </CommonModal>
  )
}
