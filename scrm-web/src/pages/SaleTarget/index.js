import { useEffect } from 'react'
import { Form, Button, Modal } from 'antd'
import { useRequest } from 'ahooks'
import { PlusOutlined } from '@ant-design/icons'
import moment from 'moment'
import SearchForm from 'components/SearchForm'
import UserTag from 'components/UserTag'
import TableContent from 'components/TableContent'
import { PageContent } from 'layout'
import { useModalHook } from 'src/hooks'
import AddTargetDrawer from './AddTargetDrawer'
import DetailTargetDrawer from './DetailTargetDrawer'
import { actionRequestHookOptions } from 'services/utils'
import { formatNumber } from 'src/utils'
import {
  GetSaleTargetList,
  AddSaleTarget,
  RemoveSaleTarget,
  EditSaleTarget,
} from 'services/modules/saleTarget'

export default () => {
  const [searchForm] = Form.useForm()
  const {
    data: saleTargetList = [],
    loading,
    run: runGetSaleTargetList,
    refresh,
  } = useRequest(GetSaleTargetList, {
    manual: true,
    pageSize: 10,
  })
  const {
    openModal,
    closeModal,
    visibleMap,
    modalInfo,
    requestConfirmProps,
    confirmLoading,
  } = useModalHook(['add', 'detail', 'adjust'])
  const { run: runAddSaleTarget } = useRequest(AddSaleTarget, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '创建',
      successFn: () => {
        refresh()
        closeModal()
      },
    }),
  })
  const { run: runEditSaleTarget } = useRequest(EditSaleTarget, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '调解',
      successFn: () => {
        refresh()
        closeModal()
      },
    }),
  })
  const { run: runRemoveSaleTarget } = useRequest(RemoveSaleTarget, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: refresh,
    }),
  })

  const onAdjustRecord = (record) => {
    openModal('adjust', record)
  }
  const onRemoveRecord = (record) => {
    Modal.confirm({
      title: '提示',
      content: `确定要删除此目标吗`,
      onOk: () => {
        runRemoveSaleTarget({
          id: record.id,
        })
      },
    })
  }
  const onDetailRecord = (record) => {
    openModal('detail', record)
  }

  const onAdd = () => {
    openModal('add')
  }
  const onSearch = () => {
    const vals = searchForm.getFieldsValue()
    runGetSaleTargetList(vals)
  }

  const onReset = () => {
    searchForm.resetFields()
    onSearch()
  }
  const onAddOk = (vals) => {
    const { month, staffExtId, target } = vals
    let params = {
      month: month.format('YYYY-MM'),
      staffExtId,
      target,
    }
    if (modalInfo.type === 'add') {
      runAddSaleTarget(params)
    } else {
      params.id = modalInfo.data.id
      runEditSaleTarget(params)
    }
  }
  useEffect(() => {
    onSearch()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const columns = [
    {
      title: '员工',
      dataIndex: 'staff',
      render: (val) => <UserTag data={val} />,
    },
    {
      title: '本月目标（元）',
      dataIndex: 'target',
      render: val => formatNumber(val)
    },
    {
      title: '已完成',
      dataIndex: 'finish',
      render: val => formatNumber(val)
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
  const searchConfig = [
    {
      label: '月份',
      name: 'time',
      type: 'date',
      eleProps: {
        picker: 'month',
      },
    },
  ]
  return (
    <PageContent>
      <AddTargetDrawer
        visible={visibleMap.addVisible || visibleMap.adjustVisible}
        data={modalInfo.data}
        onCancel={closeModal}
        confirmLoading={confirmLoading}
        title={modalInfo.type === 'add' ? '创建目标' : '调整目标'}
        onOk={onAddOk}
      />
      <DetailTargetDrawer
        visible={visibleMap.detailVisible}
        data={modalInfo.data}
        onCancel={closeModal}
        title={'目标详情'}
        footer={null}
      />
      <SearchForm
        form={searchForm}
        initialValues={{
          time: moment(),
        }}
        configList={searchConfig}
        onSearch={onSearch}
        onReset={onReset}
      />
      <TableContent
        dataSource={saleTargetList}
        loading={loading}
        pagination={false}
        columns={columns}
        actions={[
          {
            title: '调整',
            onClick: onAdjustRecord,
          },
          {
            title: '删除',
            onClick: onRemoveRecord,
          },
          {
            title: '详情',
            onClick: onDetailRecord,
          },
        ]}
        toolBar={[
          <Button
            key="add"
            type="primary"
            onClick={onAdd}
            ghost
            icon={<PlusOutlined />}>
            创建目标
          </Button>,
        ]}
      />
    </PageContent>
  )
}
