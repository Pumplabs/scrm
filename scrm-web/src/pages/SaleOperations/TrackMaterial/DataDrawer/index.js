import React, { useEffect } from 'react'
import { get} from 'lodash'
import CommonDrawer from 'components/CommonDrawer'
import { Table } from 'components/TableContent'
import UserTag from 'components/UserTag'
import WeChatCell from 'components/WeChatCell'
import { GetMaterialData } from 'services/modules/trackMaterial'
import { useTable } from 'src/hooks'
import { getDiffStr } from 'src/utils/times'

export default (props) => {
  const { data = {}, onOk, visible, ...rest } = props
  const { tableProps, run: runGetMaterialData } = useTable(GetMaterialData, {
    manual: true,
  })

  useEffect(() => {
    if (visible && data.id) {
      runGetMaterialData({}, {
        id: data.id,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, data.id])

  const columns = [
    {
      title: '客户',
      dataIndex: 'wxCustomer',
      render: val => <WeChatCell data={val}/>
    },
    {
      title: '是否好友',
      dataIndex: 'isFriend',
      render: (_, record) => {
        const flag = get(record, 'wxCustomer.hasFriend')
        return flag ? '是' : '否'
      }
    },
    {
      title: '发送员工',
      dataIndex: 'staff',
      render: val => <UserTag data={val}/>
    },
    {
      title: '查看时间',
      dataIndex: 'createdAt',
    },
    {
      title: '查看时长',
      dataIndex: 'time',
      render: val => val ?  getDiffStr(val) : '-'
    },
  ]
  return (
    <CommonDrawer
      title="数据详情"
      visible={visible}
      footer={null}
      width={720}
      {...rest}>
       <Table columns={columns} {...tableProps} />
    </CommonDrawer>
  )
}
