import { Button, Form, Modal } from 'antd'
import { useAntdTable, useRequest } from 'ahooks'
import { PlusOutlined } from '@ant-design/icons'
import UserTag from 'components/UserTag'
import SearchForm from 'components/SearchForm'
import TableContent from 'components/TableContent'
import AddDrawer from './AddDrawer'
import DetailDrawer from './DetailDrawer'
import TagGroupSelect from 'components/TagGroupSelect'
import ExpandCell from 'components/ExpandCell'
import LinkItem from '../LinkItem'
import DataDrawer from '../DataDrawer'
import { getFileUrl } from 'src/utils'
import {
  AddTrackMaterial,
  GetTrackMaterialList,
  RemoveTrackMaterial,
  EditTrackMaterial,
} from 'services/modules/trackMaterial'
import { actionRequestHookOptions, getRequestError } from 'services/utils'
import { MATERIAL_TYPE_EN_VALS } from '../../constants'
import { SUCCESS_CODE } from 'utils/constants'
import { useModalHook } from 'src/hooks'

export default () => {
  const [searchForm] = Form.useForm()
  const {
    openModal,
    closeModal,
    visibleMap,
    modalInfo,
    setConfirm,
    confirmLoading,
    requestConfirmProps
  } = useModalHook(['add', 'edit', 'detail', 'data'])
  const { tableProps, search, refresh, mutate } = useAntdTable(
    (pager, vals = {}, ...args) =>
      GetTrackMaterialList(
        pager,
        { ...vals, type: MATERIAL_TYPE_EN_VALS.LINK },
        ...args
      ),
    {
      form: searchForm,
      pageSize: 10,
      onFinally: () => {
        const refreshData = async () => {
          const dataSource = tableProps.dataSource
          const mediaIds = dataSource.map((ele) => ele.mediaId)
          const res = await getFileUrl(mediaIds)
          const newList = dataSource.map((ele) => ({
            ...ele,
            filePath: res[ele.mediaId],
          }))
          mutate({
            list: newList,
            total: tableProps.pagination.total,
          })
        }
        refreshData()
      },
    }
  )
  const { run: runRemove } = useRequest(RemoveTrackMaterial, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        refresh()
      }
    })
  })
  const { run: runAddData } = useRequest(AddTrackMaterial, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: () => {
        refresh()
        closeModal()
      }
    })
  })
  const { run: runEditData } = useRequest(EditTrackMaterial, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '编辑',
      successFn: () => {
        closeModal()
        refresh()
      }
    })
  })

  const onDetailRecord = (record) => {
    openModal('detail', record)
  }

  const onCancelSendRecord = (record) => {
    Modal.confirm({
      title: '提示',
      content: `确定删除链接"${record.title}"吗`,
      centered: true,
      onOk: () => {
        runRemove({
          ids: [record.id],
        })
      },
    })
  }

  const onAdd = () => {
    openModal('add')
  }

  const onEditRecord = (record) => {
    openModal('edit', record)
  }

  const onExpandCell = (record) => {
    openModal('detail', record)
  }

  const onAddOk = (values) => {
    if (modalInfo.type === 'add') {
      runAddData({
        ...values,
        type: MATERIAL_TYPE_EN_VALS.LINK,
      })
    } else if (modalInfo.type === 'edit') {
      runEditData({
        ...values,
        type: MATERIAL_TYPE_EN_VALS.LINK,
        id: modalInfo.data.id,
      })
    }
  }

  const onDataRecord = (record) => {
    openModal('data', record)
  }
  const columns = [
    {
      title: '链接',
      dataIndex: 'msg',
      width: 220,
      render: (val, record) => {
        return (
          <ExpandCell onExpand={onExpandCell} maxHeight={70}>
            <LinkItem
              title={record.title}
              info={record.description}
              coverUrl={record.filePath}
            />
          </ExpandCell>
        )
      },
    },
    {
      title: '创建人',
      width: 120,
      dataIndex: 'creatorInfo',
      render: (val) => <UserTag data={val} />,
    },
    {
      title: '更新时间',
      width: 160,
      dataIndex: 'updatedAt',
    },
    {
      title: '发送次数',
      dataIndex: 'sendNum',
      width: 120,
      render: (val) => (val ? val : 0),
    },
    {
      title: '浏览次数',
      dataIndex: 'lookNum',
      width: 120,
      render: (val) => (val ? val : 0),
    },
  ]
  const searchConfig = [
    {
      label: '标题',
      name: 'title',
    },
    {
      label: '标签',
      renderEle: ({ value, onChange }) => {
        return (
          <TagGroupSelect
            placeholder="请选择"
            valueKey="id"
            tagType="material"
          />
        )
      },
      name: 'tagList',
    },
  ]

  return (
    <>
      <SearchForm
        form={searchForm}
        onSearch={search.submit}
        onReset={search.reset}
        configList={searchConfig}
      />
      <AddDrawer
        name="链接"
        confirmLoading={confirmLoading}
        modalType={modalInfo.type}
        data={modalInfo.data}
        visible={visibleMap.addVisible || visibleMap.editVisible}
        onCancel={closeModal}
        onOk={onAddOk}
      />
      <DataDrawer
        data={modalInfo.data}
        visible={visibleMap.dataVisible}
        onCancel={closeModal}
      />
      <DetailDrawer
        title="查看链接"
        confirmLoading={confirmLoading}
        data={modalInfo.data}
        visible={visibleMap.detailVisible}
        onCancel={closeModal}
      />
      <TableContent
        {...tableProps}
        rowKey="id"
        scroll={{ x: 1200 }}
        columns={columns}
        operationCol={{ width: 130 }}
        actions={[
          {
            title: '编辑',
            onClick: onEditRecord,
          },
          {
            title: '删除',
            onClick: onCancelSendRecord,
          },
          {
            title: '数据',
            onClick: onDataRecord,
          },
          {
            title: '详情',
            onClick: onDetailRecord,
          },
        ]}
        toolBar={[
          <Button key="add" onClick={onAdd} type="primary" ghost>
            <PlusOutlined />
            新建链接
          </Button>,
        ]}
      />
    </>
  )
}
