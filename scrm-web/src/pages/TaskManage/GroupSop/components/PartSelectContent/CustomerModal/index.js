import { useMemo } from 'react'
import CommonModal from 'components/CommonModal'
import { Table } from 'components/TableContent'
import WeChatCell from 'components/WeChatCell'
import TagCell from 'components/TagCell'
import UserTag from 'components/UserTag'
import { UNSET_GROUP_NAME } from 'src/utils/constants'

const groupColumns = [
  {
    title: '群名称',
    dataIndex: 'name',
    render: val => val ? val : UNSET_GROUP_NAME
  },
  {
    title: '群主',
    dataIndex: 'ownerInfo',
    render: val => <UserTag data={val}/>
  },
  {
    title: '标签',
    dataIndex: 'tags',
    width: 160,
    render: (val) => <TagCell dataSource={val} />,
  },
  {
    title: '创建时间',
    dataIndex: 'createdAt',
  }
]
const customerColumns = [
  {
    title: '客户',
    width: 180,
    dataIndex: 'name',
    render: (val, record) => (
      <WeChatCell data={val ? { name: val, avatar: record.avatar } : {}} />
    ),
  },
  {
    title: '标签',
    dataIndex: 'tags',
    render: (val) => <TagCell dataSource={val} />,
  }
]

export default (props) => {
  const { data = [], type, ...rest } = props

  const columns = useMemo(() => {
   if (type === 'customer') {
     return customerColumns
   } else if (type === 'group') {
     return groupColumns
   } else {
     return []
   }
  }, [type])
  return (
    <CommonModal {...rest}>
      <Table columns={columns} dataSource={data} />
    </CommonModal>
  )
}
