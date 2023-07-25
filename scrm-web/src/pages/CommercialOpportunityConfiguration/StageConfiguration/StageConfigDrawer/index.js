import { useEffect } from 'react'
import { Modal, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import CommonDrawer from 'components/CommonDrawer'
import StatusItem from './StatusItem'
import EditStatusModal from './EditStatusModal'
import { useModalHook, useTable } from 'src/hooks'
import { formatColorStr } from 'components/MyColorPicker/utils'
import cls from "classnames"
import {
  AddStatus,
  EditStatus,
  RemoveStatus,
  GetConfigList,
  UpdateSort,
} from 'services/modules/commercialOpportunityConfiguration'
import { actionRequestHookOptions } from 'services/utils'




import { MenuOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import { arrayMoveImmutable } from 'array-move';
import React, { useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import styles from '../../index.module.less';


const TYPE_CODE = 'OPPORTUNITY_STAGE'

const DragHandle = SortableHandle(() => (
  <MenuOutlined
    style={{
      cursor: 'grab',
      color: '#999',
    }}
  />
));

const SortableItem = SortableElement((props) => <tr {...props} />);
const SortableBody = SortableContainer((props) => <tbody {...props} />);

export default (props) => {
  const [dataSource, setDataSource] = useState([]);
  const { visible, data = {}, ...rest } = props
  const { openModal, closeModal, visibleMap, modalInfo, confirmLoading, requestConfirmProps, } = useModalHook([
    'add',
    'edit',
  ])
  const {
    run: runGetConfigList,
    refresh,
    toFirst,
    tableProps
  } = useTable(GetConfigList, {
    manual: true,
    onSuccess: (data) => {
      const list = data.list.map((item) => {
        item.index = item.sort
        item.key = item.id
        return item;
      })
      setDataSource(list)
    }
  })

  const {
    run: runUpdateSort,
  } = useRequest(UpdateSort, {
    manual: true,
    onSuccess: () => {
      runGetConfigList({}, {
        groupId: data.id,
        typeCode: TYPE_CODE,
      })
    }
  })








  const { run: runAddStatus } = useRequest(AddStatus, {
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
  const { run: runEditStatus } = useRequest(EditStatus, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '编辑',
      successFn: () => {
        refresh()
        closeModal()
      },
    }),
  })
  const { run: runRemoveStatus } = useRequest(RemoveStatus, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '删除',
      successFn: toFirst,
    }),
  })

  useEffect(() => {
    if (visible && data.id) {
      runGetConfigList({}, {
        groupId: data.id,
        typeCode: TYPE_CODE,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, data.id])

  const onAdd = () => {
    openModal('add')
  }
  const onAddStatusOk = (vals) => {
    let params = {
      color: formatColorStr(vals.color, 1),
      groupId: data.id,
      code: modalInfo.data.code,
      isSystem: false,
      name: vals.name,
      sort: 1,
      typeCode: TYPE_CODE,
    }
    if (modalInfo.type === 'add') {
      runAddStatus(params)
    } else {
      params.id = modalInfo.data.id
      runEditStatus(params)
    }
  }

  const onEditRecord = (record) => {
    return () => {
      openModal('edit', record)
    }

  }

  const onRemoveRecord = (record) => {
    return () => {
      Modal.confirm({
        title: '提示',
        content: `确定要删除阶段"${record.name}"吗`,
        onOk: () => {
          runRemoveStatus({
            id: record.id
          })
        },
      })
    }
  }


  const columns = [
    {
      title: 'Sort',
      dataIndex: 'sort',
      width: 30,
      className: 'drag-visible',
      render: () => <DragHandle />,
    },
    {
      title: '阶段名称',
      dataIndex: 'name',
    },
    {
      title: '阶段颜色',
      dataIndex: 'color',
      render: (val, record) => {
        return (
          <StatusItem
            name={record.name}
            color={val}
          />
        )
      },
    },
    {
      title: '关联数量',
      dataIndex: 'relateCount',
      render: (val) => val || 0,
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (_, record) => {
        const isEditDisabled = record.isSystem ? true : false;
        const isDeleteDisabled = record.isSystem || record.relateCount > 0 ? true : false
        return (<><span className={cls({ [styles['actionItem']]: true, [styles['disabled']]: isEditDisabled })} onClick={record.isSystem ? null : onEditRecord(record)}>修改</span>
          <span className={cls({ [styles['actionItem']]: true, [styles['disabled']]: isDeleteDisabled })} onClick={record.isSystem || record.relateCount > 0 ? null : onRemoveRecord(record)}>删除</span></>)
      }
    }
  ];





  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(dataSource.slice(), oldIndex, newIndex).filter(
        (el) => !!el,
      );
      const params = { groupId: data.id, brCommonConfList: newData }
      setDataSource(newData);
      runUpdateSort(params)

    }
  };

  const DraggableContainer = (props) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );
  const DraggableBodyRow = ({ className, style, ...restProps }) => {
    // function findIndex base on Table rowKey props and should always be a right array index
    const index = dataSource.findIndex((x) => x.index === restProps['data-row-key']);
    return <SortableItem index={index} {...restProps} />;
  };






  return (
    <CommonDrawer visible={visible} {...rest}>
      <EditStatusModal
        title={visibleMap.addVisible ? '添加阶段' : '修改阶段'}
        visible={visibleMap.addVisible || visibleMap.editVisible}
        onCancel={closeModal}
        confirmLoading={confirmLoading}
        onOk={onAddStatusOk}
        data={modalInfo.data}
      />
      <Button onClick={onAdd} type="primary" icon={<PlusOutlined />}>
        添加阶段
      </Button>
      <Table
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        rowKey="index"
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
      />


    </CommonDrawer>
  )
}
