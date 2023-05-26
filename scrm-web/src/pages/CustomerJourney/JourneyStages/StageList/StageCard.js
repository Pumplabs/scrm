import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useState,
  useRef,
} from 'react'
import { Empty, Button, Spin, Tag, Modal, Menu, Dropdown, Select } from 'antd'
import { useRequest } from 'ahooks'
import {
  PlusOutlined,
  MoreOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons'
import { get } from 'lodash'
import AddStageUserDrawer from '../AddStageUserDrawer'
import CustomerItem from './CustomerItem'
import Draggable from '../DragStage/Draggable'
import Droppable from '../DragStage/Droppable'
import {
  GetJourneyUserList,
  RemoveJourneyCustomer,
  AddJourneyCustomer,
  BatchRemoveCustomers,
} from 'services/modules/customerJourney'
import { useModalHook } from 'src/hooks'
import { actionRequestHookOptions } from 'services/utils'
import { COLORS } from './constants'
import StageContext from '../../StageContext'
import styles from './index.module.less'

const colorLen = COLORS.length
const StageList = React.forwardRef(({ data, moveUsersRequest, idx }, ref) => {
  const { allStageList = [] } = useContext(StageContext)
  const newStageValRef = useRef(null)
  const curCustomerList = useRef([])
  const [stageValue, setStageValue] = useState(null)
  const {
    openModal,
    closeModal,
    visibleMap,
    modalInfo,
    setConfirm,
    confirmLoading,
  } = useModalHook(['addStageUser', 'confirm'])

  const {
    run: runGetJourneyUserList,
    mutate,
    data: customerList = [],
    loading: customerLoading,
  } = useRequest(GetJourneyUserList, {
    manual: true,
    onFinally(_, data) {
      curCustomerList.current = data
    },
  })

  const getData = () => {
    runGetJourneyUserList({
      journeyId: data.journeyId,
      journeyStageId: data.id,
    })
  }

  const rollbackList = () => {
    mutate(curCustomerList.current)
  }

  const moveItem = (item, isNew) => {
    if (isNew) {
      mutate([...customerList, item])
    } else {
      mutate(customerList.filter((ele) => ele.id !== item.id))
    }
  }

  useImperativeHandle(ref, () => ({
    getData,
    moveData: moveItem,
    rollbackList,
  }))
  const { run: runBatchRemoveCustomers } = useRequest(BatchRemoveCustomers, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '移除',
      successFn: getData,
    }),
  })
  const { run: runRemoveJourneyCustomer } = useRequest(RemoveJourneyCustomer, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: getData,
    }),
  })
  const { run: runAddJourneyCustomer } = useRequest(AddJourneyCustomer, {
    manual: true,
    onBefore() {
      setConfirm(true)
    },
    onFinally() {
      setConfirm(false)
    },
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: () => {
        getData()
        closeModal()
      },
    }),
  })

  useEffect(() => {
    runGetJourneyUserList({
      journeyId: data.journeyId,
      journeyStageId: data.id,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onRemoveRecord = (record) => {
    Modal.confirm({
      title: '提示',
      content: `确定要将客户“${get(record, 'customer.name')}”从阶段"${
        data.name
      }"中移除吗`,
      centered: true,
      onOk: () => {
        runRemoveJourneyCustomer({
          id: record.id,
        })
      },
    })
  }

  const onAdd = () => {
    openModal('addStageUser', {
      journeyId: data.journeyId,
      stageId: data.id,
    })
  }

  const onAddJourneyCustomerOk = ({ users, stageId }) => {
    const customerIds = users.map((ele) => ele.id)
    if (modalInfo.type === 'addStageUser') {
      runAddJourneyCustomer({
        customerIds,
        journeyStageId: stageId,
      })
    }
  }

  const onStageChange = (val) => {
    newStageValRef.current = val
    setStageValue(val)
  }

  const onRemoveUsers = () => {
    Modal.confirm({
      title: '提示',
      content: (
        <span>
          确认移除<Tag style={{ margin: '0px 4px' }}>{data.name}</Tag>
          的全部客户吗
        </span>
      ),
      centered: true,
      onOk: () => {
        const ids = customerList.map((ele) => ele.id)
        runBatchRemoveCustomers({
          ids,
        })
      },
    })
  }

  const onMoveUserOk = () => {
    moveUsersRequest({
      sourceId: data.id,
      targetId: stageValue,
    })
    setStageValue(null)
    closeModal()
  }

  const onMoveUsers = () => {
    openModal('confirm')
  }

  const onCancelConfirm = () => {
    setStageValue(null)
    closeModal()
  }

  const menu = (
    <Menu>
      <Menu.Item onClick={onMoveUsers} key="move">
        移动全部客户到
      </Menu.Item>
      <Menu.Item onClick={onRemoveUsers} key="remove">
        移除全部客户
      </Menu.Item>
    </Menu>
  )
  return (
    <>
      <AddStageUserDrawer
        modalType={modalInfo.type}
        title="添加客户"
        confirmLoading={confirmLoading}
        visible={visibleMap.addStageUserVisible}
        onCancel={closeModal}
        data={modalInfo.data}
        onOk={onAddJourneyCustomerOk}
      />
      <Modal
        title={null}
        closeIcon={null}
        closable={false}
        visible={visibleMap.confirmVisible}
        okButtonProps={{
          disabled: !stageValue,
        }}
        maskClosable={false}
        className={styles['confirm-modal']}
        width={416}
        footer={null}>
        <div className={styles['confirm-modal-header']}>
          <InfoCircleOutlined className={styles['confirm-modal-icon']} />
          <span className={styles['ant-modal-confirm-title']}>提示</span>
        </div>
        <div className={styles['confirm-modal-text']}>
          移动<Tag style={{ margin: '0px 4px' }}>{data.name}</Tag>全部客户到
          <Select
            style={{ marginLeft: 6, minWidth: 100 }}
            placeholder="请选择"
            onChange={onStageChange}
            value={stageValue}>
            {allStageList.map((ele) => (
              <Select.Option
                value={ele.id}
                key={ele.id}
                disabled={ele.id === data.id}>
                {ele.name}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className={styles['confirm-modal-footer']}>
          <Button
            className={styles['confirm-modal-cancel-btn']}
            onClick={onCancelConfirm}>
            取消
          </Button>
          <Button type="primary" onClick={onMoveUserOk} disabled={!stageValue}>
            确定
          </Button>
        </div>
      </Modal>
      <div className={styles['stage-list-item']} ref={ref}>
        <div
          className={styles['stage-list-item-header']}
          style={{
            background: `${COLORS[idx % colorLen]}`,
          }}>
          <span className={styles['stage-list-item-name']}>{data.name}</span>
          <span className={styles['stage-list-item-extra']}>
            <PlusOutlined
              className={styles['stage-list-item-add-action']}
              onClick={onAdd}
            />
            {customerList.length ? (
              <Dropdown overlay={menu} placement="bottomRight">
                <MoreOutlined />
              </Dropdown>
            ) : null}
          </span>
        </div>
        <div className={styles['stage-list-item-body']}>
          <Spin spinning={customerLoading}>
            {customerList.length ? (
              customerList.map((ele) => (
                <DragCustomerItem
                  key={ele.id}
                  data={ele}
                  onRemove={onRemoveRecord}
                />
              ))
            ) : (
              <Empty description="暂时没有客户信息哦" />
            )}
          </Spin>
        </div>
      </div>
    </>
  )
})

const DragCustomerItem = ({ data, ...rest }) => {
  return (
    <Draggable dragId={data.id} data={data}>
      <CustomerItem data={data} {...rest} removeable={true} />
    </Draggable>
  )
}
export default React.forwardRef(({ data, dragging, ...rest }, ref) => {
  return (
    <Droppable
      dropId={data.id}
      data={data}
      dragging={dragging}
      dropCls={styles['drop-list']}>
      <StageList data={data} {...rest} ref={ref} />
    </Droppable>
  )
})
