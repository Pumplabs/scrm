import { Form, Button, Modal, message } from 'antd'
import { useAntdTable, useRequest } from 'ahooks'
import { PlusOutlined } from '@ant-design/icons'
import SearchForm from 'components/SearchForm'
import TableContent from 'components/TableContent'
import TagCell from 'components/TagCell'
import UserTag from 'components/UserTag'
import { MsgCell } from 'components/WeChatMsgEditor'
import AddDrawer from './AddDrawer'
import DetailDrawer from './DetailDrawer'
import { actionRequestHookOptions, getRequestError } from 'services/utils'
import {
  GetWelComeList,
  AddOrEditWelCome,
  RemoveWelCome,
} from 'services/modules/groupWelcomeSetting'
import { useModalHook } from 'src/hooks'
import { SUCCESS_CODE, UNSET_GROUP_NAME } from 'utils/constants'
import {
  getTextParamsWithNicknameParams,
  getMediaParams,
} from 'components/WeChatMsgEditor/utils'

export default () => {
  const [searchForm] = Form.useForm()
  const { tableProps, search, refresh } = useAntdTable(GetWelComeList, {
    pageSize: 10,
    form: searchForm,
  })
  const { run: runRemoveData } = useRequest(RemoveWelCome, {
    manual: true,
    onBefore: () => {
      setConfirm(true)
    },
    ...actionRequestHookOptions({
      actionName: '删除',
      failFn: () => {
        setConfirm(false)
      },
      successFn: () => {
        setConfirm(false)
        closeModal()
        refresh()
      },
    }),
  })

  const { run: runAddOrEditWelCome } = useRequest(AddOrEditWelCome, {
    manual: true,
    onBefore: () => {
      setConfirm(true)
    },
    onSuccess: (res, [, actionName]) => {
      if (res.code === SUCCESS_CODE) {
        message.success(`${actionName}成功`)
        closeModal()
        refresh()
      } else {
        const errorMsg = res.msg ? res.msg : `${actionName}失败`
        message.error(errorMsg)
      }
    },
    onError: (e, [, actionName]) => {
      getRequestError(e, actionName ? `${actionName}失败` : '')
    },
    onFinally: () => {
      setConfirm(false)
    }
  })
  const {
    openModal,
    closeModal,
    modalInfo,
    visibleMap,
    setConfirm,
    confirmLoading,
  } = useModalHook(['add', 'edit', 'detail'])

  const onEditRecord = (record) => {
    openModal('edit', record)
  }

  const onRemoveRecord = (record) => {
    const content = `确定要删除该欢迎语吗`
    Modal.confirm({
      type: 'warning',
      title: '提示',
      content,
      centered: true,
      onOk: () => {
        runRemoveData({
          id: record.id,
        })
      },
    })
  }
  const onDetailRecord = (record) => {
    openModal('detail', record)
  }

  const onAdd = () => {
    openModal('add')
  }
  const onAddOrEditOk = ({ msg, groups, noticeOwner }) => {
    const groupChatExtIds = groups.map((ele) => ele.extChatId)
    const msgContent = {
      text: getTextParamsWithNicknameParams(msg.text),
      media: getMediaParams(msg.media),
    }
    const params = {
      groupChatExtIds,
      isNoticeOwner: noticeOwner,
      msg: msgContent,
      templateId: modalInfo.data.templateId,
      id: modalInfo.data.id,
    }
    const actionName = modalInfo.type === 'add' ? '新增' : '编辑'
    runAddOrEditWelCome(params, actionName)
  }
  const columns = [
    {
      title: '内容',
      dataIndex: 'msg',
      render: (val, record) => (
        <MsgCell
          data={val}
          onExpand={() => onDetailRecord(record)}
          ninameLabel="客户昵称"
        />
      ),
    },
    {
      title: '使用群聊',
      dataIndex: 'groupChatList',
      render: (val) => <TagCell dataSource={val} renderName={ele => ele.name ? ele.name : UNSET_GROUP_NAME} />,
    },
    {
      title: '创建人',
      width: 160,
      dataIndex: 'creatorStaff',
      render: (val) => <UserTag data={val} />,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 160,
    },
  ]
  const searchConfig = [
    {
      label: '关键字',
      name: 'content',
      type: 'input',
    },
  ]
  return (
    <>
      <SearchForm
        form={searchForm}
        configList={searchConfig}
        onSearch={search.submit}
        onReset={search.reset}
      />
      <AddDrawer
        visible={visibleMap.addVisible || visibleMap.editVisible}
        data={modalInfo.data}
        name="欢迎语"
        modalType={modalInfo.type}
        onCancel={closeModal}
        onOk={onAddOrEditOk}
        confirmLoading={confirmLoading}
      />
      <DetailDrawer
        visible={visibleMap.detailVisible}
        data={modalInfo.data}
        title="欢迎语详情"
        onCancel={closeModal}
      />
      <TableContent
        {...tableProps}
        columns={columns}
        operationCol={{ width: 160 }}
        actions={[
          {
            title: '编辑',
            onClick: onEditRecord,
          },
          {
            title: '删除',
            onClick: onRemoveRecord,
          },
          {
            title: '详情',
            onClick: onDetailRecord,
          },
        ]}
        toolBar={[
          <Button
            key="add"
            type="primary"
            onClick={onAdd}
            ghost
            icon={<PlusOutlined />}>
            添加欢迎语
          </Button>,
        ]}
      />
    </>
  )
}
