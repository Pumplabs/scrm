import { useMemo, useRef } from 'react'
import { Button, Empty, Modal, TreeSelect, Form } from 'antd'
import {  useRequest } from 'ahooks'
import { PlusOutlined, SyncOutlined } from '@ant-design/icons'
import InfiniteList from 'components/InfiniteList'
import SimplePageCard from 'components/SimplePageCard'
import TagGroupCard from 'components/TagGroupCard'
import { actionRequestHookOptions } from 'services/utils'
import SearchForm from 'components/SearchForm'
import {
  GetCustomerTagGroup,
  AsyncCustomerTagGroup,
  AddCustomerTagGroup,
  RemoveCustomerTagGroup,
  EditCustomerTagGroup,
  AddCustomerTag,
} from 'services/modules/customerTag'
import AddTagModal from './components/AddTagModal'
import { useModalHook, useGetWindowInfo, useInfiniteHook } from 'src/hooks'

export default () => {
  const { screenHeight } = useGetWindowInfo()
  const listRef = useRef(null)
  const [searchForm] = Form.useForm()
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
    request: GetCustomerTagGroup,
    form: searchForm,
  })

  const { run: runAsyncData } = useRequest(AsyncCustomerTagGroup, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '同步',
      successFn: () => {
        refreshTable()
      }
    }),
  })
  const { run: runAddCustomerTagGroup } = useRequest(AddCustomerTagGroup, {
    manual: true,
    onBefore: () => {
      setConfirm()
    },
    onFinally: () => {
      setConfirm(false)
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

  const { run: runAddCustomerTag } = useRequest(AddCustomerTag, {
    manual: true,
    onBefore: () => {
      setConfirm()
    },
    onFinally: () => {
      setConfirm(false)
    },
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: (_, [{ groupIdx } = {}] = []) => {
        closeModal()
        refreshTable(groupIdx)
      }
    }),
  })

  const { run: runEditCustomerTagGroup } = useRequest(EditCustomerTagGroup, {
    manual: true,
    onBefore: () => {
      setConfirm()
    },
    onFinally: () => {
      setConfirm(false)
    },
    ...actionRequestHookOptions({
      getActionName: ([, {actionName} = {}]) => {
        return actionName ? actionName : '编辑'
      },
      successFn: (_, [{ groupIdx } = {}] = []) => {
        closeModal()
        refreshTable(groupIdx)
      }
    }),
  })
  const { run: runRmoveCustomerTagGroup } = useRequest(RemoveCustomerTagGroup, {
    manual: true,
    onBefore: () => {
      setConfirm()
    },
    onFinally: () => {
      setConfirm(false)
    },
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: (_, [{ groupIdx } = {}] = []) => {
        closeModal()
        refreshTable(groupIdx)
      }
    }),
  })
  const { dataSource } = tableProps

  const onAsyncData = () => {
    runAsyncData()
  }

  const onAdd = () => {
    openModal('add')
  }

  const onAddModalOk = (values) => {
    const { noChangeList, removeTagIds, addList, editList, name } = values
    const modalData = modalInfo.data
    let baseParams = {
      name,
    }
    if (visibleMap.addVisible) {
      const params = {
        ...baseParams,
        tagList: addList,
      }
      runAddCustomerTagGroup(params)
    }
    if (visibleMap.editVisible) {
      const params = {
        ...baseParams,
        id: modalData.id,
        deleteTagIds: removeTagIds,
        updateTags: [...addList, ...noChangeList, ...editList],
      }
      runEditCustomerTagGroup(params)
    }
  }

  const onRemoveItem = (data, groupIdx) => {
    Modal.confirm({
      title: '提示',
      content: <>
      确定要删除标签组"{data.name}"吗？<br/>删除后，已添加到客户信息的标签也一起删除
    </>,
    centered: true,
      onOk: () => {
        runRmoveCustomerTagGroup({
          id: data.id,
        }, { groupIdx })
      },
    })
  }

  const onAddTagItem = (data, groupIdx ) => {
    openModal('addTag', {
      ...data,
      groupIdx
    })
  }

  const onSaveTagItem = (text) => {
    const modalData = modalInfo.data
    const groupInfo = modalData.groupInfo
    if (modalInfo.type === 'addTag') {
      runAddCustomerTag({
        name: text,
        tagGroupId: groupInfo.id,
      }, {
        groupIdx: modalData.groupIdx
      })
    } else if (modalInfo.type === 'editTag') {
      const params = {
        extCorpId: modalData.extCorpId,
        id: groupInfo.id,
        name:groupInfo.name,
        updateTags: [
          {
            id: modalData.id,
            name: text,
            order: modalData.order,
          },
        ],
      }
      runEditCustomerTagGroup(params, {
        groupIdx: modalData.groupIdx
      })
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
      content: <>
      确定要删除标签"{data.name}"吗？<br/>删除后，已添加到客户信息的标签也一起删除
      </>,
      centered: true,
      onOk: () => {
        const params = {
          deleteTagIds: [data.id],
          extCorpId: data.extGroupId,
          id: data.groupInfo.id,
          name: data.groupInfo.name,
        }
        runEditCustomerTagGroup(params, { actionName: '删除', groupIdx })
      },
    })
  }

  const onSearch = () => {
    if (listRef.current) {
      listRef.current.toTop()
    }
    search.submit()
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
    return Math.max(screenHeight - 320, 400)
  }, [screenHeight])

  return (
    <div>
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
       style={{padding: 0}}
        name={`共${tableProps.pagination.total}条数据`}
        toolBar={[
          <Button
            key="export"
            onClick={onAdd}
            type="primary"
            ghost
            style={{ marginRight: 8 }}>
            <PlusOutlined />
            添加标签组
          </Button>,
          <Button key="async" onClick={onAsyncData} type="primary" ghost>
            <SyncOutlined />
            同步数据
          </Button>
        ]}
      >
        <InfiniteList
          ref={(r) => (listRef.current = r)}
          style={{ height: containerHeight, overflowY: 'auto' }}
          dataSource={dataSource}
          pagination={tableProps.pagination}
          searchParams={searchParams}
          loading={loading}
          loadNext={tableProps.onChange}
          empty={
            <Empty
              description={
                <div>
                  <p style={{ marginBottom: 4 }}>{emptyText}</p>
                  <Button type="primary" onClick={onAdd}>
                    创建客户标签
                  </Button>
                </div>
              }
            />
          }
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
    </div>
  )
}
