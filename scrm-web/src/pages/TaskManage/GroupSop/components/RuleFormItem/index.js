import { forwardRef, useEffect, useMemo, useState } from 'react'
import moment from 'moment'
import { DeleteOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { Form, Input, Row, Col, DatePicker, Select } from 'antd'
import { MsgEditor, MsgPreview } from 'components/WeChatMsgEditor'
import { getMsgRules } from 'components/WeChatMsgEditor/utils'
import RepeatItem, { REPEAT_TYPES } from '../RepeatItem'
import DeadlineItem from '../DeadlineItem'
import ExecuteTimeItem from '../ExecuteTimeItem'
import { NUM_CN } from 'src/utils/constants'
import styles from './index.module.less'

export const getMediaIdsByRules = (ruleList) => {
  let mediaIds = []
  if (Array.isArray(ruleList)) {
    ruleList.forEach((ele) => {
      if (Array.isArray(ele.msg.media)) {
        ele.msg.media.forEach((mediaItem) => {
          if (mediaItem.file && mediaItem.file.id) {
            mediaIds = [...mediaIds, mediaItem.file.id]
          }
        })
      }
    })
  }
  return mediaIds
}

const getRepeatTip = (repeatInfo) => {
  if (!repeatInfo || !repeatInfo.type || !repeatInfo.time) {
    return ''
  }
  const day = repeatInfo.time.day()
  const date = repeatInfo.time.date()
  const dayStr = day === 0 ? '日' : NUM_CN[day]
  const timeStr = repeatInfo.time.format('HH:mm')
  switch (repeatInfo.type) {
    case REPEAT_TYPES.DATE:
      return `每天的${timeStr}执行`
    case REPEAT_TYPES.WEEK:
      return `每周${dayStr}的${timeStr}执行`
    case REPEAT_TYPES.TWO_WEEK:
      return `每两周${dayStr}的${timeStr}执行`
    case REPEAT_TYPES.MONTH:
      return `每月${date}日的${timeStr}执行`
    case REPEAT_TYPES.NEVER:
      return ''
    case REPEAT_TYPES.DEFINED:
      return ''
    default:
      return ''
  }
}

const itemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 18,
  },
}

export default forwardRef((props, ref) => {
  const {
    name,
    oldRules = [],
    triggerType,
    typeOptions,
    triggerTypes,
    remove,
    len,
    idx,
    validRuleName,
    getFieldValue,
    executWayOptions,
    mediaRules = {},
    mediaExtras = {},
  } = props
  const triggerTypeIsTime = triggerType === triggerTypes.TIME
  const [repeatInfo, setRepeatInfo] = useState({
    type: REPEAT_TYPES.DATE,
  })
  const [msg, setMsg] = useState({})
  const [executeWay, setExecuteWay] = useState('')
  const onExecuteTimeChange = (val) => {
    setRepeatInfo((vals) => ({
      ...vals,
      time: val.time,
    }))
  }

  const onRepeatItemChange = (val) => {
    setRepeatInfo((vals) => ({
      ...vals,
      type: val.type,
    }))
  }

  const onExecuteWayChange = (val) => {
    setExecuteWay(val)
  }

  const disabledDate = (currentDate) => {
    if (repeatInfo.time && triggerTypeIsTime) {
      return repeatInfo.time.isAfter(currentDate, 'day')
    }
    return moment().isAfter(currentDate, 'day')
  }

  const disabledExecuteDate = (currentDate) => {
    return moment().isAfter(currentDate, 'day')
  }

  const onRemove = () => {
    remove(name)
  }

  const onMsgChange = (val) => {
    setMsg(val)
  }

  const validExecuteTime = async (rule, value) => {
    if (!value || !value.time || (!triggerTypeIsTime && !value.count)) {
      throw new Error('请选择执行时间')
    } else {
      if (triggerTypeIsTime && moment().isAfter(value.time)) {
        throw new Error('执行时间必须大于当前时间')
      } else {
        Promise.resolve()
      }
    }
  }

  const repeatTipText = useMemo(() => {
    return getRepeatTip(repeatInfo)
  }, [repeatInfo])

  const msgList = useMemo(() => {
    const { text, media: mediaList = [] } = msg
    const textArr = text
      ? [
          {
            type: 'text',
            text,
          },
        ]
      : []
    return [...textArr, ...mediaList]
  }, [msg])

  const ruleId = getFieldValue(['rules', idx, 'id'])
  useEffect(() => {
    if (ruleId && oldRules.length) {
      const item = oldRules.find((item) => item.id === ruleId)
      const msgValue = getFieldValue(['rules', idx, 'msg'])
      if (msgValue) {
        setMsg(msgValue)
      }
      if (item) {
        setRepeatInfo({
          type: item.repeat.type,
          time: item.executeTime.time,
        })
      }
    }
    const way = getFieldValue(['rules', idx, 'executeWay'])
    setExecuteWay(way)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ruleId, oldRules])

  const msgRules = getMsgRules({
    rules: [
      {
        type: 'noEmpty',
        message: '请输入内容',
      },
      { type: 'maxText', message: '内容字数已超过限制' },
      {
        type: 'attachType',
        options: mediaRules[executeWay],
        message: mediaExtras[executeWay] || '最多只能选择9个附件',
      },
    ],
    isRichText: false,
  })

  return (
    <div className={styles['rule-item']} ref={ref}>
      {len > 1 ? (
        <DeleteOutlined
          className={styles['rule-item-remove-action']}
          onClick={onRemove}
        />
      ) : null}
      <MsgPreview mediaList={msgList} className={styles['preview-container']} />
      <div className={styles['form-section']}>
        <Form.Item label="" name={[name, 'id']} {...itemLayout} hidden>
          <Input hidden />
        </Form.Item>
        <Row>
          <Col span={24}>
            <Form.Item
              label="规则名称"
              name={[name, 'name']}
              rules={[
                {
                  required: true,
                  validator: validRuleName,
                },
              ]}
              {...itemLayout}>
              <Input placeholder="请输入不超过20个字符" maxLength={20} />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              label="执行时间"
              name={[name, 'executeTime']}
              extra="建议执行时间大于当前时间5分钟,否则可能会执行失败"
              rules={[
                {
                  required: true,
                  validator: validExecuteTime,
                },
              ]}
              {...itemLayout}>
              <ExecuteTimeItem
                typeOptions={typeOptions}
                triggerIsTime={triggerTypeIsTime}
                triggerType={triggerType}
                onChange={onExecuteTimeChange}
                disabledDate={disabledExecuteDate}
              />
            </Form.Item>
          </Col>
        </Row>
        {triggerTypeIsTime ? (
          <>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="重复"
                  name={[name, 'repeat']}
                  rules={[
                    {
                      required: true,
                      message: '请选择',
                    },
                  ]}
                  extra={
                    repeatTipText ? (
                      <span>
                        <InfoCircleOutlined style={{ marginRight: 4 }} />
                        {repeatTipText}
                      </span>
                    ) : null
                  }
                  {...itemLayout}>
                  <RepeatItem onChange={onRepeatItemChange} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                {repeatInfo && repeatInfo.type !== REPEAT_TYPES.NEVER ? (
                  <Form.Item
                    label="结束重复"
                    dependencies={[name, 'repeat']}
                    name={[name, 'repeatEndTime']}
                    rules={[
                      {
                        required: true,
                        message: '请选择',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          const executeTime = getFieldValue([
                            'rules',
                            idx,
                            'executeTime',
                          ])
                          if (
                            executeTime.time &&
                            value &&
                            executeTime.time.isAfter(value, 'day')
                          ) {
                            return Promise.reject(
                              new Error('结束重复时间不能小于执行时间')
                            )
                          } else {
                            return Promise.resolve()
                          }
                        },
                      }),
                    ]}
                    {...itemLayout}>
                    <DatePicker
                      format="YYYY-MM-DD"
                      disabledDate={disabledDate}
                    />
                  </Form.Item>
                ) : null}
              </Col>
            </Row>
          </>
        ) : null}
        <Row>
          <Col span={24}>
            <Form.Item
              name={[name, 'msg']}
              label="发送内容"
              rules={msgRules}
              {...itemLayout}
              extra={mediaExtras[executeWay]}
            >
              <MsgEditor
                onChange={onMsgChange}
                editorType="text"
                editorProps={{
                  maxLength: 600,
                }}
                attachmentRules={mediaRules[executeWay]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              name={[name, 'executeWay']}
              label="执行方式"
              rules={[
                {
                  required: true,
                  message: '请选择执行方式',
                },
              ]}
              {...itemLayout}
            >
              <Select
                placeholder="请选择"
                options={executWayOptions}
                onChange={onExecuteWayChange}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <Form.Item
              name={[name, 'deadline']}
              label="截止时间"
              rules={[
                {
                  required: true,
                  message: '请选择截止时间',
                },
              ]}
              {...itemLayout}>
              <DeadlineItem />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </div>
  )
})
