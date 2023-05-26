import { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Select, Form, Button, Input, Row, Col } from 'antd'
import { useRequest } from 'ahooks'
import { isEmpty } from 'lodash'
import moment from 'moment'
import { PageContent } from 'layout'
import { getFileUrl } from 'src/utils'
import { DEADLINE_TYPE_VALS } from 'pages/TaskManage/GroupSop/components/DeadlineItem'
import RuleItem, { getMediaIdsByRules } from '../components/RuleFormItem'
import { handleUsersParams } from 'components/MySelect/utils'
import {
  getMediaParams,
  getFillMedia,
  TEXT_KEY_BY_VAL,
} from 'components/WeChatMsgEditor/utils'
import GroupItem, { TYPE_EN as FILTER_TYPE_EN } from './components/GroupItem'
import {
  AddGroupSop,
  EditGroupSop,
  GetGroupSopById,
} from 'services/modules/groupSop'
import { refillUsers } from 'components/MySelect/utils'
import { handleTimes } from 'utils/times'
import { getRequestError, actionRequestHookOptions } from 'services/utils'
import {
  REPEAT_TYPES,
  TRIGGER_TYPES,
  TRIGGER_OPTIONS,
  EXECUTE_WAY_OPTIONS,
} from 'pages/TaskManage/GroupSop/constants'
import { getGroupFilterType } from '../utils'
import { EXECUTE_WAY_VAL_EN } from '../constants'
import styles from './index.module.less'

const convertFormRules = (ruleList, term, cb) => {
  if (Array.isArray(ruleList)) {
    return ruleList.map((ele) => {
      const data = typeof cb === 'function' ? cb(ele) || {} : {}
      return {
        ...data,
        name: ele.name,
        executeWay: ele.way,
        id: ele.id,
        executeTime: {
          time:
            term === TRIGGER_TYPES.CREAT_CHAT
              ? moment(ele.startTime, 'HH:mm')
              : moment(ele.executeAt, 'YYYY-MM-DD HH:mm:ss'),
          count: ele.startDay,
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

const triggerByTypeParams = {
  [FILTER_TYPE_EN.PART]: {
    groupIds: [],
  },
  [FILTER_TYPE_EN.FILTER]: {
    startTime: '',
    endTime: '',
    groupName: '',
    groupTags: [],
    leaderIds: [],
    departmentIds: [],
  },
}

const refillTimes = (stime, etime) => {
  if (stime || etime) {
    return [refillTime(stime), refillTime(etime)]
  } else {
    return []
  }
}

const refillTime = (time) => {
  return time ? moment(time, 'YYYY-MM-DD HH:mm') : null
}

export default () => {
  const [form] = Form.useForm()
  const [trigger, setTrigger] = useState(TRIGGER_TYPES.TIME)
  const { id } = useParams()
  const navigate = useNavigate()
  const isEdit = !isEmpty(id)
  const backList = () => {
    const url = `/groupSop/list`
    navigate(url)
  }
  const {
    data = {},
    loading: detailLoading,
    run: runGetDataDetail,
  } = useRequest(GetGroupSopById, {
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
        const filterType = getGroupFilterType(resData)
        form.setFieldsValue({
          name: resData.name,
          targetGroup: {
            type: filterType,
            partGroup: Array.isArray(resData.groupChatList)
              ? resData.groupChatList
              : [],
            createTimes: refillTimes(resData.startTime, resData.endTime),
            groupName: resData.groupName,
            groupTags: Array.isArray(resData.tagList) ? resData.tagList : [],
            groupOwner: refillUsers({
              userArr: resData.staffList,
              depArr: resData.departmentList,
            }),
          },
          rules: convertFormRules(
            resData.ruleList,
            resData.term,
            (ruleItem) => {
              const textArr = ruleItem.msg.text
              const msgText =
                Array.isArray(textArr) && textArr.length
                  ? textArr[0].content
                  : ''
              return {
                msg: {
                  text: msgText,
                  media: getFillMedia(ruleItem.msg.media, fileUrls),
                },
              }
            }
          ),
        })
      }
    },
    onError: (err) => {
      getRequestError(err)
      backList()
    },
  })
  const { run: runAddData, loading: addLoading } = useRequest(AddGroupSop, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '新增',
      successFn: backList,
    }),
  })
  const { run: runEditData, loading: editLoading } = useRequest(EditGroupSop, {
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

  const oldRules = useMemo(
    () => convertFormRules(data.ruleList, data.term),
    [data]
  )

  const onTriggerChange = (val) => {
    setTrigger(val)
  }

  const handleTriggerParams = (vals) => {
    const { targetGroup } = vals
    let params = {}
    let hasAllGroup = false
    if (targetGroup.type === FILTER_TYPE_EN.ALL) {
      hasAllGroup = true
    } else if (targetGroup.type === FILTER_TYPE_EN.PART) {
      const partGroup = targetGroup.partGroup
      const groupIds = Array.isArray(partGroup)
        ? partGroup.map((ele) => ele.extChatId)
        : []
      params = {
        ...params,
        groupIds,
        ...triggerByTypeParams[FILTER_TYPE_EN.FILTER],
      }
    } else {
      const [startTime = '', endTime = ''] = handleTimes(
        targetGroup.createTimes
      )
      const groupTags = Array.isArray(targetGroup.groupTags)
        ? targetGroup.groupTags.map((ele) => ele.id)
        : []
      const { depIds: departmentIds, userIds: leaderIds } = handleUsersParams(
        targetGroup.groupOwner
      )
      params = {
        ...params,
        startTime,
        endTime,
        groupName: targetGroup.groupName,
        groupTags,
        leaderIds,
        departmentIds,
        ...triggerByTypeParams[FILTER_TYPE_EN.PART],
      }
    }
    params = {
      ...params,
      hasAllGroup,
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

  const handleRulesParams = (rules = []) => {
    const ruleList = rules.map((ele) => {
      let params = {}
      if (trigger === TRIGGER_TYPES.CREAT_CHAT) {
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
          const oldItem = data.ruleList.find(
            (ruleItem) => ruleItem.id === ele.id
          )
          if (oldItem) {
            params = {
              ...params,
              jobId: oldItem.jobId,
              sopId: oldItem.sopId,
            }
          }
        }
      }
      return {
        ...params,
        msg: {
          media: getMediaParams(ele.msg.media),
          text: [
            {
              type: TEXT_KEY_BY_VAL.TEXT,
              content: ele.msg.text,
            },
          ],
        },
        name: ele.name,
        way: ele.executeWay,
        ...handleDeadlineParams(ele.deadline),
      }
    })

    return {
      ruleList,
    }
  }

  const handleParams = (vals) => {
    const { name, rules } = vals
    return {
      name,
      ...handleTriggerParams(vals),
      ...handleRulesParams(rules),
      term: trigger,
    }
  }

  const onFinish = (vals) => {
    const params = handleParams(vals)
    if (id) {
      runEditData({
        id,
        status: data.status,
        ...params,
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
    msg: {},
    executeWay: EXECUTE_WAY_VAL_EN.REMIND,
    repeat: {
      type: REPEAT_TYPES.DATE,
    },
    deadline: {
      num: 1,
      type: DEADLINE_TYPE_VALS.HOUR,
    },
  }
  const initialValues = {
    rules: [defaultRule],
    targetGroup: {
      type: FILTER_TYPE_EN.PART,
    },
  }
  return (
    <PageContent
      loading={detailLoading}
      showBack={true}
      backUrl={`/groupSop/list`}>
      <Form
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
        initialValues={initialValues}
        scrollToFirstError={true}
        form={form}
      >
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
                  label="目标群聊"
                  labelCol={{ span: 4 }}
                  name="targetGroup"
                  required={true}
                  rules={[
                    {
                      required: false,
                      message: '请选择目标群聊',
                    },
                    () => ({
                      validator(_, value) {
                        const filters = [
                          value.createTimes,
                          value.groupName,
                          value.groupTags,
                          value.groupOwner,
                        ]
                        const isEmptyFilter = filters.every((filterItem) =>
                          isEmpty(filterItem)
                        )
                        if (
                          value.type === FILTER_TYPE_EN.FILTER &&
                          isEmptyFilter
                        ) {
                          return Promise.reject(new Error('请选择筛选条件'))
                        } else if (
                          value.type === FILTER_TYPE_EN.PART &&
                          isEmpty(value.partGroup)
                        ) {
                          return Promise.reject(new Error('请选择群聊'))
                        } else {
                          return Promise.resolve()
                        }
                      },
                    }),
                  ]}>
                  <GroupItem />
                </Form.Item>
              </Col>
            </Row>
            <div>
              <Form.List name="rules">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, idx) => (
                      <RuleItem
                        {...field}
                        idx={idx}
                        len={fields.length}
                        validRuleName={(...args) => validRuleName(idx, ...args)}
                        remove={remove}
                        getFieldValue={form.getFieldValue}
                        oldRules={oldRules}
                        triggerType={trigger}
                        typeOptions={TRIGGER_OPTIONS}
                        triggerTypes={TRIGGER_TYPES}
                        executWayOptions={EXECUTE_WAY_OPTIONS}
                      />
                    ))}
                    <div style={{ paddingLeft: 16 }}>
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
