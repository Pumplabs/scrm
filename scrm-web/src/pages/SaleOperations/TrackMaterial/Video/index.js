import { Button, Form, Modal } from 'antd'
import { useAntdTable, useRequest } from 'ahooks'
import { PlusOutlined, PlayCircleOutlined } from '@ant-design/icons'
import UserTag from 'components/UserTag'
import SearchForm from 'components/SearchForm'
import TableContent from 'components/TableContent'
import AddDrawer from './AddDrawer'
import TagGroupSelect from 'components/TagGroupSelect'
import DetailDrawer from './DetailDrawer'
import DataDrawer from '../DataDrawer'
import ExpandCell from 'components/ExpandCell'
import { getFileUrl } from 'src/utils'
import { actionRequestHookOptions } from 'services/utils'
import LinkItem from '../LinkItem'
import {
  AddTrackMaterial,
  GetTrackMaterialList,
  RemoveTrackMaterial,
  EditTrackMaterial,
} from 'services/modules/trackMaterial'
import { MATERIAL_TYPE_EN_VALS } from '../../constants'
import { useModalHook } from 'src/hooks'

export default () => {
  const [searchForm] = Form.useForm()
  const {
    openModal,
    closeModal,
    visibleMap,
    modalInfo,
    confirmLoading,
    requestConfirmProps
  } = useModalHook(['add', 'edit', 'detail', 'data'])
  const { tableProps, search, refresh, mutate } = useAntdTable(
    (pager, vals = {}, ...args) =>
      GetTrackMaterialList(
        pager,
        { ...vals, type: MATERIAL_TYPE_EN_VALS.VIDEO },
        ...args
      ),
    {
      form: searchForm,
      pageSize: 10,
      defaultParams: {
        current: 1,
        pageSize: 10,
      },
      onSuccess: async () => {
        const dataSource = tableProps.dataSource
        const mediaIds = dataSource.map((ele) => ele.mediaId)
        let newList = []
        if (mediaIds.length) {
          const res = await getFileUrl(mediaIds)
          newList = dataSource.map((ele) => ({
            ...ele,
            filePath: res[ele.mediaId],
          }))
        } else {
          newList = [...dataSource]
        }
        mutate({
          list: newList,
          total: tableProps.pagination.total,
        })
      },
    }
  )
  const { run: runRemove } = useRequest(RemoveTrackMaterial, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: refresh,
    }),
  })
  const { run: runAddData } = useRequest(AddTrackMaterial, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: () => {
        refresh()
        closeModal()
      },
    }),
  })
  const { run: runEditData } = useRequest(EditTrackMaterial, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '编辑',
      successFn: () => {
        refresh()
        closeModal()
      },
    }),
  })

  const onDetailRecord = (record) => {
    openModal('detail', record)
  }

  const onCancelSendRecord = (record) => {
    Modal.confirm({
      title: '提示',
      content: `确定删除视频"${record.title}"吗`,
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

  const onDataRecord = (record) => {
    openModal('data', record)
  }

  const onExpandCell = (record) => {
    openModal('detail', record)
  }

  const onAddOk = (values) => {
    if (modalInfo.type === 'add') {
      runAddData({
        ...values,
        type: MATERIAL_TYPE_EN_VALS.VIDEO,
      })
    } else if (modalInfo.type === 'edit') {
      runEditData({
        ...values,
        type: MATERIAL_TYPE_EN_VALS.VIDEO,
        id: modalInfo.data.id,
      })
    }
  }

  const columns = [
    {
      title: '视频',
      dataIndex: 'msg',
      width: 220,
      render: (val, record) => {
        return (
          <ExpandCell onExpand={onExpandCell} maxHeight={70}>
            <LinkItem
              title={record.title}
              info={record.description}
              cover={<PlayCircleOutlined style={{ fontSize: 40 }} />}
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
      <DataDrawer
        data={modalInfo.data}
        visible={visibleMap.dataVisible}
        onCancel={closeModal}
      />
      <AddDrawer
        name="视频"
        confirmLoading={confirmLoading}
        modalType={modalInfo.type}
        data={modalInfo.data}
        visible={visibleMap.addVisible || visibleMap.editVisible}
        onCancel={closeModal}
        onOk={onAddOk}
      />
      <DetailDrawer
        title="查看视频"
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
        operationCol={{ width: 90 }}
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
            新建视频
          </Button>,
        ]}
      />
    </>
  )
}
