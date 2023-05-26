import { Form } from 'antd'
import { get } from 'lodash'
import SearchForm from 'components/SearchForm'
import TableContent from 'components/TableContent'
import TagCell from 'components/TagCell'
import UserTag from 'components/UserTag'
import WeChatCell from 'components/WeChatCell'
import CustomerDetailDrawer from './CustomerDrawer'
import { GetTableList } from 'services/modules/lossingCustomeHistory'
import { useModalHook, useTable } from 'src/hooks'
import { SEARCH_TYPE } from '../contants'

export default () => {
  const [searchForm] = Form.useForm()
  const {
    tableProps,
    search,
    refresh: refreshTable,
  } = useTable(
    (pager, vals = {}) =>
      GetTableList(pager, { ...vals, type: SEARCH_TYPE.USER_REMOVE_CUSTOMER }),
    {
      form: searchForm,
      pageSize: 10,
    }
  )
  const { openModal, closeModal, modalInfo, visibleMap } = useModalHook([
    'detail',
  ])

  const onDetailRecord = (record) => {
    openModal('detail', record)
  }

  const onCloseCustomerModal = (hasEdit) => {
    if (hasEdit) {
      refreshTable()
    }
    closeModal()
  }

  const columns = [
    {
      title: '删除客户',
      dataIndex: 'customer',
      width: 220,
      ellipsis: true,
      render: (val) => <WeChatCell data={val} />,
    },
    {
      title: '操作人',
      width: 120,
      dataIndex: 'staff',
      render: (val) => <UserTag data={val} />,
    },
    {
      title: '删除时间',
      width: 160,
      dataIndex: 'deleteTime',
    },
    {
      title: '添加时间',
      dataIndex: 'addTime',
      width: 120,
    },
    {
      title: '客户标签',
      width: 120,
      dataIndex: 'tags',
      render: (val, record) => (
        <TagCell dataSource={get(record, 'customer.tags')} />
      ),
    },
  ]

  const searchConfig = [
    {
      type: 'rangTime',
      label: '删除时间',
      name: 'times',
    },
    {
      label: '客户昵称',
      name: 'customerName',
      eleProps: {
        placeholder: '请输入客户昵称',
      },
    },
  ]
  return (
    <>
      <SearchForm
        form={searchForm}
        configList={searchConfig}
        onSearch={search.submit}
        onReset={search.reset}
      />
      <CustomerDetailDrawer
        title="客户详情"
        data={modalInfo.data}
        params={{
          customerId: get(modalInfo, 'data.customerId'),
          customerExtId: get(modalInfo, 'data.extCustomerId'),
          staffId: get(modalInfo, 'data.staffId'),
        }}
        staff={get(modalInfo, 'data.staff')}
        customerAvatar={get(modalInfo, 'data.customer')}
        visible={visibleMap.detailVisible}
        onCancel={onCloseCustomerModal}
      />
      <TableContent
        {...tableProps}
        rowKey="id"
        scroll={{ x: 1200 }}
        columns={columns}
        operationCol={{ width: 60 }}
        actions={[
          {
            title: '详情',
            onClick: onDetailRecord,
          },
        ]}
      />
    </>
  )
}
