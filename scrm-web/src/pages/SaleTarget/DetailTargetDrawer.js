import { useEffect } from 'react'
import { useRequest } from 'ahooks'
import CommonDrawer from 'components/CommonDrawer'
import { Table } from 'components/TableContent'
import UserTag from 'components/UserTag'
import { GetSaleTargetDetail } from 'services/modules/saleTarget'
import { formatNumber } from 'src/utils'

export default (props) => {
  const { data = {}, visible, ...rest } = props
  const {
    run: runGetSaleTargetDetail,
    data: detailData = [],
    loading: detailLoading,
  } = useRequest(GetSaleTargetDetail, {
    manual: true,
  })
  useEffect(() => {
    if (visible && data.id) {
      runGetSaleTargetDetail({
        id: data.id,
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const columns = [
    {
      title: '月份',
      dataIndex: 'month',
    },
    {
      title: '员工',
      dataIndex: 'staff',
      render: (val) => <UserTag data={val} />,
    },
    {
      title: '目标（元）',
      dataIndex: 'target',
      render: val => formatNumber(val, {
        padPrecision: 2
      })
    },
    {
      title: '已完成',
      dataIndex: 'finish',
      render: val => formatNumber(val, {
        padPrecision: 2
      })
    },
    {
      title: '完成率',
      dataIndex: 'finishPercent',
      render: val => `${val|| 0}%`
    },
    {
      title: '创建人',
      dataIndex: 'creator',
      render: (val) => <UserTag data={val} />,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
    },
  ]
  return (
    <CommonDrawer visible={visible} {...rest} width={740}>
      <Table
        dataSource={detailData}
        loading={detailLoading}
        columns={columns}
        pagination={false}
        scroll={{y: 500}}
      />
    </CommonDrawer>
  )
}
