import { Button, Form, Modal } from 'antd'
import { useAntdTable, useRequest } from 'ahooks'
import { useNavigate } from 'react-router'
import { PlusOutlined } from '@ant-design/icons'
import SearchForm from 'components/SearchForm'
import TableContent from 'components/TableContent'
import TagGroupSelect from 'components/TagGroupSelect'
import UserTag from 'components/UserTag'
import LinkItem from '../LinkItem'
import ArticleDetailDrawer from './ArticleDetailDrawer'
import DataDrawer from '../DataDrawer'
import { getFileUrl } from 'src/utils'
import { useModalHook } from 'src/hooks'
import { actionRequestHookOptions } from 'services/utils'
import {
  GetTrackMaterialList,
  RemoveTrackMaterial,
} from 'services/modules/trackMaterial'
import { MATERIAL_TYPE_EN_VALS } from '../../constants'

export default () => {
  const [searchForm] = Form.useForm()
  const navigate = useNavigate()
  const { openModal, closeModal, modalInfo, visibleMap } = useModalHook([
    'detail',
    'data'
  ])
  const { tableProps, search, refresh, mutate } = useAntdTable(
    (pager, vals = {}, ...args) =>
      GetTrackMaterialList(
        pager,
        { ...vals, type: MATERIAL_TYPE_EN_VALS.ARTICLE },
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
      successFn: refresh,
    }),
  })

  const onDetailRecord = (record) => {
    openModal('detail', record)
  }

  const onCancelSendRecord = (record) => {
    Modal.confirm({
      title: '提示',
      content: `确定删除文章"${record.title}"吗`,
      centered: true,
      onOk: () => {
        runRemove({
          ids: [record.id],
        })
      },
    })
  }

  const onAdd = () => {
    navigate(`/saleOperation/trackMaterial/article/add`)
  }

  const onEditRecord = (record) => {
    navigate(
      `/saleOperation/trackMaterial/article/edit/${record.id}`
    )
  }

  const onDataRecord = (record) => {
    openModal('data', record)
  }

  const onDetailItem = (record) => {
    openModal('detail', record)
  }

  const columns = [
    {
      title: '文章',
      dataIndex: 'msg',
      width: 220,
      render: (val, record) => {
        return (
          <LinkItem
            title={record.title}
            info={record.summary}
            coverUrl={record.filePath}
            onClick={() => onDetailItem(record)}
          />
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
      render: val => val ? val : 0
    },
    {
      title: '浏览次数',
      dataIndex: 'lookNum',
      width: 120,
      render: val => val ? val : 0
    }
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
      <ArticleDetailDrawer
        visible={visibleMap.detailVisible}
        data={modalInfo.data}
        onCancel={closeModal}
      />
      <DataDrawer
       visible={visibleMap.dataVisible}
       data={modalInfo.data}
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
            onClick: onDataRecord
          },
          {
            title: '详情',
            onClick: onDetailRecord,
          },
        ]}
        toolBar={[
          <Button key="add" onClick={onAdd} type="primary" ghost>
            <PlusOutlined />
            新建文章
          </Button>,
        ]}
      />
    </>
  )
}
