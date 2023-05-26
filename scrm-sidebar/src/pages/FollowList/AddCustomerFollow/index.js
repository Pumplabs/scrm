import {
  useEffect,
  useMemo,
  useContext,
  useState,
  useRef,
  forwardRef,
} from 'react'
import {
  Form,
  TextArea,
  Tag,
  Card,
  Radio,
  Button,
  ActionSheet,
  Toast,
} from 'antd-mobile'
import moment from 'moment'
import { MobXProviderContext, observer } from 'mobx-react'
import {
  CloseOutline,
  CheckCircleOutline,
  AddOutline,
  MoreOutline,
  UploadOutline,
} from 'antd-mobile-icons'
import { toJS } from 'mobx'
import { isEmpty } from 'lodash'
import { useRequest } from 'ahooks'
import { useNavigate, useLocation } from 'react-router-dom'
import List from 'components/List'
import {
  UploadFormItem,
  convertAttachItemToMediaParams,
  RECORD_STATUS,
} from 'components/UploadFile'
import { TEXT_KEY_BY_VAL } from 'components/MsgSection/constants'
import OpenEle from 'components/OpenEle'
import MyDatePicker from 'components/MyDatePicker'
import { FOLLOW_TYPES } from 'src/pages/FollowList/constants'
import { useModalHook, useBack } from 'src/hooks'
import { encodeUrl, decodeUrl } from 'src/utils'
import { actionRequestHookOptions } from 'services/utils'
import clockUrl from 'assets/images/icon/clock-icon.svg'
import { AddCustomerFollow } from 'services/modules/follow'
import styles from './index.module.less'

export default observer(() => {
  const { openModal, closeModal, visibleMap, modalInfo } = useModalHook([
    'action',
  ])
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const audioStatusRef = useRef()
  const { ModifyStore } = useContext(MobXProviderContext)

  const currentPath = useMemo(() => {
    return `${pathname}${search}`
  }, [pathname, search])

  const urlParams = useMemo(() => decodeUrl(search), [search])
  const onBack = () => {
    ModifyStore.clearCustomerFollow()
    navigate(
      `/customerDetail?extCustomerId=${urlParams.extCustomerId}&staffId=${urlParams.staffId}`
    )
  }

  useBack({
    onBack,
  })

  const { run: runAddCustomerFollow } = useRequest(AddCustomerFollow, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '提交',
      successFn: () => {
        onBack()
      },
      onError: (e) => {},
    }),
  })

  const isEdit = useMemo(() => {
    return false
  }, [])

  useEffect(() => {
    document.title = `跟进-${urlParams.name}`
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const mentionUsers = useMemo(() => {
    const followData = toJS(ModifyStore.customerFollow)
    return followData.users || []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ModifyStore.customerFollow.users])

  const taskList = useMemo(() => {
    const followData = toJS(ModifyStore.customerFollow)
    return followData.taskList || []
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ModifyStore.customerFollow.taskList])

  useEffect(() => {
    const followData = toJS(ModifyStore.customerFollow)
    if (followData.init) {
      if (isEdit) {
        // 发请求
      } else if (!isEmpty(followData.temp)) {
        fillTempData(followData.temp, followData)
      }
    } else {
      // 回填表单
      form.setFieldsValue({
        info: followData.info,
        files: followData.files,
        remindTime: followData.remindTime,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ModifyStore.customerFollow.init])

  const fillTempData = (tempData = {}, followData = {}) => {
    Reflect.deleteProperty(ModifyStore.customerFollow, 'temp')
    let updateData = {}
    for (const attr in tempData) {
      const value = tempData[attr]
      const oldValue = followData[attr]
      if (attr === 'taskList') {
        const [taskData] = value
        const isExist = oldValue.some((item) => item.id === taskData.id)
        updateData[attr] = isExist
          ? oldValue.map((item) => {
              if (item.id === taskData.id) {
                return {
                  ...item,
                  ...taskData,
                }
              } else {
                return item
              }
            })
          : [...oldValue, taskData]
      }
    }
    ModifyStore.updateCustomerFollow(updateData)
  }

  const onAudioUploadChange = (status) => {
    audioStatusRef.current = status
  }

  const onMentionUser = () => {
    navigate(
      `/selectUser?${encodeUrl({
        mode: 'customerFollowmentionUser',
        backUrl: currentPath,
      })}`
    )
  }

  const onMentionUsersChange = (users = []) => {
    ModifyStore.updateCustomerFollow({
      users,
    })
  }

  const onActionTask = (item) => {
    openModal('action', item)
  }

  const onActionOk = (action) => {
    if (action.key === 'edit') {
      ModifyStore.updateFollowTask({
        name: modalInfo.data.name,
        users: [
          {
            id: modalInfo.data.id,
            isNew: modalInfo.data.isNew,
            extId: modalInfo.data.owner,
            name: modalInfo.data.owner,
          },
        ],
        finishAt: modalInfo.data.finishAt,
      })
      navigate(
        `/editCustomerTask/${modalInfo.data.id}?${encodeUrl({
          backUrl: currentPath,
        })}`
      )
    } else {
      ModifyStore.updateCustomerFollow({
        taskList: taskList.filter((ele) => ele.id !== modalInfo.data.id),
      })
    }
    closeModal()
  }

  const onAddTask = () => {
    navigate(
      `/addCustomerTask?${encodeUrl({
        backUrl: currentPath,
      })}`
    )
  }

  const onFollowOk = (vals) => {
    const { remindTime, files = [], info } = vals
    const remindMoment = remindTime ? moment(remindTime.toString()) : null
    const hasUploadingFile = files.some((item) => item.status === 'uploading')
    if (
      hasUploadingFile ||
      audioStatusRef.current === RECORD_STATUS.UPLOADING
    ) {
      Toast.show({
        content: '有文件正在上传中，请稍后再试...',
        icon: <UploadOutline />,
      })
      return
    }
    const taskIsOverdue = taskList.some((ele) => {
      return !moment(ele.finishAt).isAfter(moment(), 'minutes')
    })
    if (taskIsOverdue) {
      Toast.show({
        icon: 'fail',
        content: '任务的截止时间必须大于当前时间',
      })
      return
    }
    // 提醒时间是否过期
    const remindTimeIsGtCurrent = remindMoment
      ? remindMoment.isAfter(moment(), 'minutes')
      : true
    if (!remindTimeIsGtCurrent) {
      Toast.show({
        icon: 'fail',
        content: '提醒时间必须大于当前时间',
      })
      return
    }
    const params = {
      content: {
        media: convertAttachItemToMediaParams(files),
        text: [
          {
            content: info,
            type: TEXT_KEY_BY_VAL.TEXT,
          },
        ],
      },
      extCustomerStaffList: [
        {
          extCustomerId: urlParams.extCustomerId,
          extStaffId: urlParams.extStaffId,
        },
      ],
      // extCustomerIds: [urlParams.extCustomerId],
      followTaskList: taskList.map((ele) => {
        let data = {
          name: ele.name,
          owner: ele.owner,
          finishAt: ele.finishAt,
        }
        if (!ele.isNew) {
          data.id = ele.id
        }
        return data
      }),
      // "isTodo": true,
      remindAt: remindTime
        ? remindMoment.format('YYYY-MM-DD HH:mm') + ':00'
        : '',
      shareExtStaffIds: mentionUsers.map((ele) => ele.extId),
      type: FOLLOW_TYPES.CUSTOMER,
    }
    runAddCustomerFollow(params)
  }

  const actions = [
    {
      text: <span className={styles['edit-action']}>修改任务信息</span>,
      key: 'edit',
    },
    {
      text: <span className={styles['remove-action']}>删除</span>,
      key: 'delete',
    },
  ]

  return (
    <div className={styles['add-page']}>
      <ActionSheet
        visible={visibleMap.actionVisible}
        actions={actions}
        onAction={onActionOk}
        onClose={closeModal}
      />
      <Form
        form={form}
        mode="card"
        className={styles['follow-form']}
        onFinish={onFollowOk}
        onValuesChange={ModifyStore.updateCustomerFollow}
        footer={
          <Button
            style={{ width: '100%' }}
            color="primary"
            fill="solid"
            onClick={form.submit}>
            添加
          </Button>
        }>
        <Form.Item
          name="info"
          rules={[
            {
              required: true,
              message: '请填写跟进信息',
            },
          ]}>
          <TextArea
            placeholder="请填写跟进信息"
            rows={12}
            maxLength={600}
            showCount={true}
            autoSize
          />
        </Form.Item>
        <Form.Item name="files" valuePropName="fileList" noStyle={true}>
          <UploadFormItem
            showAudio={true}
            onAudioUploadChange={onAudioUploadChange}
            attachmentConfig={{
              showTrackMaterial: false,
            }}
          />
        </Form.Item>
        <MentionUsers
          dataSource={mentionUsers}
          onSelect={onMentionUser}
          onChange={onMentionUsersChange}
        />
        <TaskList
          taskList={taskList}
          onAdd={onAddTask}
          onAction={onActionTask}
        />
        <Form.Item name="remindTime" noStyle={true}>
          <RemindTimePicker />
        </Form.Item>
      </Form>
    </div>
  )
})
export const TaskList = ({ taskList = [], onAdd, onAction }) => {
  return (
    <div className={styles['task-section']}>
      <Card
        title={
          <>
            <CheckCircleOutline className={styles['task-title-icon']} />
            任务
          </>
        }
        headerClassName={styles['task-header']}
        extra={
          <span className={styles['task-title-extra']}>
            {taskList.length}
            <AddOutline className={styles['task-add-icon']} onClick={onAdd} />
          </span>
        }>
        {taskList.length
          ? taskList.map((taskItem) => (
              <TaskItem onAction={onAction} data={taskItem} key={taskItem.id} />
            ))
          : null}
      </Card>
    </div>
  )
}
export const MentionUsers = forwardRef((props, ref) => {
  const { dataSource = [], onSelect, onChange } = props
  const onRemove = (item) => {
    if (typeof onChange === 'function') {
      onChange(dataSource.filter((ele) => ele.extId !== item.extId))
    }
  }

  return (
    <div className={styles['mention-section']} ref={ref}>
      <List className={styles['mention-list']}>
        <List.Item
          className={styles['mention-list-item']}
          extra={dataSource.length}
          description="@一下同事马上可以成为协作人哦"
          onClick={onSelect}>
          <span className={styles['mention-icon']}>@</span>提醒同事
        </List.Item>
      </List>
      {dataSource.length ? (
        <div className={styles['tag-section']}>
          {dataSource.map((ele) => (
            <Tag
              color="primary"
              fill="outline"
              key={ele.id}
              className={styles['tag-ele']}>
              <OpenEle type="userName" openid={ele.name} />
              <CloseOutline
                className={styles['tag-close-icon']}
                onClick={() => {
                  onRemove(ele)
                }}
              />
            </Tag>
          ))}
        </div>
      ) : null}
    </div>
  )
})
export const RemindTimePicker = forwardRef((props, ref) => {
  const { value = null, onChange } = props
  const [visible, setVisible] = useState(false)
  const handleChange = (val) => {
    if (typeof onChange === 'function') {
      onChange(val)
    }
  }
  const onSelect = () => {
    setVisible(true)
  }

  return (
    <div className={styles['remind-section']} ref={ref}>
      <List>
        <MyDatePicker
          visible={visible}
          onClose={() => {
            setVisible(false)
          }}
          precision="minute"
          onConfirm={(val) => {
            handleChange(val)
          }}
          shouldSelectBeforeCurrent={false}
          shouldSelectCurrent={false}
        />
        <List.Item
          onClick={onSelect}
          extra={
            <span>
              {value
                ? moment(value.toString()).format('YYYY-MM-DD HH:mm')
                : '请选择'}
            </span>
          }>
          <img src={clockUrl} alt="" className={styles['remind-icon']} />
          跟进提醒
        </List.Item>
      </List>
    </div>
  )
})
const TaskItem = ({ onAction, data = {} }) => {
  const handleAction = () => {
    if (typeof onAction === 'function') {
      onAction(data)
    }
  }
  return (
    <div className={styles['task-item']}>
      <Radio className={styles['task-check-icon']} checked={false} />
      <div className={styles['task-item-content']}>
        <p className={styles['task-name']}>{data.name}</p>
        <Tag className={styles['user-tag']}>
          <OpenEle type="userName" openid={data.owner} />
        </Tag>
        <Tag className={styles['create-tag']}>
          {data.finishAt
            ? moment(data.finishAt).format('YYYYY/MM/DD HH:mm')
            : null}
        </Tag>
      </div>
      <MoreOutline
        className={styles['tark-action-icon']}
        onClick={handleAction}
      />
    </div>
  )
}
