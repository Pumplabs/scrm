import { useEffect, useRef } from 'react'
import { Form, Button, Input, Modal, Checkbox, Drawer, message } from 'antd'
import DrawerForm from 'components/DrawerForm'
import StageTags from './StageTags'
import { MAX_JOURNEY_STAGE } from '../constants'
import { PlusOutlined, TableOutlined, ProjectOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import { AddJourneyStage, GetJourneyAllStage, RemoveJourneyStage, UpdateJourneyStage, UpdateJourneyStageSort } from '../../../services/modules/customerJourney'
import { MenuOutlined } from '@ant-design/icons';
import { Table } from 'antd';
import { arrayMoveImmutable } from 'array-move';
import React, { useState } from 'react';
import { SortableContainer, SortableElement, SortableHandle } from 'react-sortable-hoc';
import CommonModal from '../../../components/CommonModal'
import styles from '../index.module.less'
import { use } from 'echarts'

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


export default ({ visible, data = {}, onCancel, onCloseUpdate, ...rest }) => {
  const [dataSource, setDataSource] = useState([]);
  const [editStage, setEditStage] = useState({})
  const [form] = Form.useForm();

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
      className: 'drag-visible',
    },
    {
      title: '描述',
      dataIndex: 'remark',
    },
    {
      title: '操作',
      dataIndex: 'action',
      render: (_, record) => {
        return (<><span className={styles['actionItem']} onClick={onEdit(record)}>修改</span>
          <span className={styles['actionItem']} onClick={onDelete(record.id)}>删除</span></>)
      }
    }
  ];
  const {
    run: runGetAllStage,
    loading: journeyStageLoading,
    data: stageList = [],
    mutate: mutateJourneyStage,
    refresh: refreshGetAllStage,
    cancel: cancelGetAllStage,
  } = useRequest(GetJourneyAllStage, {
    manual: true,
    onSuccess: () => {
      const _stageList = stageList.map((item) => {
        item.index = item.sort
        item.key = item.id
        return item
      })
      setDataSource(_stageList)
    }
  })

  const {
    run: runAddJourneyStage,
  } = useRequest(AddJourneyStage, {
    manual: true,
    onSuccess: () => {
      setIsModalOpen(false)
      form.resetFields()
      message.success("添加成功")
      runGetAllStage({ journeyId: data.id, })
    }
  })

  const {
    run: runUpdateJourneyStage,
  } = useRequest(UpdateJourneyStage, {
    manual: true,
    onSuccess: () => {
      message.success("修改成功")
      setIsModalOpen(false)
      form.resetFields()
      runGetAllStage({ journeyId: data.id, })
    }
  })


  const {
    run: runUpdateJourneyStageSort,
  } = useRequest(UpdateJourneyStageSort, {
    manual: true,
    onSuccess: () => {
      runGetAllStage({ journeyId: data.id, })
    }
  })


  const {
    run: runRemoveJourneyStage,
  } = useRequest(RemoveJourneyStage, {
    manual: true,
    onSuccess: () => {
      message.success("删除阶段成功")
      runGetAllStage({ journeyId: data.id, })
    }
  })





  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    if (visible && data.id)
      runGetAllStage({ journeyId: data.id, })
  }, [data, visible])

  const onSortEnd = ({ oldIndex, newIndex }) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(dataSource.slice(), oldIndex, newIndex).filter(
        (el) => !!el,
      );
      const params = { id: data.id, journeyStageList: newData }
      setDataSource(newData);
      runUpdateJourneyStageSort(params)

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


  const onEdit = (data) => {
    return () => {
      setEditStage(data)
      setIsModalOpen(true)
    }
  }
  const onDelete = (id) => {
    return () => {

      Modal.confirm({
        title: '提示',
        centered: true,
        content: "确定删除此阶段？",
        onOk: () => {
          runRemoveJourneyStage({ id, })
        },
      })

    }

  }

  const onAdd = () => {
    setIsModalOpen(true)
    setEditStage({})
  }
  const cancel = () => {
    setIsModalOpen(false)
    setEditStage({})
  }


  useEffect(() => {
    form.resetFields()
  }, [editStage])


  const ok = async () => {
    let values
    try {
      values = await form.validateFields()
      values.journeyId = data.id
      if (editStage.id) {
        values.id = editStage.id;
        runUpdateJourneyStage(values)
      } else {
        runAddJourneyStage(values)
      }

    } catch (error) {
      console.error(error);
    }

    // setIsModalOpen(false)
  }

  return (
    <Drawer
      visible={visible}
      width={620}
      onCancel={onCloseUpdate}
      onClose={onCloseUpdate}
      {...rest}>
      <div className={styles['toolbar']}>
        <Button
          key="add"
          type="primary"
          onClick={onAdd}
          ghost
          icon={<PlusOutlined />}>
          添加阶段
        </Button>
      </div>

      <Table
        pagination={false}
        dataSource={dataSource}
        columns={columns}
        loading={journeyStageLoading}
        rowKey="index"
        components={{
          body: {
            wrapper: DraggableContainer,
            row: DraggableBodyRow,
          },
        }}
      />


      <Modal visible={isModalOpen} title={editStage.id ? "修改阶段" : "添加阶段"} onCancel={cancel} onOk={ok} >
        <Form
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          initialValues={editStage}
          wrapperCol={{ span: 16 }}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item
            label="阶段名称"
            name="name"
            rules={[{ required: true, message: '请输入阶段名称!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="描述"
            name="remark"
            rules={[]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Drawer>
  )
}
