import { useMemo, useState } from 'react'
import { Form, Button, message, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { useTable } from 'src/hooks'
import SearchForm from 'components/SearchForm'
import SimplePageCard from 'components/SimplePageCard'
import TagGroupSelect from 'components/TagGroupSelect'
import TextItem from './TextItem'
import AddDrawer from './AddDrawer'
import DetailDrawer from './DetailDrawer'
import ItemsList from '../Items-List'
import { useModalHook } from 'src/hooks'
import {
  AddTrackMaterial,
  GetTrackMaterialList,
  RemoveTrackMaterial,
  EditTrackMaterial,
} from 'services/modules/trackMaterial'
import { getRequestError } from 'services/utils'
import { MATERIAL_TYPE_EN_VALS } from '../../constants'
import { SUCCESS_CODE } from 'utils/constants'

export default () => {
  const [searchForm] = Form.useForm()
  const [tableList, setTableList] = useState([])
  const {
    openModal,
    closeModal,
    visibleMap,
    modalInfo,
    setConfirm,
    confirmLoading,
  } = useModalHook(['add', 'edit', 'detail'])
  const {
    tableProps,
    search,
    refresh,
    params: searchParams,
  } = useTable(GetTrackMaterialList, {
    fixedParams: {
      type: MATERIAL_TYPE_EN_VALS.TEXT,
    },
    form: searchForm,
    pageSize: 10,
    onFinally([pager = { current: 1 }]) {
      if (pager.current === 1) {
        setTableList(tableProps.dataSource)
      } else {
        setTableList([...tableList, ...tableProps.dataSource])
      }
    },
  })
  const { run: runRemove } = useRequest(RemoveTrackMaterial, {
    manual: true,
    onSuccess: (res) => {
      if (res.code === SUCCESS_CODE) {
        message.success('删除成功')
        refresh()
      } else {
        message.error(res.msg ? res.msg : '删除失败')
      }
    },
    onError: (e) => getRequestError(e, '删除失败'),
  })
  const { run: runAddData } = useRequest(AddTrackMaterial, {
    manual: true,
    onBefore: () => {
      setConfirm()
    },
    onFinally() {
      setConfirm(false)
    },
    onSuccess: (res) => {
      if (res.code === SUCCESS_CODE) {
        message.success('新增成功')
        refresh()
        closeModal()
      } else {
        message.error(res.msg ? res.msg : '新增失败')
      }
    },
    onError: (e) => getRequestError(e, '新增失败'),
  })
  const { run: runEditData } = useRequest(EditTrackMaterial, {
    manual: true,
    onBefore: () => {
      setConfirm()
    },
    onFinally() {
      setConfirm(false)
    },
    onSuccess: (res) => {
      if (res.code === SUCCESS_CODE) {
        message.success('编辑成功')
        closeModal()
        refresh()
      } else {
        message.error(res.msg ? res.msg : '编辑失败')
      }
    },
    onError: (e) => getRequestError(e, '新增失败'),
  })

  const onAdd = () => {
    openModal('add')
  }
  const searchConfig = [
    {
      label: '标题',
      name: 'title',
    },
    {
      label: '分类标签',
      renderEle: ({ value, onChange }) => {
        return <TagGroupSelect tagType="material" />
      },
      name: 'tagList',
    },
  ]

  const onRemoveItem = (record) => {
    Modal.confirm({
      title: '提示',
      content: `确定删除文本"${record.title}"吗`,
      centered: true,
      onOk: () => {
        runRemove({
          ids: [record.id],
        })
      },
    })
  }

  const onEditItem = (record) => {
    openModal('edit', record)
  }

  const onDetailItem = (record) => {
    openModal('detail', record)
  }

  const onAddOk = (values) => {
    if (modalInfo.type === 'add') {
      runAddData({
        ...values,
        type: MATERIAL_TYPE_EN_VALS.TEXT,
      })
    } else if (modalInfo.type === 'edit') {
      runEditData({
        ...values,
        type: MATERIAL_TYPE_EN_VALS.TEXT,
        id: modalInfo.data.id,
      })
    }
  }

  const hasMore = useMemo(() => {
    const { pageSize, current, total } = tableProps.pagination
    return total > 0 && pageSize * current < total
  }, [tableProps.pagination])

  const loadMoreData = () => {
    const [pager, formVals] = searchParams
    if (hasMore) {
      GetTrackMaterialList(
        {
          current: pager.current + 1,
          pageSize: pager.pageSize,
        },
        formVals
      )
    }
  }

  const noResult = useMemo(() => {
    return tableList.length === 0 && !tableProps.loading
  }, [tableList, tableProps.loading])

  const emptyText = useMemo(() => {
    const isNoResult = tableList.length === 0 && !tableProps.loading
    if (isNoResult && searchParams) {
      const [, formVals = {}] = searchParams
      return formVals.keyword
        ? '没有查询到相关数据哦~'
        : '目前没有创建文本素材哦~'
    } else {
      return ''
    }
  }, [tableList, tableProps.loading, searchParams])

  return (
    <>
      <SearchForm
        form={searchForm}
        onSearch={search.submit}
        onReset={search.reset}
        configList={searchConfig}
      />
      <AddDrawer
        name="文本"
        confirmLoading={confirmLoading}
        modalType={modalInfo.type}
        data={modalInfo.data}
        visible={visibleMap.addVisible || visibleMap.editVisible}
        onCancel={closeModal}
        onOk={onAddOk}
      />
      <DetailDrawer
        title="文本详情"
        data={modalInfo.data}
        visible={visibleMap.detailVisible}
        onCancel={closeModal}
      />
      <SimplePageCard
        toolBar={[
          <Button key="add" onClick={onAdd} type="primary" ghost>
            <PlusOutlined />
            添加文本
          </Button>,
        ]}
        style={{ padding: 0 }}>
        <ItemsList
          {...tableProps}
          renderItem={(ele) => (
            <TextItem
              data={ele}
              onEdit={onEditItem}
              onRemove={onRemoveItem}
              onDetail={onDetailItem}
            />
          )}
        />
      </SimplePageCard>
    </>
  )
}
