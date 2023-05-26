import { useMemo, useRef } from 'react'
import { Form, Button, Empty, Modal, Pagination } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import InfiniteList from 'components/InfiniteList'
import { useInfiniteHook, useTable } from 'src/hooks'
import SearchForm from 'components/SearchForm'
import SimplePageCard from 'components/SimplePageCard'
import TagGroupSelect from 'components/TagGroupSelect'
import AddDrawer from './AddDrawer'
import DetailDrawer from './DetailDrawer'
import ImgItem from '../components/ImgItem'
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
    visibleMap,
    modalInfo,
    confirmLoading,
    requestConfirmProps,
  } = useModalHook(['add', 'edit', 'detail'])
  const {
    tableProps,
    refresh,
    search,
    toFirst,
  } = useTable(GetTrackMaterialList, {
    handleList,
    fixedParams: {
      type: MATERIAL_TYPE_EN_VALS.POSTER,
    },
    pageSize: 10,
    form: searchForm,
  })
  const { run: runRemove } = useRequest(RemoveTrackMaterial, {
    manual: true,
    ...actionRequestHookOptions({
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
      label: '海报名称',
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
      content: `确定删除海报"${record.title}"吗`,
      centered: true,
      onOk: () => {
        runRemove({
          ids: [record.id],
        })
      },
    })
  }
  const onEditItem = (record, idx) => {
    openModal('edit', {
      ...record,
      idx,
    })
  }

  const onDetailItem = (record) => {
    openModal('detail', record)
  }

  const onAddOk = (values) => {
    if (modalInfo.type === 'add') {
      runAddData({
        ...values,
        type: MATERIAL_TYPE_EN_VALS.POSTER,
      })
    } else if (modalInfo.type === 'edit') {
      runEditData(
        {
          ...values,
          type: MATERIAL_TYPE_EN_VALS.POSTER,
          id: modalInfo.data.id,
        }
      )
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
        name="海报"
        confirmLoading={confirmLoading}
        modalType={modalInfo.type}
        data={modalInfo.data}
        visible={visibleMap.addVisible || visibleMap.editVisible}
        onCancel={closeModal}
        onOk={onAddOk}
      />
      <DetailDrawer
        title="海报详情"
        data={modalInfo.data}
        visible={visibleMap.detailVisible}
        onCancel={closeModal}
      />
      <SimplePageCard
        toolBar={[
          <Button key="add" onClick={onAdd} type="primary" ghost>
            <PlusOutlined />
            添加海报
          </Button>,
        ]}
        style={{ padding: 0 }}>
        <div>
          <ItemsList
            {...tableProps}
            renderItem={(ele, idx) => (
              <ImgItem
                isPoster={true}
                data={ele}
                onEdit={() => onEditItem(ele, idx)}
                onRemove={onRemoveItem}
                onDetail={onDetailItem}
              />
            )}
          />
        </div>
      </SimplePageCard>
    </>
  )
}
