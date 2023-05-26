import { Form, Button, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { useTable } from 'src/hooks'
import SearchForm from 'components/SearchForm'
import SimplePageCard from 'components/SimplePageCard'
import TagGroupSelect from 'components/TagGroupSelect'
import ImgItem from '../components/ImgItem'
import AddDrawer from './AddDrawer'
import DetailDrawer from './DetailDrawer'
import ItemsList from '../Items-List'
import { useModalHook } from 'src/hooks'
import { getFileUrl } from 'src/utils'
import {
  AddTrackMaterial,
  GetTrackMaterialList,
  RemoveTrackMaterial,
  EditTrackMaterial,
} from 'services/modules/trackMaterial'
import { actionRequestHookOptions } from 'services/utils'
import { MATERIAL_TYPE_EN_VALS } from '../../constants'

const handleList = async (dataSource) => {
  const mediaIds = dataSource.map((ele) => ele.mediaId)
  const res = await getFileUrl(mediaIds)
  return dataSource.map((ele) => ({
    ...ele,
    filePath: res[ele.mediaId],
  }))
}

export default () => {
  const [searchForm] = Form.useForm()
  const {
    openModal,
    closeModal,
    requestConfirmProps,
    visibleMap,
    modalInfo,
    confirmLoading,
  } = useModalHook(['add', 'edit', 'detail'])
  const {
    tableProps,
    refresh,
    search,
    toFirst,
  } = useTable(GetTrackMaterialList,
    {
    handleList,
    fixedParams: {
      type: MATERIAL_TYPE_EN_VALS.PICTUER,
    },
    pageSize: 10,
    form: searchForm,
  })
  const { run: runRemove } = useRequest(RemoveTrackMaterial, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        toFirst()
      },
    }),
  })
  const { run: runAddData } = useRequest(AddTrackMaterial, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: () => {
        toFirst()
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
        closeModal()
        refresh()
      },
    }),
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
      content: `确定删除图片"${record.title}"吗`,
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
        type: MATERIAL_TYPE_EN_VALS.PICTUER,
      })
    } else if (modalInfo.type === 'edit') {
      runEditData({
        ...values,
        type: MATERIAL_TYPE_EN_VALS.PICTUER,
        id: modalInfo.data.id,
      })
    }
  }

  return (
    <>
      <SearchForm
        form={searchForm}
        onSearch={search.submit}
        onReset={search.reset}
        configList={searchConfig}
      />
      <AddDrawer
        name="图片"
        confirmLoading={confirmLoading}
        modalType={modalInfo.type}
        data={modalInfo.data}
        visible={visibleMap.addVisible || visibleMap.editVisible}
        onCancel={closeModal}
        onOk={onAddOk}
      />
      <DetailDrawer
        title="图片详情"
        data={modalInfo.data}
        visible={visibleMap.detailVisible}
        onCancel={closeModal}
      />
      <SimplePageCard
        toolBar={[
          <Button key="add" onClick={onAdd} type="primary" ghost>
            <PlusOutlined />
            添加图片
          </Button>,
        ]}
        style={{ padding: 0 }}>
        <ItemsList
          {...tableProps}
          renderItem={(ele) => (
            <ImgItem
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
