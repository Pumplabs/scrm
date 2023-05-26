import { useEffect } from 'react'
import { useRequest } from 'ahooks'
import { Tooltip } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import CommonDrawer from 'components/CommonDrawer'
import DescriptionsList from 'components/DescriptionsList'
import WeChatCell from 'components/WeChatCell'
import UserTag from 'components/UserTag'
import { Table } from 'components/TableContent'
import { formatNumber } from 'src/utils'
import { calcPrice } from '../../utils'
import { GetOrderDetail } from 'services/modules/orderList'
import { DownFileByFileId } from 'services/modules/common'
import { ORDER_STATUS_VALS } from '.././../../constants'
import styles from './index.module.less'

export default (props) => {
  const { visible, data = {}, ...rest } = props
  const fileList = Array.isArray(data.attachments) ? data.attachments : []
  const { run: runGetOrderDetail, data: orderData = {} } = useRequest(
    GetOrderDetail,
    {
      manual: true,
    }
  )
  useEffect(() => {
    if (visible) {
      runGetOrderDetail({
        id: data.id,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onDownloadFile = (item) => {
    DownFileByFileId(
      {
        fileId: item.id,
      },
      item.name
    )
  }

  const columns = [
    {
      title: '产品名称',
      width: 160,
      dataIndex: 'productName',
    },
    {
      title: '原价',
      width: 100,
      dataIndex: 'productPrice',
      render: (val) =>
        formatNumber(val, {
          padPrecision: 2,
        }),
    },
    {
      title: '优惠价格（元）',
      width: 140,
      dataIndex: 'newPrice',
      render: (_, record) =>
        formatNumber(calcPrice(record.price, record.discount), {
          padPrecision: 2,
        }),
    },
    {
      title: '数量',
      width: 80,
      dataIndex: 'productNum',
    },
    {
      title: '折扣（%）',
      width: 100,
      dataIndex: 'discount',
      render: (val) => val * 100,
    },
    {
      title: '描述',
      ellipsis: true,
      dataIndex: 'remark',
      width: 200,
    },
  ]
  return (
    <CommonDrawer visible={visible} {...rest} footer={null} width={800}>
      <DescriptionsList labelWidth={140}>
        <DescriptionsList.Item label="客户">
          <WeChatCell data={orderData.customer} />
        </DescriptionsList.Item>
        <DescriptionsList.Item label="负责人">
          <UserTag data={orderData.managerStaff} />
        </DescriptionsList.Item>
        <DescriptionsList.Item label="产品">
          <Table
            columns={columns}
            dataSource={orderData.orderProductList}
            scroll={{ x: 600 }}
          />
        </DescriptionsList.Item>
        <DescriptionsList.Item label="折扣">
          {(orderData.discount || 0) * 100}%
        </DescriptionsList.Item>
        <DescriptionsList.Item label="订单金额">
          {formatNumber(orderData.orderAmount)}
        </DescriptionsList.Item>
        <DescriptionsList.Item label="收款金额">
          {formatNumber(orderData.collectionAmount || 0, {
            padPrecision: 2,
          })}
        </DescriptionsList.Item>
        <DescriptionsList.Item label="描述">
          {orderData.description}
        </DescriptionsList.Item>
        <DescriptionsList.Item label="附件">
          <FileList dataSource={fileList} onDownload={onDownloadFile} />
        </DescriptionsList.Item>
        {orderData.status === ORDER_STATUS_VALS.REJECT ? (
          <DescriptionsList.Item label="不通过原因">
            {orderData.auditFailedMsg}
          </DescriptionsList.Item>
        ) : null}
      </DescriptionsList>
    </CommonDrawer>
  )
}

const FileList = ({ dataSource = [], onDownload }) => {
  return (
    <ul className={styles['files-ul']}>
      {dataSource.map((ele) => (
        <li className={styles['file-item']} key={ele.id}>
          <span className={styles['file-name']}>
            <Tooltip title={ele.name} placement="topLeft">
              {ele.name}
            </Tooltip>
          </span>
          <DownloadOutlined
            className={styles['download-icon']}
            onClick={() => {
              onDownload(ele)
            }}
          />
        </li>
      ))}
    </ul>
  )
}
