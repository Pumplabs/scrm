import { useState } from 'react'
import { Button, message, Form, Modal } from 'antd'
import { useNavigate } from 'react-router'
import { useAntdTable, useRequest } from 'ahooks'
import { uniqBy, get } from 'lodash'
import { ExportOutlined, SyncOutlined } from '@ant-design/icons'
import SearchForm from 'components/SearchForm'
import TagCell from 'components/TagCell'
import { PageContent } from 'layout'
import TableContent from 'components/TableContent'
import UserTag from 'components/UserTag'
import { DepNames } from 'components/DepName'
import GroupOwnerSelect from 'components/GroupOwnerSelect'
import TagGroupSelect from './TagGroupSelect'
import MarkTagDrawer from './MarkTagDrawer'
import {
  actionRequestHookOptions,
  exportByLink,
  getRequestError,
} from 'services/utils'
import { MarkGroupChatTag } from 'services/modules/groupChatTag'
import {
  GetGroupList,
  AsyncGroupList,
  ExportGroupChat,
} from 'services/modules/customerChatGroup'
import { useModalHook } from 'src/hooks'
import { UNSET_GROUP_NAME } from 'utils/constants'

export default () => {
  const [searchForm] = Form.useForm()
  const navigate = useNavigate()
  const [tableSelectionKeys, setTableSelectionKeys] = useState([])
  const [tableSelectedRows, setTableSelectedRows] = useState([])
  const {
    openModal,
    closeModal,
    modalInfo,
    visibleMap,
    setConfirm,
    confirmLoading,
  } = useModalHook(['markTag'])
  const {
    tableProps,
    refresh: refreshTable,
    search,
    params: searchParams,
  } = useAntdTable(GetGroupList, {
    form: searchForm,
    pageSize: 10,
    onSuccess: () => {
      setTableSelectionKeys([])
      setTableSelectedRows([])
    },
  })
  const { run: runAsyncData, loading: asyncLoading } = useRequest(
    AsyncGroupList,
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

  const { run: runExportGroupChat } = useRequest(ExportGroupChat, {
    manual: true,
    onSuccess: (res) => {
      exportByLink(res)
      message.info('正在导出中...')
    },
    onError: (e) => getRequestError(e, '导出异常'),
  })

  const { run: runMarkGroupChatTag } = useRequest(MarkGroupChatTag, {
    manual: true,
    onBefore: () => {
      setConfirm()
    },
    onFinally: () => {
      setConfirm(false)
    },
    ...actionRequestHookOptions({
      actionName: '操作',
      successFn: () => {
        closeModal()
        refreshTable()
      },
    }),
  })

  const onTableRowChange = (keys, rows) => {
    setTableSelectionKeys(keys)
    setTableSelectedRows(rows)
  }

  const onDetailRecord = (data) => {
    navigate(`/groupList/detail/${data.id}`)
  }

  const onAsyncData = () => {
    runAsyncData()
  }

  const onBatchMarkTag = () => {
    let arr = []
    tableSelectedRows.forEach((ele) => {
      const tags = Array.isArray(ele.tags) ? ele.tags : []
      arr = [...arr, ...tags]
    })
    openModal('markTag', {
      selectedTags: uniqBy(arr, 'id'),
    })
  }

  const onExport = () => {
    const [, params] = searchParams
    runExportGroupChat(params)
  }

  const onMarkTagOk = (arr, keys) => {
    const names = arr
      .slice(0, 2)
      .map((ele) => ele.name)
      .join()
    Modal.confirm({
      title: '提示',
      centered: true,
      content: `本次将给选择的${
        tableSelectionKeys.length
      }个客户群统一打上"${names}"${
        arr.length > 2 ? '等' : ''
      }标签,请确认是否继续`,
      onOk: () => {
        runMarkGroupChatTag({
          groupChatIds: tableSelectionKeys,
          tagIds: keys,
        })
      },
    })
  }

  const columns = [
    {
      dataIndex: 'name',
      width: 120,
      title: '群名称',
      render: (val) => (val ? val : UNSET_GROUP_NAME),
    },
    {
      dataIndex: 'owner',
      title: '群主名称',
      width: 120,
      render: (val) => <UserTag data={val ? {name: val} : {}} />,
    },
    {
      dataIndex: 'dep',
      width: 140,
      ellipsis: true,
      title: '群主所属部门',
      render: (_, record) => {
        return <DepNames dataSource={get(record, 'ownerInfo.departmentList')} />
      },
    },
    {
      dataIndex: 'total',
      width: 100,
      title: '群人数',
    },
    {
      dataIndex: 'todayJoinMemberNum',
      width: 120,
      title: '今日入群人数',
    },
    {
      dataIndex: 'todayQuitMemberNum',
      width: 120,
      title: '今日退群人数',
    },
    {
      dataIndex: 'tags',
      title: '群标签',
      width: 160,
      render: (val) => <TagCell dataSource={val} />,
    },
    {
      dataIndex: 'createTime',
      title: '创群时间',
      width: 160,
    },
  ]
  const searchConfig = [
    {
      type: 'input',
      label: '群名称',
      name: 'name',
    },
    {
      label: '群主',
      name: 'ownerExtIds',
      renderEle: () => {
        return <GroupOwnerSelect />
      },
    },
    {
      type: 'input',
      label: '群标签',
      name: 'tagIds',
      renderEle: () => <TagGroupSelect />,
    },
  ]
  return (
    <PageContent loading={asyncLoading} loadingText="正在同步中...">
      <SearchForm
        configList={searchConfig}
        onSearch={search.submit}
        onReset={search.reset}
        form={searchForm}
      />
      <MarkTagDrawer
        title="批量打标签"
        visible={visibleMap.markTagVisible}
        onOk={onMarkTagOk}
        onCancel={closeModal}
        confirmLoading={confirmLoading}
        data={modalInfo.data}
      />
      <TableContent
        {...tableProps}
        rowKey="id"
        name={tableSelectionKeys.length ? `已选择${tableSelectionKeys.length}条数据` : ''}
        scroll={{ x: 1200 }}
        rowSelection={{
          selectedRowKeys: tableSelectionKeys,
          onChange: onTableRowChange,
        }}
        columns={columns}
        actions={[
          {
            title: '查看详情',
            onClick: onDetailRecord,
          },
        ]}
        toolBar={[
          <Button
            key="batchTag"
            onClick={onBatchMarkTag}
            type="primary"
            ghost
            disabled={tableSelectionKeys.length === 0}>
            批量打标签
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
    </PageContent>
  )
}
