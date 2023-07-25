import { useEffect, useState, useRef, useMemo } from 'react'
import { DatePicker, Form, Input, Button, Row, Col, Select } from 'antd'
import { uniqueId } from 'lodash'
import moment from 'moment'
import { MsgEditor } from 'components/WeChatMsgEditor'
import OpenEle from 'components/OpenEle'
import WithWSwitchFormItem from 'components/WithWSwitchFormItem'
import { Table } from 'components/TableContent'
import CommonModal from 'components/CommonModal'
import { getMsgRules } from 'components/WeChatMsgEditor/utils'
import styles from './index.module.less'

const { Option } = Select
const msgRule = getMsgRules({
  rules: [
    {
      type: 'noEmpty',
      message: '请输入跟进内容',
    },
    { type: 'maxText', message: '跟进内容字数已超过限制' },
  ],
})
export default (props) => {
  const { visible, taskTableList = [], cooperatorList, onOk, ...rest } = props
  const [dataList, setDataList] = useState([])
  const [addFollowForm] = Form.useForm()
  const preVisibleRef = useRef(visible)

  useEffect(() => {
    if (!visible) {
      setDataList([])
      if (preVisibleRef.current !== visible) {
        addFollowForm.resetFields()
      }
    }
    preVisibleRef.current = visible
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onAddTask = () => {
    setDataList((arr) => [
      ...arr,
      {
        id: uniqueId('new'),
      },
    ])
  }

  const handleOk = (vals) => {
    if (typeof onOk === 'function') {
      onOk({
        ...vals,
        taskList: dataList,
      })
    }
  }

  const disabledDate = (currentDate) => {
    return currentDate.isBefore(moment(), 'days')
  }

  const onRemoveRecord = (record) => {
    setDataList((arr) => arr.filter((ele) => ele.id !== record.id))
  }

  const initialValues = {
    followContent: {},
    remindFollow: {
      checked: false,
      data: null,
    },
    remindCoordinate: {
      checked: false,
      data: [],
    },
    taskSettings: {
      checked: false,
    },
  }

  const taskIdFieldNames = useMemo(() => {
    return dataList.map((ele) => `todoTask_${ele.id}_name`)
  }, [dataList])

  const columns = [
    {
      title: '任务名称',
      dataIndex: 'name',
      width: 120,
      render: (val, record) => {
        const formItemKey = `todoTask_${record.id}_name`
        return (
          <Form.Item
            name={formItemKey}
            rules={[
              {
                validator: async (_, value = '') => {
                  if (!value) {
                    return Promise.reject('请输入任务名称')
                  } else {
                    const hasExist = taskIdFieldNames.some((item) => {
                      if (item !== formItemKey) {
                        const formVal = addFollowForm.getFieldValue(item)
                        return formVal.trim() === value.trim()
                      } else {
                        return false
                      }
                    })
                    if (hasExist) {
                      return Promise.reject(new Error(`任务名称已经存在`))
                    } else {
                      return Promise.resolve()
                    }
                  }
                },
              },
            ]}>
            <Input value={val} maxLength={30} placeholder="请输入任务名称" />
          </Form.Item>
        )
      },
    },
    {
      title: '负责人',
      dataIndex: 'principal',
      width: 100,
      render: (val, record) => (
        <Form.Item
          name={`todoTask_${record.id}_principal`}
          rules={[
            {
              required: true,
              message: '请选择负责人',
            },
          ]}>
          <Select placeholder="请选择">
            {cooperatorList.map((ele) => (
              <Option value={ele.cooperatorId} key={ele.id}>
                <OpenEle
                  type="userName"
                  key={ele.id}
                  openid={ele.cooperatorId}
                />
              </Option>
            ))}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: '完成时间',
      dataIndex: 'doneTime',
      width: 140,
      render: (val, record) => {
        return (
          <Form.Item
            name={`todoTask_${record.id}_doneTime`}
            rules={[
              {
                required: true,
                message: '请选择完成时间',
              },
            ]}>
            <DatePicker
              disabledDate={disabledDate}
              showTime={true}
              format="YYYY-MM-DD HH:mm"
            />
          </Form.Item>
        )
      },
    },
  ]
  return (
    <CommonModal
      visible={visible}
      width={720}
      {...rest}
      bodyStyle={{
        maxHeight: 360,
        overflowY: 'auto',
      }}
      onOk={addFollowForm.submit}
      scrollToFirstError={true}>
      <Form
        form={addFollowForm}
        initialValues={initialValues}
        onFinish={handleOk}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}>
        <Row>
          <Col span={24}>
            <Form.Item label="跟进内容" name="followContent" rules={msgRule}>
              <MsgEditor
                editorType="text"
                editorProps={{
                  maxLength: 600,
                }}
                attachmentRules={{
                  type: 'and',
                  options: [
                    {
                      type: 'img',
                    },
                    {
                      type: 'video',
                    },
                  ],
                }}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="设置跟进提醒"
              required={false}
              name="remindFollow"
              rules={[
                {
                  required: true,
                },
                {
                  validator: async (_, value) => {
                    if (value && value.checked) {
                      if (value.data) {
                        return Promise.resolve()
                      } else {
                        return Promise.reject(new Error(`请选择提醒时间`))
                      }
                    } else {
                      return Promise.resolve()
                    }
                  },
                },
              ]}>
              <WithWSwitchFormItem
                switchProps={{
                  style: {
                    marginRight: 4,
                  },
                }}>
                <DatePicker
                  placeholder="请选择提醒时间"
                  disabledDate={disabledDate}
                  showTime={true}
                  format="YYYY-MM-DD HH:mm"
                />
              </WithWSwitchFormItem>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item label="提醒协作人查看" name="remindCoordinate">
              <WithWSwitchFormItem
                switchProps={{
                  style: {
                    marginBottom: 6,
                  },
                }}>
                <div className={styles['associates-section']}>
                  {cooperatorList.map((ele) => (
                    <span className={styles['user-item']} key={ele.id}>
                      <OpenEle type="userName" openid={ele.cooperatorId} />
                    </span>
                  ))}
                </div>
              </WithWSwitchFormItem>
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="设置待办任务"
              name="taskSettings"
              required={false}
              rules={[
                {
                  required: true,
                },
                {
                  validator: async (_, value) => {
                    if (value && value.checked) {
                      if (dataList.length) {
                        return Promise.resolve()
                      } else {
                        return Promise.reject(new Error(`请添加任务`))
                      }
                    } else {
                      return Promise.resolve()
                    }
                  },
                },
              ]}>
              <WithWSwitchFormItem responeChildren={true}>
                <Table
                  columns={columns}
                  dataSource={dataList}
                  actions={[
                    {
                      title: '删除',
                      onClick: onRemoveRecord,
                    },
                  ]}
                  footer={() => (
                    <Button onClick={onAddTask}>添加任务</Button>
                  )}></Table>
              </WithWSwitchFormItem>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </CommonModal>
  )
}
