import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Select, Form, Button, Input, Row, Col, message } from 'antd'
import { useRequest } from 'ahooks'
import { isEmpty, get } from 'lodash'
import moment from 'moment'
import { PageContent } from 'layout'
import { ATTACH_RULE_TYPE } from 'components/WeChatMsgEditor/constants'
import RuleItem from 'pages/TaskManage/GroupSop/components/RuleFormItem'
import { DEADLINE_TYPE_VALS } from 'pages/TaskManage/GroupSop/components/DeadlineItem'
import FilterUsers from './components/FilterUsers'
import { convertTags } from 'components/TagSelect/utils'
import { refillUsers } from 'components/MySelect/utils'
import { getRequestError, actionRequestHookOptions } from 'services/utils'
import { AddSop, GetSopDetail, EditSop } from 'services/modules/customerSop'
import {
  getMediaParams,
  getFillMedia,
  TEXT_KEY_BY_VAL,
} from 'components/WeChatMsgEditor/utils'
import { getFileUrl } from 'src/utils'
import {
  REPEAT_TYPES,
  TRIGGER_TYPES,
  TRIGGER_OPTIONS,
  EXECUTE_WAY_OPTIONS,
  EXECUTE_WAY_EN,
} from 'pages/TaskManage/CustomerSop/constants'
import { FILTER_TYPES } from './components/FilterUsers'
import { getMediaIdsByRules } from '../utils'
import styles from './index.module.less'

const refillRules = (ruleList, resData, cb) => {
  if (Array.isArray(ruleList)) {
    return ruleList.map((ele) => {
      const extraObj = typeof cb === 'function' ? cb(ele) || {} : {}
      return {
        ...extraObj,
        name: ele.name,
        executeWay: ele.way,
        id: ele.id,
        executeTime: {
          time:
            resData.term === TRIGGER_TYPES.ADD_USER
              ? moment(ele.startTime, 'HH:mm')
              : moment(ele.executeAt, 'YYYY-MM-DD HH:mm:ss'),
          count: ele.startDay || 1,
        },
        repeat: {
          type: ele.period,
          count: ele.customDay,
        },
        deadline: {
          type: ele.limitDay ? DEADLINE_TYPE_VALS.DAY : DEADLINE_TYPE_VALS.HOUR,
          num: ele.limitDay || ele.limitHour,
        },
        repeatEndTime: ele.endAt ? moment(ele.endAt, 'YYYY-MM-DD') : undefined,
      }
    })
  } else {
    return []
  }
}
const momentRule = {
  type: 'or',
  options: [
    {
      type: ATTACH_RULE_TYPE.IMAGE,
      max: 9,
    },
    {
      type: ATTACH_RULE_TYPE.LINK,
      max: 1,
    },
    {
      type: ATTACH_RULE_TYPE.VIDEO,
      max: 1,
    },
  ],
}
const triggerByTypeParams = {
  [FILTER_TYPES.PART]: {
    customerIds: [],
  },
  [FILTER_TYPES.FILTER]: {
    chooseTags: [],
    departmentIds: [],
    staffIds: [],
  },
}
const mediaExtras = {
  [EXECUTE_WAY_EN.USER_MOMENT]:
    '附件最多支持9个图片类型，或者1个视频，或者1个链接。类型只能三选一',
}
const mediaRules = {
  [EXECUTE_WAY_EN.USER_MOMENT]: momentRule,
}
export default () => {
  const [form] = Form.useForm()
  const [trigger, setTrigger] = useState(TRIGGER_TYPES.TIME)
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !isEmpty(id)
  const backList = () => {
    const url = `/customerSop/list`
    navigate(url)
  }
  const {
    data = {},
    loading: detailLoading,
    run: runGetDataDetail,
  } = useRequest(GetSopDetail, {
    manual: true,
    onSuccess: async (resData) => {
      if (isEmpty(resData)) {
        backList()
      } else {
        setTrigger(resData.term)
        const fildIds = getMediaIdsByRules(resData.ruleList)
        const fileUrls = fildIds.length
          ? await getFileUrl({
              ids: fildIds,
            })
          : {}
        let customerType = ''
        if (resData.hasAllCustomer) {
          customerType = FILTER_TYPES.ALL
        } else if (
          Array.isArray(resData.customerIds) &&
          resData.customerIds.length
        ) {
          customerType = FILTER_TYPES.PART
        } else {
          customerType = FILTER_TYPES.FILTER
        }
        form.setFieldsValue({
          name: resData.name,
          customers: {
            type: customerType,
            tags: convertTags(resData.chooseTags, resData.chooseTagNames),
            users: refillUsers({
              userArr: resData.staffList,
              depArr: resData.departmentList,
            }),
            customers: Array.isArray(resData.customerList)
              ? resData.customerList
              : [],
          },
          rules: refillRules(resData.ruleList, resData, (ruleItem) => {
            const textArr = ruleItem.msg.text
            const msgText =
              Array.isArray(textArr) && textArr.length ? textArr[0].content : ''
            return {
              msg: {
                text: msgText,
                media: getFillMedia(ruleItem.msg.media, fileUrls),
              },
            }
          }),
        })
      }
    },
    onError: (err) => {
      getRequestError(err)
      backList()
    },
  })
  const { run: runAddData, loading: addLoading } = useRequest(AddSop, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: backList,
    }),
  })
  const { run: runEditData, loading: editLoading } = useRequest(EditSop, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '编辑',
      successFn: backList,
    }),
  })

  const confirmLoading = addLoading || editLoading

  useEffect(() => {
    if (id) {
      runGetDataDetail({
        id,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const oldRules = useMemo(() => {
    return refillRules(data.ruleList, data)
  }, [data])
  const onTriggerChange = (val) => {
    setTrigger(val)
  }

  const getRuleTimeParams = (ele) => {
    let params = {}
    if (trigger === TRIGGER_TYPES.ADD_USER) {
      params = {
        startDay: ele.executeTime.count,
        startTime: ele.executeTime.time.format('HH:mm'),
      }
    } else {
      const period = ele.repeat.type
      params = {
        period,
        executeAt: ele.executeTime.time.format('YYYY-MM-DD HH:mm') + ':00',
      }
      if (period === REPEAT_TYPES.DEFINED) {
        params = {
          ...params,
          customDay: ele.repeat.count,
        }
      }
      if (period !== REPEAT_TYPES.NEVER) {
        params = {
          ...params,
          endAt: ele.repeatEndTime.format('YYYY-MM-DD'),
        }
      }
    }
    if (ele.id) {
      params = {
        ...params,
        id: ele.id,
      }
      if (Array.isArray(data.ruleList)) {
        const targetItem = data.ruleList.find((item) => item.id === ele.id)
        if (targetItem) {
          params = {
            ...params,
            jobId: targetItem.jobId,
            sopId: targetItem.sopId,
          }
        }
      }
    }
    return params
  }
  const handleRulesParams = (rules) => {
    const list = rules.map((ele) => ({
      name: ele.name,
      msg: {
        media: getMediaParams(ele.msg.media),
        text: [
          {
            type: TEXT_KEY_BY_VAL.TEXT,
            content: ele.msg.text,
          },
        ],
      },
      ...getRuleTimeParams(ele),
      way: ele.executeWay,
      ...handleDeadlineParams(ele.deadline),
    }))
    return {
      ruleList: list,
    }
  }

  const handleFilterCustomer = (vals) => {
    const { customers } = vals
    const hasAllCustomer = customers.type === FILTER_TYPES.ALL
    let params = {
      hasAllCustomer,
      ...triggerByTypeParams[FILTER_TYPES.FILTER],
      ...triggerByTypeParams[FILTER_TYPES.PART],
    }
    if (customers.type === FILTER_TYPES.FILTER) {
      let departmentIds = []
      let staffIds = []
      if (Array.isArray(customers.users)) {
        customers.users.forEach((ele) => {
          if (ele.isDep) {
            departmentIds = [...departmentIds, ele.extId]
          } else {
            staffIds = [...staffIds, ele.extId]
          }
        })
      }
      const tagArr = get(customers, 'tags') || []
      params = {
        ...params,
        chooseTags: tagArr.map((ele) => ele.id),
        departmentIds,
        staffIds,
      }
    }

    if (customers.type === FILTER_TYPES.PART) {
      if (Array.isArray(customers.customers) && customers.customers.length) {
        let customerIds = []
        customers.customers.forEach((ele) => {
          customerIds = [...customerIds, ele.extId]
        })
        params = {
          ...params,
          customerIds,
        }
      }
    }
    return params
  }

  const handleDeadlineParams = (deadline) => {
    let params = {
      limitDay: '',
      limitHour: '',
    }
    if (deadline.type === DEADLINE_TYPE_VALS.DAY) {
      params.limitDay = deadline.num
    } else {
      params.limitHour = deadline.num
    }
    return params
  }

  const handleParams = (vals) => {
    const { name, rules } = vals
    return {
      name,
      term: trigger,
      ...handleFilterCustomer(vals),
      ...handleRulesParams(rules),
    }
  }

  const onFinish = (vals) => {
    if (trigger === TRIGGER_TYPES.ADD_USER && vals.customers.times) {
      const [endTime] = vals.customers.times
      if (!endTime.isAfter(moment(), 'days')) {
        message.warning('添加时间的结束时间不能小于当前时间')
        return
      }
    }
    const params = handleParams(vals)
    if (id) {
      runEditData({
        id,
        ...params,
        status: data.status,
      })
    } else {
      runAddData(params)
    }
  }

  const validRuleName = async (itemIdx, rule, value) => {
    if (value) {
      const nameIsExist = form
        .getFieldValue('rules')
        .some((ele, idx) => ele.name === value && idx !== itemIdx)
      if (nameIsExist) {
        throw new Error('规则名称已存在')
      } else {
        Promise.resolve()
      }
    } else {
      throw new Error('请输入规则名称')
    }
  }

  const defaultRule = {
    executeTime: {
      count: 1,
    },
    repeat: {
      type: REPEAT_TYPES.DATE,
      count: 1,
    },
    executeWay: EXECUTE_WAY_EN.REMAIND,
    msg: {},
    deadline: {
      num: 1,
      type: DEADLINE_TYPE_VALS.HOUR,
    },
  }
  const initialValues = {
    customers: {
      type: FILTER_TYPES.PART,
    },
    rules: [defaultRule],
  }
  return (
    <PageContent
      loading={detailLoading}
      showBack={true}
      backUrl={`/customerSop/list`}>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        initialValues={initialValues}
        scrollToFirstError={true}
        form={form}>
        <div className={styles['page']}>
          <div className={styles['page-body']}>
            <Row>
              <Col span={12}>
                <Form.Item
                  label="流程名称"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: '请输入流程名称',
                    },
                  ]}>
                  <Input maxLength={20} placeholder="请输入不超过20个字符" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item label="触发条件" required={true}>
                  <Select
                    value={trigger}
                    options={TRIGGER_OPTIONS}
                    placeholder="请选择"
                    onChange={onTriggerChange}
                    disabled={isEdit}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="选择客户"
                  name="customers"
                  required={true}
                  labelCol={{ span: 4 }}
                  rules={[
                    {
                      required: false,
                      message: '请选择目标群聊',
                    },
                    () => ({
                      validator(_, value) {
                        if (
                          value.type === FILTER_TYPES.FILTER &&
                          isEmpty(value.tags) &&
                          isEmpty(value.users)
                        ) {
                          return Promise.reject(new Error('请选择筛选条件'))
                        } else if (
                          value.type === FILTER_TYPES.PART &&
                          isEmpty(value.customers)
                        ) {
                          return Promise.reject(new Error('请选择客户'))
                        } else {
                          return Promise.resolve()
                        }
                      },
                    }),
                  ]}>
                  <FilterUsers />
                </Form.Item>
              </Col>
            </Row>
            <div>
              <Form.List name="rules">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, idx) => {
                      return (
                        <RuleItem
                          oldRules={oldRules}
                          {...field}
                          idx={idx}
                          key={idx}
                          len={fields.length}
                          validRuleName={(...args) =>
                            validRuleName(idx, ...args)
                          }
                          remove={remove}
                          triggerType={trigger}
                          getFieldValue={form.getFieldValue}
                          typeOptions={TRIGGER_OPTIONS}
                          triggerTypes={TRIGGER_TYPES}
                          executWayOptions={EXECUTE_WAY_OPTIONS}
                          mediaRules={mediaRules}
                          mediaExtras={mediaExtras}
                        />
                      )
                    })}
                    <div className={styles['add-rule']}>
                      <Button
                        type="primary"
                        onClick={() => {
                          add(defaultRule)
                        }}>
                        添加规则
                      </Button>
                    </div>
                  </>
                )}
              </Form.List>
            </div>
          </div>
          <div className={styles['page-footer']}>
            <Button style={{ marginRight: 8 }} onClick={backList}>
              取消
            </Button>
            <Button
              type="primary"
              ghost
              onClick={form.submit}
              loading={confirmLoading}>
              确定
            </Button>
          </div>
        </div>
      </Form>
    </PageContent>
  )
}
