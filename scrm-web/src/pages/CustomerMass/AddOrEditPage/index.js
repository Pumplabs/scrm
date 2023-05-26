import { useEffect, useState } from 'react'
import { isEmpty, get, isEqual } from 'lodash'
import {
  Input,
  Button,
  Form,
  Alert,
  Row,
  Col,
  Radio,
  DatePicker,
  Modal,
  message,
} from 'antd'
import { useNavigate, useLocation } from 'react-router'
import { useParams } from 'react-router-dom'
import { FileSearchOutlined } from '@ant-design/icons'
import { useRequest } from 'ahooks'
import moment from 'moment'
import { PageContent } from 'layout'
import AdvanceCustomer from './AdvanceCustomer'
import MassMsg from './MassMsg'
import OpenEle from 'components/OpenEle'
import { getMediaParams, getFillMedia } from 'components/WeChatMsgEditor/utils'
import GroupOwnerSelect from 'components/GroupOwnerSelect'
import { actionRequestHookOptions } from 'services/utils'
import { SUCCESS_CODE } from 'utils/constants'
import { isSameArr } from 'src/utils'
import { handleTimes, handleTime } from 'utils/times'
import {
  AddCustomerMass,
  GetCustomerCountByCondition,
  EditCustomerMass,
  GetCustomerMassDetail,
} from 'services/modules/customerMass'
import styles from './index.module.less'

const compareFormData = (oldData, nextData) => {
  const { chatIds, chooseTags, excludeTags, staffIds, ...rest } = nextData
  // 账号
  if (Boolean(rest.hasAllStaff) !== Boolean(oldData.hasAllStaff)) {
    return !isSameArr(staffIds, oldData.staffIds)
  }
  // 客户去重
  if (Boolean(rest.hasDistinct) !== Boolean(oldData.hasDistinct)) {
    return true
  }
  // 群发时间
  if (Boolean(rest.hasSchedule) !== Boolean(oldData.hasSchedule)) {
    return oldData.sendTime !== rest.sendTime
  }
  // 客户比较结果
  const compareCustomerResult = compareCustomerData(oldData, nextData)
  if (compareCustomerResult) {
    return true
  }
  const compareEditResult = compareEditorData(oldData, nextData)
  if (compareEditResult) {
    return true
  }
  return false
}
// 比较客户信息
const compareCustomerData = (oldData, nextData) => {
  // 添加时间
  if (
    oldData.addStartTime ||
    nextData.addStartTime ||
    oldData.addEndTime ||
    nextData.addEndTime
  ) {
    return (
      oldData.addStartTime !== nextData.addStartTime ||
      oldData.addEndTime !== nextData.addEndTime
    )
  }

  const chatSameRes = isSameArr(oldData.chatIds, nextData.chatIds)
  if (!chatSameRes) {
    return true
  }
  const excludeSameRes = isSameArr(oldData.excludeTags, nextData.excludeTags)
  if (!excludeSameRes) {
    return true
  }
  if (!isEmpty(oldData.chooseTagType) || !isEmpty(nextData.chooseTagType)) {
    return oldData.chooseTagType !== nextData.chooseTagType
  }
  if (!isSameArr(oldData.chooseTags, nextData.chooseTags)) {
    return true
  }
  return false
}

// 比较编辑器
const compareEditorData = (oldData, nextData) => {
  return !isEqual(oldData.msg, nextData.msg)
}

const MASS_TIME_VALS = {
  // 立即发送
  IMMEDIATE: 1,
  // 定时发送
  TIMING: 2,
}
const CUSTOMER_TYPE = {
  ALL: 1,
  // 高级筛选
  ADVANCE: 2,
}
const refillTags = (ids = [], names = []) => {
  if (Array.isArray(ids) && Array.isArray(names)) {
    return ids.map((idItem, idIdx) => ({
      id: idItem,
      name: names[idIdx],
    }))
  }
  return []
}
const refillFormByData = (data = {}) => {
  let formData = {
    name: data.name,
    msgContent: {
      text:
        Array.isArray(data.msg.text) && data.msg.text.length
          ? data.msg.text[0].content
          : '',
      media: getFillMedia(data.msg.media),
    },
  }
  // 定时发送
  if (data.hasSchedule) {
    formData = {
      ...formData,
      timer: moment(data.sendTime, 'YYYY-MM-DD HH:mm'),
    }
  }
  // 非全部客户
  if (!data.hasAllCustomer) {
    let customerFilter = {
      // 添加时间
      times: [
        moment(data.addStartTime, 'YYYY-MM-DD'),
        moment(data.addEndTime, 'YYYY-MM-DD'),
      ],
      // 标签
      tags: {
        option: data.chooseTagType,
        tags: refillTags(data.chooseTags, data.chooseTagNames),
      },
      // 排除客户
      ignoreTags: {
        // excludeTags
        tags: refillTags(data.excludeTags, data.excludeTagNames),
      },
      // 群聊
      groupChat: data.chatIds,
    }
    if (data.sex) {
      customerFilter = {
        ...customerFilter,
        // 性别
        gender: data.sex,
      }
    }
    formData = {
      ...formData,
      ...customerFilter,
    }
  }
  return formData
}
export default () => {
  const [massTime, setMassTime] = useState(MASS_TIME_VALS.IMMEDIATE)
  const [customerType, setCustomerType] = useState(CUSTOMER_TYPE.ALL)
  const [customerResult, setCustomerResult] = useState({})
  const [massAccount, setMassAccount] = useState({})
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const location = useLocation()
  const { id: massId } = useParams()
  const isAdd = location.pathname.endsWith('add')

  const { run: runAddCustomerMass, loading: addLoading } = useRequest(
    AddCustomerMass,
    {
      manual: true,
      ...actionRequestHookOptions({
        actionName: '创建',
        successFn: () => {
          backToList()
        },
      }),
    }
  )
  const { run: runEditCustomerMass, loading: editLoading } = useRequest(
    EditCustomerMass,
    {
      manual: true,
      ...actionRequestHookOptions({
        actionName: '编辑',
        successFn: () => {
          backToList()
        },
      }),
    }
  )
  const { run: runGetCustomerCountByCondition } = useRequest(
    GetCustomerCountByCondition,
    {
      manual: true,
      onFinally: (_, res) => {
        if (res.code === SUCCESS_CODE) {
          setCustomerResult({
            count: res.data,
          })
        } else {
          setCustomerResult({})
        }
      },
    }
  )
  const { run: runGetCustomerMassDetail, data: massData = {} } = useRequest(
    GetCustomerMassDetail,
    {
      manual: true,
      onSuccess: (data) => {
        if (!data.hasAllStaff) {
          setMassAccount({
            value: data.staffIds,
          })
        }
        setCustomerType(
          data.hasAllCustomer ? CUSTOMER_TYPE.ALL : CUSTOMER_TYPE.ADVANCE
        )
        setMassTime(
          data.hasSchedule ? MASS_TIME_VALS.TIMING : MASS_TIME_VALS.IMMEDIATE
        )
        form.setFieldsValue(refillFormByData(data))
      },
    }
  )

  useEffect(() => {
    if (massId) {
      runGetCustomerMassDetail({
        id: massId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [massId])

  const onMassTimeChange = (e) => {
    const val = e.target.value
    setMassTime(val)
  }
  const onCustomerTypeChange = (e) => {
    const val = e.target.value
    clearCustomerResult()
    setCustomerType(val)
  }

  const onMassAccountChange = (val, options) => {
    let accountNames = ''
    if (Array.isArray(options) && options.length) {
      const len = options.length
      const names = options
        .slice(0, 2)
        .map((ele) => `[${ele.name}]`)
        .join()
      accountNames = len > 2 ? `${names}等` : names
    }
    setMassAccount({
      name: accountNames,
      value: val,
    })
    setCustomerResult({})
  }

  const hasModifyData = () => {
    // 判断是否修改过数据
    if (!isAdd) {
      const nextData = handleFromParams(form.getFieldsValue())
      return compareFormData(massData, nextData)
    } else {
      return false
    }
  }

  const showGiveUpTip = (cb) => {
    const modifyFlag = hasModifyData()
    if (modifyFlag) {
      Modal.confirm({
        title: '提示',
        content: '离开该界面后已设置的信息不会保存，确认离开吗',
        centered: true,
        onOk: cb,
      })
    } else {
      if (typeof cb === 'function') {
        cb()
      }
    }
  }

  const handleMassContent = (data = {}) => {
    const { text, media = [] } = data
    return {
      media: getMediaParams(media),
      text: [
        {
          type: 2,
          content: text,
        },
      ],
    }
  }

  const handleCustomerParamsByCondition = (customerFilter = {}) => {
    const hasAllCustomer = customerType === CUSTOMER_TYPE.ALL
    const hasAllStaff = isEmpty(massAccount.value)
    let params = {
      hasAllStaff,
      hasAllCustomer: Number(hasAllCustomer),
    }
    if (!hasAllCustomer) {
      const [addStartTime, addEndTime] = handleTimes(customerFilter.times, {
        searchTime: true,
      })
      const chooseTags = get(customerFilter, 'tags.tags') || []
      const excludeTags = get(customerFilter, 'ignoreTags.tags') || []
      params = {
        ...params,
        chatIds: customerFilter.groupChat,
        addStartTime,
        addEndTime,
        chooseTagType: get(customerFilter, 'tags.option'),
        chooseTags: chooseTags.map((ele) => ele.extId),
        excludeTags: excludeTags.map((ele) => ele.extId),
      }
    }
    if (!hasAllStaff) {
      params = {
        ...params,
        staffIds: massAccount.value,
      }
    }
    return params
  }

  // 表单参数
  const handleFromParams = (vals = {}) => {
    const { timer, repeatBool, customerFilter, msgContent, name } = vals
    // 是否定时
    const isScheduleTime = massTime === MASS_TIME_VALS.TIMING
    let params = {
      name,
      // 是否开启客户去重
      hasDistinct: false,
      // 是否全部客户
      // hasAllCustomer: Number(hasAllCustomer),
      hasSchedule: Number(isScheduleTime),
      msg: handleMassContent(msgContent),
      ...handleCustomerParamsByCondition(customerFilter),
    }
    if (isScheduleTime) {
      params = {
        ...params,
        sendTime: handleTime(timer, { format: 'YYYY-MM-DD HH:mm:ss' }),
      }
    }
    return params
  }

  const onSave = (vals) => {
    const params = handleFromParams(vals)
    if (params.sendTime && !moment().isBefore(vals.timer, 'minutes')) {
      message.warning('定时发送时间不得小于当前时间')
      return false
    }
    if (massId) {
      runEditCustomerMass({
        ...params,
        id: massId,
      })
    } else {
      runAddCustomerMass(params)
    }
  }

  const clearCustomerResult = () => {
    setCustomerResult({})
  }

  const onLookCustomer = () => {
    const customerFilter = form.getFieldValue('customerFilter')
    const params = handleCustomerParamsByCondition(customerFilter)
    runGetCustomerCountByCondition(params)
  }

  const backToList = () => {
    navigate(`/customerMass`)
  }

  const onCancel = () => {
    showGiveUpTip(backToList)
  }

  return (
    <PageContent showBack={true} backUrl={`/customerMass`}>
      <div className={styles['add-page']}>
        <div className={styles['form-section']}>
          <Form
            form={form}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            onFinish={onSave}>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="群发名称"
                  name="name"
                  rules={[
                    {
                      required: true,
                      message: '请输入群发名称',
                    },
                  ]}>
                  <Input
                    placeholder="请输入不超过16个字符"
                    maxLength={16}
                    style={{ width: '50%' }}
                    allowClear={true}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="群发账号" required={true}>
                  <GroupOwnerSelect
                    style={{ width: '50%' }}
                    placeholder="全部群发账号"
                    onChange={onMassAccountChange}
                    value={massAccount.value}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="选择客户" required={true}>
                  <div style={{ marginBottom: 10 }}>
                    <Radio.Group
                      onChange={onCustomerTypeChange}
                      value={customerType}>
                      <Radio value={CUSTOMER_TYPE.ALL}>全部客户</Radio>
                      <Radio value={CUSTOMER_TYPE.ADVANCE}>筛选客户</Radio>
                    </Radio.Group>
                  </div>
                  <Form.Item
                    hidden={customerType !== CUSTOMER_TYPE.ADVANCE}
                    name="customerFilter"
                    label=""
                    colon={false}
                    style={{ marginBottom: 10 }}
                    rules={[
                      {
                        required: false,
                        // required: customerType === CUSTOMER_TYPE.ADVANCE,
                        type: 'object',
                        message: '请选择客户',
                      },
                    ]}
                    >
                    <AdvanceCustomer onChange={clearCustomerResult} />
                  </Form.Item>
                  <Alert
                    style={{ display: 'inline-block' }}
                    message={
                      <div className={styles.resultBox}>
                        {customerType === CUSTOMER_TYPE.ALL ? (
                          <span>
                            <FileSearchOutlined />
                            查看
                            {Array.isArray(massAccount.value) &&
                            massAccount.value.length ? (
                              <span className={styles.sendAccount}>
                                <OpenEle
                                  openid={massAccount.value[0]}
                                  type="userName"
                                />
                                {massAccount.value.length > 1
                                  ? `等${massAccount.value.length}个账号`
                                  : ''}
                              </span>
                            ) : (
                              '[全部账号]'
                            )}
                            的客户数：
                          </span>
                        ) : (
                          <span>
                            <FileSearchOutlined />
                            预计送达人数：
                          </span>
                        )}
                        {customerResult.count === undefined ? (
                          <span
                            className={styles['look-action']}
                            onClick={onLookCustomer}>
                            查看
                          </span>
                        ) : (
                          <span>{customerResult.count}</span>
                        )}
                      </div>
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="消息内容"
                  name="msgContent"
                  rules={[
                    {
                      required: true,
                      validator: async (rule, value = {}) => {
                        const { text, media = [] } = value
                        const isEmptyValue =
                          isEmpty(value) || (!text && !media.length)
                        if (rule.required && isEmptyValue) {
                          throw new Error('请输入消息内容')
                        } else {
                          Promise.resolve()
                        }
                      },
                    },
                  ]}
                  initialValue={{}}>
                  <MassMsg />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="群发时间" required={true}>
                  <Radio.Group
                    onChange={onMassTimeChange}
                    value={massTime}
                    style={{ marginBottom: 10 }}>
                    <Radio value={MASS_TIME_VALS.IMMEDIATE}>立即发送</Radio>
                    <Radio value={MASS_TIME_VALS.TIMING}>定时发送</Radio>
                  </Radio.Group>
                  <Form.Item
                    label=""
                    name="timer"
                    colon={false}
                    hidden={massTime !== MASS_TIME_VALS.TIMING}
                    rules={[
                      {
                        required: massTime === MASS_TIME_VALS.TIMING,
                        message: '请选择定时发送时间',
                      },
                    ]}
                    style={{
                      marginBottom: 0,
                    }}>
                    <DatePicker
                      placeholder="请选择"
                      showTime={true}
                      format="YYYY-MM-DD HH:mm"
                      disabledDate={(current) =>
                        current.isBefore(moment(), 'day')
                      }
                    />
                  </Form.Item>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className={styles['add-page-footer']}>
          <Button onClick={onCancel} className={styles['cancel-btn']}>
            取消
          </Button>
          <Button
            type="primary"
            ghost
            onClick={form.submit}
            loading={addLoading || editLoading}>
            保存
          </Button>
        </div>
      </div>
    </PageContent>
  )
}
