import { useEffect, useMemo, useState } from 'react'
import { Form, Button, Tooltip, Row, Col, Modal } from 'antd'
import { useRequest } from 'ahooks'
import cls from 'classnames'
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import SearchForm from 'components/SearchForm'
import TableContent from 'components/TableContent'
import ImmediateInput from 'components/ImmediateInput'
import { MsgCell } from 'components/WeChatMsgEditor'
import UserTag from 'components/UserTag'
import TagCell from 'components/TagCell'
import GroupSide from 'components/GroupSide'
import AddTalkScriptDrawer from './components/AddTalkScriptDrawer'
import DetailTalkScriptDrawer from './components/DetailTalkScriptDrawer'
import { convertMsgParams } from 'components/WeChatMsgEditor/utils'
import {
  GetTaskScriptGroupList,
  AddTalkScriptGroup,
  EditTalkScriptGroup,
  RemoveTalkScriptGroup,
  GetTalkScript,
  AddTalkScript,
  EditTalkScript,
  RemoveTalkScript,
} from 'services/modules/talkScript'
import { getOptionItem } from 'src/utils'
import { useModalHook, useTable } from 'src/hooks'
import { actionRequestHookOptions } from 'services/utils'
import styles from './index.module.less'

const GROUP_NAME_LEN = 20
const formatMsg = (msg) => {
  if (msg && Array.isArray(msg.text) && msg.text.length) {
    const [{ content = '' }] = msg.text
    return content.length > 10 ? `${content.slice(0, 10)}...` : content
  } else {
    return ''
  }
}
export default ({ isPerson = false }) => {
  const [searchForm] = Form.useForm()
  const {
    openModal,
    closeModal,
    modalInfo,
    visibleMap,
    setConfirm,
    confirmLoading,
  } = useModalHook([
    'addGroup',
    'editGroup',
    'addScript',
    'editScript',
    'detailScript',
  ])
  const [selectedGroup, setSelectedGroup] = useState({})
  const {
    tableProps,
    search,
    selectedKeys,
    selectedStatStr,
    refresh: refreshGetTalkScript,
    run: runGetTalkScript,
    params: searchParams = [],
  } = useTable(
    (pager, vals = {}, ...args) =>
      GetTalkScript(
        pager,
        {
          code: '',
          ...vals,
          groupId: selectedGroup.id,
        },
        ...args
      ),
    {
      manual: true,
      selected: true,
      form: searchForm
    }
  )

  const toFirst = () => {
    const [pager = {}, ...args] = searchParams
    runGetTalkScript(
      {
        ...pager,
        current: 1,
      },
      ...args
    )
  }
  const {
    data: talkScriptGroupList = [],
    loading: talkScriptGroupListLoading,
    refresh: refreshTalkScriptGroupList,
  } = useRequest(
    () =>
      GetTaskScriptGroupList({
        hasPerson: isPerson,
      }),
    {
      onFinally: () => {
        const [firstItem = {}] = talkScriptGroupList
        const isExist = talkScriptGroupList.some(
          (item) => item.id === selectedGroup.id
        )
        if (!isExist) {
          setSelectedGroup(firstItem)
        }
      },
    }
  )
  const { run: runAddTalkScriptGroup } = useRequest(AddTalkScriptGroup, {
    manual: true,
    onBefore: () => {
      setConfirm(true)
    },
    onFinally: () => {
      setConfirm(false)
    },
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: () => {
        closeModal()
        refreshTalkScriptGroupList()
      },
    }),
  })
  const { run: runEditTalkScriptGroup } = useRequest(EditTalkScriptGroup, {
    manual: true,
    onBefore: () => {
      setConfirm(true)
    },
    onFinally: () => {
      setConfirm(false)
    },
    ...actionRequestHookOptions({
      actionName: '编辑',
      successFn: () => {
        closeModal()
        refreshTalkScriptGroupList()
      },
    }),
  })
  const { run: runRemoveTalkScriptGroup } = useRequest(RemoveTalkScriptGroup, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        closeModal()
        refreshTalkScriptGroupList()
      },
    }),
  })
  const { run: runAddTalkScript } = useRequest(AddTalkScript, {
    manual: true,
    onBefore: () => {
      setConfirm(true)
    },
    onFinally: () => {
      setConfirm(false)
    },
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: () => {
        refreshTalkScriptGroupList()
        closeModal()
        toFirst()
      },
    }),
  })
  const { run: runEditTalkScript } = useRequest(EditTalkScript, {
    manual: true,
    onBefore: () => {
      setConfirm(true)
    },
    onFinally: () => {
      setConfirm(false)
    },
    ...actionRequestHookOptions({
      actionName: '编辑',
      successFn: () => {
        closeModal()
        refreshTalkScriptGroupList()
        refreshGetTalkScript()
      },
    }),
  })
  const { run: runRemoveTalkScript } = useRequest(RemoveTalkScript, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: () => {
        refreshTalkScriptGroupList()
        toFirst()
      },
    }),
  })

  useEffect(() => {
    if (selectedGroup.id) {
      toFirst()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGroup.id])

  const onEditRecord = (record) => {
    openModal('editScript', record)
  }

  const onRemoveRecord = (record) => {
    Modal.confirm({
      title: '提示',
      content: `确定要删除话术"${formatMsg(record.msg)}"吗`,
      centered: true,
      onOk: () => {
        runRemoveTalkScript({
          ids: [record.id],
        })
      },
    })
  }
  const onDetailRecord = (record) => {
    const groupName = getOptionItem(talkScriptGroupList, record.groupId, {
      label: 'name',
      value: 'id'
    })
    openModal('detailScript', {
      ...record,
      groupName
    })
  }

  const onAdd = () => {
    openModal('addScript')
  }

  const onRemove = () => {
    Modal.confirm({
      title: "提示",
      content: `确定要删除${selectedStatStr}吗`,
      centered: true,
      onOk: () => {
        runRemoveTalkScript({
          ids: selectedKeys
        })
      }
    })
  }

  const onAddGroup = () => {
    openModal('addGroup')
  }

  const onSelectedGroup = (item) => {
    setSelectedGroup(item)
  }

  const onAction = (key, item) => {
    switch (key) {
      case 'edit':
        openModal('editGroup', item)
        break
      case 'remove':
        Modal.confirm({
          title: '提示',
          content: `确定要删除话术组"${item.name}"吗`,
          centered: true,
          onOk: () => {
            runRemoveTalkScriptGroup({
              id: item.id,
            })
          },
        })
        break
      default:
        break
    }
  }

  const onSaveItem = (text) => {
    if (modalInfo.type === 'addGroup') {
      runAddTalkScriptGroup({
        departmentList: [],
        name: text,
        hasPerson: isPerson,
      })
    } else {
      runEditTalkScriptGroup({
        departmentList: [],
        id: modalInfo.data.id,
        hasPerson: isPerson,
        name: text,
      })
    }
  }

  const onCancelInput = () => {
    closeModal()
  }

  const onValidInputMsg = (text) => {
    const isExist = talkScriptGroupList.some(
      (ele) => ele.name === text && ele.id !== modalInfo.data.id
    )
    if (isExist) {
      return '此话术组名称已存在'
    }
  }

  const onAddTalkScriptOk = (vals) => {
    const { msg, tags = [], groupId, name } = vals
    const params = {
      groupId,
      name,
      hasPerson: isPerson,
      msg: convertMsgParams({ msg }),
      tagIdList: tags.map((ele) => ele.id),
    }
    if (modalInfo.type === 'addScript') {
      runAddTalkScript(params)
    } else {
      runEditTalkScript({
        ...params,
        id: modalInfo.data.id,
      })
    }
  }
  const drawerTitle = useMemo(() => {
    return modalInfo.type === 'addScript' ? '新增话术' : '编辑话术'
  }, [modalInfo.type])

  const creatorColumn = isPerson ? [] : [
    {
      title: '创建人',
      dataIndex: 'creator',
      render: (val) => <UserTag data={val} />
    },
  ]
  const columns = [
    {
      title: '话术名称',
      width: 140,
      ellipsis: true,
      dataIndex: 'name',
    },
    {
      title: '话术内容',
      dataIndex: 'msg',
      width: 160,
      render: (val) => <MsgCell data={val} />,
    },
    {
      title: '发送次数',
      width: 100,
      dataIndex: 'sendNum',
      render: (val) => (val ? val : 0),
    },
    ...creatorColumn,
    {
      title: '标签',
      dataIndex: 'tagList',
      width: 120,
      render: (val) => <TagCell dataSource={val} />,
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      width: 160,
    },
  ]
  const searchConfig = [
    {
      label: '话术关键字',
      name: 'code',
      type: 'input',
    },
  ]

  const inputProps = {
    onSave: onSaveItem,
    onCancel: onCancelInput,
    validMsg: onValidInputMsg,
    maxLength: GROUP_NAME_LEN,
    confirmLoading
  }
  const groupJsonStr = useMemo(() => {
    return JSON.stringify(talkScriptGroupList)
  }, [talkScriptGroupList])
  const groupMaxCount = useMemo(() => {
    return talkScriptGroupList.reduce((res, item) => Math.max(res, item.count), 0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupJsonStr])
  return (
    <div className={styles['company-tab']}>
      <AddTalkScriptDrawer
        title={drawerTitle}
        modalType={modalInfo.type}
        defaultGroupId={selectedGroup.id}
        visible={visibleMap.addScriptVisible || visibleMap.editScriptVisible}
        data={modalInfo.data}
        onOk={onAddTalkScriptOk}
        onCancel={closeModal}
        confirmLoading={confirmLoading}
        groupList={talkScriptGroupList}
      />
      <DetailTalkScriptDrawer
        title="话术详情"
        visible={visibleMap.detailScriptVisible}
        data={modalInfo.data}
        onCancel={closeModal}
        isPerson={isPerson}
      />
      <Row gutter={20}>
        <Col span={6}>
          <GroupSide
            title="全部分组"
            selectedKey={selectedGroup.id}
            dataSource={talkScriptGroupList}
            onSelect={onSelectedGroup}
            loading={talkScriptGroupListLoading}
            itemProps={{
              preAction: true,
              showAction: (item) => !item.hasDefault,
              onAction: onAction,
            }}
            onAdd={onAddGroup}
            addonBefore={
              modalInfo.type === 'addGroup' ? (
                <div style={{ marginBottom: 6 }}>
                  <ImmediateInput
                    {...inputProps}
                  />
                </div>
              ) : null
            }
            renderItemContent={(item) => {
              return (
                <div className={cls({
                  [styles['list-item']]: true,
                  [styles[`count-${Math.floor(Math.log10(groupMaxCount))}`]]: true,
                })}
                >
                  <Tooltip title={item.name} placement="topLeft">
                    <span className={styles['group-name']}>{item.name}</span>
                  </Tooltip>
                  <span className={styles['group-count']}>
                    {item.num || 0}
                  </span>
                </div>
              )
            }}
            renderItem={(item) => {
              if (
                modalInfo.type === 'editGroup' &&
                item.id === modalInfo.data.id
              ) {
                return (
                  <div style={{ marginBottom: 6 }}>
                    <ImmediateInput
                      defaultValue={item.name}
                      {...inputProps}
                    />
                  </div>
                )
              } else {
                return undefined
              }
            }}
          />
        </Col>
        <Col span={18}>
          <SearchForm
            form={searchForm}
            configList={searchConfig}
            onSearch={search.submit}
            onReset={search.reset}
          />
          <TableContent
            {...tableProps}
            columns={columns}
            scroll={{ x: 1000 }}
            operationCol={{ width: 140 }}
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
                disabled={!selectedGroup.id}
                ghost
                icon={<PlusOutlined />}>
                添加
              </Button>,
              <Button
                key="remove"
                type="primary"
                onClick={onRemove}
                disabled={selectedKeys.length === 0}
                ghost
                icon={<DeleteOutlined />}>
                删除
              </Button>,
            ]}
          />
        </Col>
      </Row>
    </div>
  )
}
export { DetailTalkScriptDrawer }