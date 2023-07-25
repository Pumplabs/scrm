import { useMemo, useRef } from 'react'
import { Form, Button, message, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { get } from 'lodash'
import { useGetWindowInfo, useTable } from 'src/hooks'
import SearchForm from 'components/SearchForm'
import SimplePageCard from 'components/SimplePageCard'
import TagGroupSelect from 'components/TagGroupSelect'
import MiniAppItem from './MiniAppItem'
import AddDrawer from './AddDrawer'
import DetailDrawer from './DetailDrawer'
import { useModalHook } from 'src/hooks'
import { getFileUrl } from 'src/utils'
import ItemsList from '../Items-List'
import {
  AddTrackMaterial,
  GetTrackMaterialList,
  RemoveTrackMaterial,
  EditTrackMaterial,
} from 'services/modules/trackMaterial'
import { getRequestError } from 'services/utils'
import { MATERIAL_TYPE_EN_VALS } from '../../constants'
import { SUCCESS_CODE } from 'utils/constants'

const handleList = async (dataSource) => {
  const mediaIds = dataSource.map((ele) => ele.mediaId)
  const res = await getFileUrl(mediaIds)
  return dataSource.map((ele) => ({
    ...ele,
    filePath: res[ele.mediaId],
  }))
}
export default () => {
  const { screenHeight } = useGetWindowInfo()
  const [searchForm] = Form.useForm()
  const preTableData = useRef([])
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
    mutate,
    refresh,
    params: searchParams,
  } = useTable(GetTrackMaterialList, {
    handleList,
    fixedParams: {
      type: MATERIAL_TYPE_EN_VALS.MINI_APP,
    },
    form: searchForm,
    pageSize: 10,
    onBefore() {
      preTableData.current = tableProps.dataSource
    },
    onFinally([pager = { current: 1 }]) {
      const refreshData = async () => {
        const dataSource = tableProps.dataSource
        const mediaIds = dataSource.map((ele) => ele.mediaId)
        const res = await getFileUrl(mediaIds)
        const newList = dataSource.map((ele) => ({
          ...ele,
          filePath: res[ele.mediaId],
        }))
        mutate({
          list:
            pager.current === 1
              ? newList
              : [...preTableData.current, tableProps.dataSource],
          total: tableProps.pagination.total,
        })
      }
      refreshData()
    },
  })
  const { dataSource: tableList } = tableProps
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

  const onAddOk = (values) => {
    if (modalInfo.type === 'add') {
      runAddData({
        ...values,
        type: MATERIAL_TYPE_EN_VALS.MINI_APP,
      })
    } else if (modalInfo.type === 'edit') {
      runEditData({
        ...values,
        type: MATERIAL_TYPE_EN_VALS.MINI_APP,
        id: modalInfo.data.id,
      })
    }
  }

  const onAdd = () => {
    openModal('add')
  }

  const onEditItem = (record) => {
    openModal('edit', record)
  }

  const onRemoveItem = (record) => {
    Modal.confirm({
      title: '提示',
      content: `确定删除小程序"${get(record, 'appInfo.name')}"吗`,
      centered: true,
      onOk: () => {
        runRemove({
          ids: [record.id],
        })
      },
    })
  }

  const onDetailItem = (record) => {
    openModal('detail', record)
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
        : '目前没有小程序数据哦~'
    } else {
      return ''
    }
  }, [tableList, tableProps.loading, searchParams])

  const containerHeight = useMemo(() => {
    return Math.max(screenHeight - 300, 400)
  }, [screenHeight])
  return (
    <>
      <SearchForm
        form={searchForm}
        onSearch={search.submit}
        onReset={search.reset}
        configList={searchConfig}
      />
      <AddDrawer
        name="小程序"
        confirmLoading={confirmLoading}
        modalType={modalInfo.type}
        data={modalInfo.data}
        visible={visibleMap.addVisible || visibleMap.editVisible}
        onCancel={closeModal}
        onOk={onAddOk}
      />
      <DetailDrawer
        title="小程序详情"
        data={modalInfo.data}
        visible={visibleMap.detailVisible}
        onCancel={closeModal}
      />
      <SimplePageCard
        toolBar={[
          <Button key="add" onClick={onAdd} type="primary" ghost>
            <PlusOutlined />
            添加小程序
          </Button>,
        ]}>
        <ItemsList
          {...tableProps}
          renderItem={(ele) => (
            <MiniAppItem
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
