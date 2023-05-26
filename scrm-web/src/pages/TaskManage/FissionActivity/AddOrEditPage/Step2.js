import { useImperativeHandle, forwardRef } from 'react'
import { InputNumber, Form, Row, Col } from 'antd'
import {
  DeleteOutlined,
  PlusCircleOutlined,
  InfoCircleFilled,
} from '@ant-design/icons'
import TagSelect from 'components/TagSelect'
import TagCell from 'components/TagCell'
import UsersTagCell from 'components/UsersTagCell'
import MySelect from 'components/MySelect'
import { NUM_CN } from 'utils/constants'
import { MAX_LEVEL } from '../constants'
import styles from './index.module.less'

export default ({ form, isEdit, oldStageList }) => {
  if (isEdit) {
    return oldStageList.map((ele) => (
      <StageOnlyReadItem key={ele.id} data={ele} />
    ))
  }
  return (
    <div>
      <Form.List name="tasks">
        {(fields, { add, remove }) => (
          <>
            {!isEdit ? (
              <p className={styles['task-tip']}>
                <InfoCircleFilled className={styles['tip-icon']} />
                最多可设置
                <span className={styles['total-count']}>{MAX_LEVEL}</span>
                个阶段,当前已设置
                <span className={styles['current-count']}>{fields.length}</span>
                个阶段
              </p>
            ) : null}
            {fields.map(({ key, name, ...restField }, idx) => {
              const addable = fields.length < MAX_LEVEL
              const task = form.getFieldValue('tasks')
              const preItem = idx > 0 && task ? task[idx - 1] : {}
              return (
                <StageItem
                  key={key}
                  idx={idx}
                  // 设置上一个的值
                  onAdd={() => {
                    const tasks = form.getFieldValue('tasks')
                    const val = Array.isArray(tasks) ? tasks[idx] || {} : {}
                    add({
                      ...val,
                      num: val.num ? val.num + 1 : 1,
                    })
                  }}
                  addable={!isEdit && addable}
                  removeable={!isEdit && idx > 0}
                  name={name}
                  {...restField}
                  onRemove={() => remove(name)}
                />
              )
            })}
          </>
        )}
      </Form.List>
    </div>
  )
}
const StageItem = forwardRef(
  ({ onAdd, name, onRemove, idx, addable, removeable, ...rest }, ref) => {
    useImperativeHandle(ref, () => ({}))
    return (
      <div className={styles['stage-task-item']}>
        <div className={styles['stage-task-item-header']}>
          {NUM_CN[idx + 1]}阶任务
          <div className={styles['stage-task-item-actions']}>
            {addable ? (
              <PlusCircleOutlined
                className={styles['stage-task-item-action']}
                onClick={onAdd}
              />
            ) : null}
            {removeable ? (
              <DeleteOutlined
                className={styles['stage-task-item-action']}
                onClick={onRemove}
              />
            ) : null}
          </div>
        </div>
        <div className={styles['stage-task-item-body']}>
          <Row>
            <Col span={12}>
              <Form.Item
                label="目标客户数"
                name={[name, 'num']}
                rules={[
                  {
                    required: true,
                    message: '请输入目标客户数',
                  },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const preCount =
                        idx > 0 ? getFieldValue(['tasks', idx - 1, 'num']) : 0
                      if (!value || value > preCount) {
                        return Promise.resolve()
                      }
                      const msg = `目标客户数需要大于${preCount}`
                      return Promise.reject(new Error(msg))
                    },
                  }),
                ]}
                {...rest}>
                <InputNumber min={1} decimalSeparator={0} precision={0} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="任务达成标签"
                name={[name, 'taskTags']}
                rules={[
                  {
                    required: true,
                    type: 'array',
                    message: '请选择任务达成标签',
                  },
                ]}
                {...rest}>
                <TagSelect
                  placeholder="请选择标签"
                  style={{ width: '100%' }}
                  allowAddTag={true}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item
                label="领奖客服"
                name={[name, 'preizeUser']}
                rules={[
                  {
                    required: true,
                    type: 'array',
                    message: '请选择领奖客服',
                  },
                ]}
                {...rest}>
                <MySelect title="选择员工" onlyChooseUser={true} />
              </Form.Item>
            </Col>
          </Row>
        </div>
      </div>
    )
  }
)

const StageOnlyReadItem = ({ data }) => {
  return (
    <div className={styles['stage-onlyread-item']}>
      <Row>
        <Col span={12}>
          <Form.Item label="目标客户">{data.num}</Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="任务达成标签">
            <TagCell dataSource={data.tagList} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Form.Item
            label="领奖客服"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}>
            <UsersTagCell dataSource={data.staffVOList} />
          </Form.Item>
        </Col>
      </Row>
    </div>
  )
}
