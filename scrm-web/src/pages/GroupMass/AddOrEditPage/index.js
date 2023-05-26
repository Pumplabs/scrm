import { useState, useEffect } from 'react'
import { isEmpty } from 'lodash'
import {
  Button,
  Form,
  Alert,
  Row,
  Col,
  Radio,
  DatePicker,
  message,
  Modal,
  Input,
} from 'antd'
import { useNavigate } from 'react-router'
import { useRequest } from 'ahooks'
import moment from 'moment'
import { useParams } from 'react-router-dom'
import { PageContent } from 'layout'
import { getRequestError } from 'services/utils'
import {
  getMediaParams,
  getFillMedia,
  getMediaFileUrls,
} from 'components/WeChatMsgEditor/utils'
import {
  GetGroupOwnerList,
  AddGroupMass,
  GetGroupMassDetail,
  EditGroupMass,
} from 'services/modules/groupMass'
import GroupOwnerSelect from 'components/GroupOwnerSelect'
import MassMsg from './MassMsg'
import { handleTime } from 'utils/times'
import { SUCCESS_CODE } from 'utils/constants'
import { actionRequestHookOptions } from 'services/utils'
import styles from './index.module.less'

const MASS_TIME_VALS = {
  // 立即发送
  IMMEDIATE: 1,
  // 定时发送
  TIMING: 2,
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
const refillFormByData = (data) => {
  return {
    name: data.name,
    timer: data.sendTime ? moment(data.sendTime) : undefined,
    userIds: data.hasAllStaff ? undefined : data.extStaffIds,
  }
}

export default () => {
  const [massTime, setMassTime] = useState(MASS_TIME_VALS.IMMEDIATE)
  // const [massAccount, setMassAccount] = useState([])
  const [form] = Form.useForm()
  const { id: massId } = useParams()
  const navigate = useNavigate()

  const { run: runAddGroupMass, loading: addLoading } = useRequest(
    AddGroupMass,
    {
      manual: true,
      ...actionRequestHookOptions({
        actionName: '创建',
        successFn: () => {
          backToList()
        }
      })
    }
  )
  const { run: runGroupMass } = useRequest(GetGroupMassDetail, {
    manual: true,
    onSuccess: async (data) => {
      if (isEmpty(data)) {
        message.error('没有相关数据哦~')
        backToList()
        return
      }
      const fileUrls = await getMediaFileUrls(data.msg.media)
      setMassTime(
        data.hasSchedule ? MASS_TIME_VALS.TIMING : MASS_TIME_VALS.IMMEDIATE
      )
      const formData = {
        ...refillFormByData(data),
        msgContent: {
          text:
            Array.isArray(data.msg.text) && data.msg.text.length
              ? data.msg.text[0].content
              : '',
          media: getFillMedia(data.msg.media, fileUrls),
        },
      }
      form.setFieldsValue(formData)
    },
    onError: (e) => {
      getRequestError(e, '查询数据失败')
      backToList()
    },
  })
  const { run: runEditGroupMass, loading: editLoading } = useRequest(
    EditGroupMass,
    {
      manual: true,
      onSuccess: (res) => {
        if (res.code === SUCCESS_CODE) {
          message.success(`编辑成功`)
          backToList()
        } else {
          message.error(res.msg ? res.msg : `编辑失败`)
        }
      },
      onError: (e) => getRequestError(e, '编辑失败'),
    }
  )

  useEffect(() => {
    if (massId) {
      runGroupMass({
        id: massId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [massId])

  const onMassTimeChange = (e) => {
    const val = e.target.value
    setMassTime(val)
  }

  const hasModifyData = () => {
    // TODO:判断数据是否发生改变
    return false
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

  // 表单参数
  const handleFromParams = (vals = {}) => {
    const { name, timer, msgContent, userIds = [] } = vals
    // 是否定时
    const isScheduleTime = massTime === MASS_TIME_VALS.TIMING
    let params = {
      name,
      hasSchedule: Number(isScheduleTime),
      extStaffIds: userIds,
      hasAllStaff: userIds.length === 0 ? 1 : 0,
      msg: handleMassContent(msgContent),
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
      runEditGroupMass({
        ...params,
        id: massId,
      })
    } else {
      runAddGroupMass(params)
    }
  }

  const backToList = () => {
    navigate(`/customerGroupMass`)
  }

  const onCancel = () => {
    showGiveUpTip(backToList)
  }

  const confirmLoading = addLoading || editLoading
  return (
    <PageContent showBack={true} backUrl={`/customerGroupMass`}>
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
                  required={true}
                  extra=""
                  name="name">
                  <Input
                    placeholder="请输入不超过20个字符"
                    maxLength={20}
                    style={{ width: '50%' }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item label="选择群主" required={true} name="userIds">
                  <GroupOwnerSelect
                    style={{ width: '50%' }}
                    placeholder="全部"
                    allowClear={true}
                    request={GetGroupOwnerList}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label="群发内容"
                  name="msgContent"
                  rules={[
                    {
                      required: true,
                      validator: async (rule, value = {}) => {
                        const { text, media = [] } = value
                        const isEmptyValue =
                          isEmpty(value) || (!text && !media.length)
                        if (rule.required && isEmptyValue) {
                          throw new Error('请输入群发内容')
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
          <Row span={24}>
            <Col span={4}> </Col>
            <Col span={20}>
            </Col>
          </Row>
        </div>
        <div className={styles['add-page-footer']}>
          <Button onClick={onCancel} className={styles['cancel-btn']}>
            取消
          </Button>
          <Button
            type="primary"
            ghost
            onClick={form.submit}
            loading={confirmLoading}>
            保存
          </Button>
        </div>
      </div>
    </PageContent>
  )
}
