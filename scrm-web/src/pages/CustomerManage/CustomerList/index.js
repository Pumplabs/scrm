import { useMemo } from 'react'
import { Button, Form, message, Modal, Spin } from 'antd'
import { useRequest } from 'ahooks'
import { get } from 'lodash'
import {
  SyncOutlined,
  ExportOutlined,
  TagOutlined,
  TagsOutlined,
} from '@ant-design/icons'
import SearchForm from 'components/SearchForm'
import TableContent from 'components/TableContent'
import WeChatCell from 'components/WeChatCell'
import UserTag from 'components/UserTag'
import TagCell from 'components/TagCell'
import { DepNames } from 'components/DepName'
import { ChooseTagModal } from 'components/TagSelect'
import { useModalHook, useTable } from 'src/hooks'
import { SUCCESS_CODE } from 'utils/constants'
import DetailDrawer from './components/DetailDrawer'
import {
  actionRequestHookOptions,
  getRequestError,
  exportByLink,
} from 'services/utils'
import {
  GetCustomerList,
  ExportCustomer,
  AsyncCustomer,
  BatchMarkTag,
} from 'services/modules/customerManage'
import { getTagsByStaffId } from './utils'
import styles from './index.module.less'

export default () => {
  const {
    openModal,
    closeModal,
    modalInfo,
    visibleMap,
    confirmLoading,
    requestConfirmProps,
  } = useModalHook(['detail', 'markTags', 'removeTags'])
  const [searchForm] = Form.useForm()
  const {
    tableProps,
    selectedKeys,
    refresh: refreshTable,
    search,
    params: searchParams,
    selectedRows,
  } = useTable(GetCustomerList, {
    selected: true,
    form: searchForm,
    pageSize: 10,
  })
  const { run: runAsyncData, loading: asyncLoading } = useRequest(
    AsyncCustomer,
    {
      manual: true,
      ...actionRequestHookOptions({
        actionName: '同步',
        successFn: () => {
          refreshTable()
        },
      }),
    }
  )
  const { run: runBatchMarkTag } = useRequest(BatchMarkTag, {
    manual: true,
    ...requestConfirmProps,
    onSuccess: (res) => {
      closeModal()
      refreshTable()
      if (res.code === SUCCESS_CODE && res.data) {
        const { failList = [], successList = [] } = res.data
        const failCount = Array.isArray(failList) ? failList.length : 0
        const successCount = Array.isArray(successList) ? successList.length : 0
        if (!successCount) {
          message.error('操作失败')
        } else {
          if (!failCount) {
            message.success('操作成功')
          } else {
            Modal.info({
              title: '操作结果',
              content: `操作成功：${successCount},操作失败：${failCount}`,
              onOk: () => {},
            })
          }
        }
      } else {
        message.error('操作失败')
      }
    },
    onError: (e) => {
      getRequestError(e, '操作失败')
    },
  })
  const { run: runExportCustomer } = useRequest(ExportCustomer, {
    manual: true,
    onSuccess: (res) => {
      exportByLink(res)
      message.info('正在导出中...')
    },
    onError: (e) => getRequestError(e, '导出异常'),
  })

  const onDetailRecord = (data) => {
    openModal('detail', data)
  }

  const onAsyncData = () => {
    runAsyncData()
  }

  const onExport = async () => {
    const [, params] = searchParams
    runExportCustomer(params)
  }

  const onCloseDetailDrawer = (hasEdit) => {
    if (hasEdit) {
      refreshTable()
    }
    closeModal()
  }

  const onChooseTagsOk = (vals) => {
    const tagIds = vals.tags.map((ele) => ele.id)
    const customerIds = selectedRows.map((item) => ({
      customerId: item.id,
      extStaffId: item.creatorStaff.extId,
    }))
    let params = {
      customerIds,
    }
    if (modalInfo.type === 'removeTags') {
      params = {
        ...params,
        removeTags: tagIds,
      }
    } else {
      params = {
        ...params,
        tagIds,
      }
    }
    runBatchMarkTag(params)
  }

  const onBatchMark = () => {
    openModal('markTags')
  }

  const onRemoveTags = () => {
    openModal('removeTags')
  }

  const columns = [
    {
      dataIndex: 'customerInfo',
      title: '客户名',
      width: 220,
      render: (_, record) => {
        return (
          <WeChatCell
            data={{
              avatarUrl: record.avatar,
              name: record.name,
              corpName: record.corpName,
            }}
            extra={record.isDeletedStaff ? <span className={styles['remove-tip']}>已删除员工好友</span> : ''}
          />
        )
      },
    },
    {
      dataIndex: 'extCreatorName',
      title: '所属员工',
      width: 120,
      render: (_, record) => (
        <UserTag
          data={{
            avatarUrl: record.extCreatorAvatar,
            name: record.extCreatorName,
          }}
        />
      ),
    },
    {
      title: '所属员工部门',
      width: 120,
      ellipsis: true,
      dataIndex: 'dpe2',
      render: (_, record) => {
        return (
          <DepNames dataSource={get(record, 'creatorStaff.departmentList')} />
        )
      },
    },
    {
      dataIndex: 'user1',
      width: 200,
      title: '标签',
      render: (val, record) => (
        <TagCell dataSource={getTagsByStaffId(record)} />
      ),
    },
    {
      dataIndex: 'createdAt',
      title: '添加时间',
      width: 160,
    },
    {
      dataIndex: 'updatedAt',
      width: 160,
      title: '更新时间',
    },
    {
      dataIndex: 'addWayName',
      title: '添加渠道',
      width: 160,
    },
  ]
  const searchConfig = [
    {
      type: 'input',
      label: '客户名',
      name: 'name',
    },
    {
      label: '所属员工',
      name: 'extCreatorIds',
      type: 'userSelect',
    },
    {
      type: 'rangTime',
      label: '添加时间',
      name: 'createTime',
    },
  ]

  const enableEnterQuery = useMemo(() => {
    return Object.values(visibleMap).some((item) => item)
  }, [visibleMap])

  return (
    <>
      <Spin spinning={asyncLoading} tip="正在同步中...">
        <SearchForm
          name="customerSearch"
          configList={searchConfig}
          form={searchForm}
          enableEnterQuery={!enableEnterQuery}
          onSearch={search.submit}
          onReset={search.reset}
        />
        <DetailDrawer
          title="客户详情"
          data={modalInfo.data}
          params={{
            customerId: get(modalInfo, 'data.id'),
            customerExtId: get(modalInfo, 'data.extId'),
            staffId: get(modalInfo, 'data.creatorStaff.id'),
          }}
          customerAvatar={{
            corpName: get(modalInfo, 'data.corpName'),
            name: get(modalInfo, 'data.name'),
            avatarUrl: get(modalInfo, 'data.avatar'),
          }}
          staff={get(modalInfo, 'data.creatorStaff')}
          visible={visibleMap.detailVisible}
          onCancel={onCloseDetailDrawer}
        />
        <ChooseTagModal
          title={
            modalInfo.type === 'removeTags' ? '选择需要移除的标签' : '选择标签'
          }
          visible={visibleMap.markTagsVisible || visibleMap.removeTagsVisible}
          tagType="customer"
          valueIsItem={true}
          confirmLoading={confirmLoading}
          onCancel={closeModal}
          onOk={onChooseTagsOk}
        />
        <TableContent
          {...tableProps}
          scroll={{ x: 1200 }}
          rowKey={(record) => `${record.id}_${record.extCreatorId}`}
          columns={columns}
          actions={[
            {
              title: '详情',
              onClick: onDetailRecord,
            },
          ]}
          toolBar={[
            <Button
              key="mark"
              onClick={onBatchMark}
              type="primary"
              ghost
              disabled={selectedKeys.length === 0}
              icon={<TagOutlined />}>
              批量打标签
            </Button>,
            <Button
              key="removeMark"
              onClick={onRemoveTags}
              type="primary"
              ghost
              disabled={selectedKeys.length === 0}
              icon={<TagsOutlined />}>
              批量移除标签
            </Button>,
            <Button
              key="async"
              onClick={onAsyncData}
              type="primary"
              ghost
              loading={asyncLoading}>
              <SyncOutlined />
              同步数据
            </Button>,
            <Button key="export" onClick={onExport} type="primary" ghost>
              <ExportOutlined />
              导出excel
            </Button>,
          ]}
        />
      </Spin>
    </>
  )
}
