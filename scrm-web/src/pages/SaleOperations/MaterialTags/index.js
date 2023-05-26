import { useMemo, useRef } from 'react'
import { Button, Empty, Modal, Form } from 'antd'
import {  useRequest } from 'ahooks'
import { PlusOutlined } from '@ant-design/icons'
import SearchForm from 'components/SearchForm'
import InfiniteList from 'components/InfiniteList'
import { PageContent } from 'layout'
import SimplePageCard from 'components/SimplePageCard'
import TagGroupCard from 'components/TagGroupCard'
import { useGetWindowInfo } from 'src/hooks'
import { actionRequestHookOptions } from 'services/utils'
import {
  GetMaterialTagGroupList,
  AddMaterialGroup,
  AddMaterialTag,
  EditMaterialGroup,
  RemoveMaterialGroup,
} from 'services/modules/materialTag'
import AddTagModal from './components/AddTagDrawer'
import { useModalHook, useInfiniteHook } from 'src/hooks'

export default () => {
  const { screenHeight } = useGetWindowInfo()
  const [searchForm] = Form.useForm()
  const listRef = useRef(null)
  const {
    openModal,
    closeModal,
    visibleMap,
    modalInfo,
    setConfirm,
    confirmLoading,
  } = useModalHook(['add', 'edit', 'addTag', 'editTag'])
  const {
    tableProps,
    refreshByIdx: refreshTable,
    loading,
    params: searchParams,
    search,
  } = useInfiniteHook({
    pageSize: 10,
    request: GetMaterialTagGroupList,
    form: searchForm,
  })
  const onSearch = (...args) => {
    if (listRef.current) {
      listRef.current.toTop()
    }
    search.submit(...args)
  }

  const { run: runAddMaterialGroup } = useRequest(AddMaterialGroup, {
    manual: true,
    onBefore: () => {
      setConfirm()
    },
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: () => {
        closeModal()
        refreshTable()
      },
      failFn: () => {
        setConfirm(false)
      },
    }),
  })

  const { run: runAddMaterialTag } = useRequest(AddMaterialTag, {
    manual: true,
    onBefore: () => {
      setConfirm(true)
    },
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: (_, [,{ groupIdx } = {}] = []) => {
        closeModal()
        refreshTable(groupIdx)
      },
      failFn: () => {
        setConfirm(false)
      },
    }),
  })

  const { run: runEditMaterialGroup } = useRequest(EditMaterialGroup, {
    manual: true,
    ...actionRequestHookOptions({
      getActionName: ([,{actionName} = {}]) => {
        return actionName ? actionName : '编辑'
      },
      successFn: (_, [,{ groupIdx } = {}] = []) => {
        closeModal()
        refreshTable(groupIdx)
      },
    })
  })

  const { run: runRemoveMaterialGroup } = useRequest(RemoveMaterialGroup, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: (_, [,{ groupIdx } = {}] = []) => {
        closeModal()
        refreshTable(groupIdx)
      },
    }),
  })
  const { dataSource } = tableProps

  const onAdd = () => {
    openModal('add')
  }

  const onAddModalOk = (values) => {
    const { removeTagIds, addList, editList, name } = values
    const modalData = modalInfo.data
    let baseParams = {
      name,
    }
    if (visibleMap.addVisible) {
      const params = {
        ...baseParams,
        tagList: addList,
      }
      runAddMaterialGroup(params)
    }
    if (visibleMap.editVisible) {
      const params = {
        ...baseParams,
        id: modalData.id,
        deleteTagIds: removeTagIds,
        updateTags: [...addList, ...editList],
      }
      runEditMaterialGroup(params, {groupIdx: modalData.groupIdx})
    }
  }

  const onRemoveItem = (data, groupIdx) => {
    Modal.confirm({
      title: '提示',
      content: `确定要删除标签组"${data.name}"吗?`,
      centered: true,
      onOk: () => {
        runRemoveMaterialGroup({
          id: data.id,
        }, {groupIdx})
      },
    })
  }

  const onAddTagItem = (data, groupIdx) => {
    openModal('addTag', {
      ...data,
      groupIdx
    })
  }

  const onSaveTagItem = (text) => {
    const modalData = modalInfo.data
    if (modalInfo.type === 'addTag') {
      runAddMaterialTag({
        name: text,
        groupId: modalData.groupId,
      }, {groupIdx: modalData.groupIdx})
    } else if (modalInfo.type === 'editTag') {
      const params = {
        extCorpId: modalData.extCorpId,
        id: modalData.groupId,
        name: modalData.groupName,
        updateTags: [
          {
            id: modalData.id,
            name: text,
            order: modalData.order,
          },
        ],
      }
      runEditMaterialGroup(params, {groupIdx: modalData.groupIdx})
    }
  }

  const onEditItem = (data, groupIdx) => {
    openModal('edit', {
      ...data,
      groupIdx
    })
  }

  const onEditTagItem = (data, groupIdx) => {
    openModal('editTag', {
      ...data,
      groupIdx
    })
  }

  const onRemoveTagItem = (data, groupIdx) => {
    Modal.confirm({
      title: '提示',
      content: `确定要删除标签"${data.name}"`,
      centered: true,
      onOk: () => {
        const params = {
          deleteTagIds: [data.id],
          extCorpId: data.extGroupId,
          id: data.groupId,
          name: data.groupName,
        }
        runEditMaterialGroup(params, { actionName: '删除', groupIdx })
      },
    })
  }

  const searchConfig = [
    {
      type: 'input',
      label: '搜索',
      name: 'keyword',
      eleProps: {
        placeholder: '请输入标签组或标签',
      },
    },
  ]

  const emptyText = useMemo(() => {
    const isNoResult = dataSource.length === 0 && !tableProps.loading
    if (isNoResult && searchParams) {
      const [, formVals = {}] = searchParams
      return formVals.keyword ? '没有查询到相关数据哦~' : '目前没有创建标签哦~'
    } else {
      return ''
    }
  }, [dataSource, tableProps.loading, searchParams])

  const containerHeight = useMemo(() => {
    return Math.max(screenHeight - 232, 400)
  }, [screenHeight])

  return (
    <PageContent>
      <AddTagModal
        data={modalInfo.data}
        visible={visibleMap.addVisible || visibleMap.editVisible}
        onCancel={closeModal}
        onOk={onAddModalOk}
        modalType={modalInfo.type}
        confirmLoading={confirmLoading}
        name="标签组"
      />
      <SearchForm
        form={searchForm}
        configList={searchConfig}
        onSearch={onSearch}
        onReset={search.reset}
      />
      <SimplePageCard
      name={`共${tableProps.pagination.total}条数据`}
      style={{padding: 0}}
      toolBar={
        [
          <Button
            key="export"
            onClick={onAdd}
            type="primary"
            ghost
          >
            <PlusOutlined />
            添加标签组
          </Button>
        ]
      }
      >
        <InfiniteList
          ref={r => listRef.current = r}
          style={{ height: containerHeight, overflowY: 'auto' }}
          dataSource={dataSource}
          pagination={tableProps.pagination}
          searchParams={searchParams}
          loading={loading}
          loadNext={tableProps.onChange}
          empty={<Empty
            description={
              <div>
                <p style={{ marginBottom: 4 }}>{emptyText}</p>
                <Button type="primary" onClick={onAdd}>
                  创建素材标签
                </Button>
              </div>
            }
          />}
          renderItem={(ele, idx) => (
            <TagGroupCard
              key={ele.id}
              data={ele}
              idx={idx}
              modalInfo={modalInfo}
              visibleMap={visibleMap}
              onAddItem={onAddTagItem}
              onSaveItem={onSaveTagItem}
              onEditTagItem={onEditTagItem}
              onRemove={onRemoveItem}
              onRemoveTagItem={onRemoveTagItem}
              onEdit={onEditItem}
              onCancelTag={closeModal}
              confirmLoading={confirmLoading}
            />
          )}></InfiniteList>
      </SimplePageCard>
    </PageContent>
  )
}
