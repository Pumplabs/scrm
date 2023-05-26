import { useMemo, useEffect, useContext, forwardRef, useRef } from 'react'
import { Button, NavBar, Toast, TextArea, Form, ActionSheet } from 'antd-mobile'
import { UploadOutline } from 'antd-mobile-icons'
import { get, isEmpty } from 'lodash'
import { useRequest } from 'ahooks'
import { toJS } from 'mobx'
import moment from 'moment'
import { MobXProviderContext, observer } from 'mobx-react'
import { useLocation, useParams, useNavigate } from 'react-router-dom'
import { MODE_TYPES } from 'src/pages/FollowList/AddCustomerFollow/AddTask'
import PageContent from 'components/PageContent'
import List from 'components/List'
import {
  UploadFormItem,
  convertAttachItemToMediaParams,
  convertMediaToAttachFiles,
  RECORD_STATUS,
} from 'components/UploadFile'
import {
  MentionUsers,
  TaskList,
  RemindTimePicker,
} from 'src/pages/FollowList/AddCustomerFollow'
import { FOLLOW_TYPES } from '../constants'
import { useBack, useModalHook } from 'src/hooks'
import { actionRequestHookOptions } from 'services/utils'
import {
  AddCustomerFollow,
  GetFollowDetail,
  EditFollow,
} from 'services/modules/follow'
import { TEXT_KEY_BY_VAL } from 'components/MsgSection/constants'
import { decodeUrl, createUrlSearchParams, encodeUrl } from 'src/utils/paths'
import styles from './index.module.less'

const getMsgText = (data = {}) => {
  if (!data) {
    return ''
  }
  return Array.isArray(data.text) && data.text.length
    ? data.text[0].content
    : ''
}

/**
 * @param urlParams 界面url参数
 * * @param {String} extCustomerId 客戶extId
 * * @param {Boolean} isDetail 是否从详情界面过来
 * * @param {String} staffId 员工id
 */
export default observer(() => {
  const navigate = useNavigate()
  const { ModifyStore } = useContext(MobXProviderContext)
  const audioRef = useRef('')
  const { pathname, search } = useLocation()
  const { id } = useParams()
  const [form] = Form.useForm()
  const urlParams = useMemo(() => {
    return search ? decodeUrl(search.slice(1)) : {}
  }, [search])
  const { openModal, closeModal, visibleMap, modalInfo } = useModalHook([
    'action',
  ])

  const { isAddPage, backUrl, shouldSelectedCustomer } = useMemo(() => {
    const customerDetailUrl = `/customerDetail?${createUrlSearchParams(
      urlParams
    )}`
    const customerFollowDetailUrl = `/customerfollowDetail/${id}?${encodeUrl(
      urlParams
    )}`
    if (pathname === '/addCustomerFollow') {
      return {
        isAddPage: true,
        shouldSelectedCustomer: false,
        backUrl: customerDetailUrl,
      }
    } else if (pathname.startsWith('/editCustomerFollow')) {
      return {
        isAddPage: false,
        shouldSelectedCustomer: false,
        backUrl: urlParams.isDetail
          ? customerFollowDetailUrl
          : customerDetailUrl,
      }
    } else if (pathname.startsWith('/editFollow')) {
      return {
        isAddPage: false,
        shouldSelectedCustomer: false,
        backUrl: urlParams.isDetail ? `/followDetail/${id}` : `/followList`,
      }
    } else if (pathname === '/addFollow') {
      return {
        isAddPage: true,
        shouldSelectedCustomer: true,
        backUrl: `/followList`,
      }
    } else if (pathname.startsWith('/editNoticeFollow')) {
      return {
        isAddPage: false,
        shouldSelectedCustomer: false,
        backUrl: `/noticefollowDetail/${id}`,
      }
    }
  }, [pathname, urlParams, id])

  const { onDynamicBack } = useBack({
    backUrl: backUrl,
    isDynamic: false,
  })

  const { selectedStaff, selectedCustomers, followText, taskList } =
    useMemo(() => {
      const {
        users = [],
        customers = [],
        followText = '',
        taskList = [],
      } = toJS(ModifyStore.addFollowData)
      return {
        selectedStaff: users,
        followText,
        taskList,
        selectedCustomers: customers,
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
      ModifyStore.addFollowData.users,
      ModifyStore.addFollowData.customers,
      ModifyStore.addFollowData.followText,
      ModifyStore.addFollowData.taskList,
    ])

  const onBackList = () => {
    ModifyStore.clearFollowData()
    onDynamicBack(backUrl)
  }

  const { run: runGetFollowDetail, data: followData = {} } = useRequest(
    GetFollowDetail,
    {
      manual: true,
      onSuccess: async (res) => {
        if (ModifyStore.addFollowData.init) {
          const staffIds = Array.isArray(res.shareExtStaffIds)
            ? res.shareExtStaffIds
            : []
          const arr = staffIds.map((item) => ({
            extId: item,
            name: item,
          }))
          const files = await convertMediaToAttachFiles(
            get(res, 'content.media')
          )
          ModifyStore.updateFollowData({
            followText: getMsgText(res.content),
            files,
            followId: id,
            users: arr,
          })
        }
      },
    }
  )
  const { run: runEditFollow } = useRequest(EditFollow, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '提交',
      successFn: () => {
        onBackList()
      },
    }),
  })
  const { run: runAddCustomerFollow } = useRequest(AddCustomerFollow, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '提交',
      successFn: () => {
        onBackList()
      },
    }),
  })

  useEffect(() => {
    const followData = toJS(ModifyStore.addFollowData)
    if (id && followData.init) {
      runGetFollowDetail({
        id,
      })
    }
    if (!id && !followData.init) {
      form.setFieldsValue({
        customers: followData.customers,
        followText: followData.followText,
        files: followData.files,
        remindTime: followData.remindTime,
      })
    }
    if (followData.init && !id && !isEmpty(followData.temp)) {
      fillTempData(followData.temp, followData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, ModifyStore.addFollowData.init])

  const fillTempData = (tempData = {}, followData = {}) => {
    Reflect.deleteProperty(ModifyStore.addFollowData, 'temp')
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
    ModifyStore.updateFollowData(updateData)
  }

  const currentPath = useMemo(() => {
    return `${pathname}${search ? '?' + search : ''}`
  }, [pathname, search])

  const onSelectedCustomer = () => {
    ModifyStore.updateFollowData('followId', id)
    navigate(
      `/selectCustomer?${encodeUrl({
        backUrl: currentPath,
      })}`
    )
  }

  const onSelectStaff = () => {
    ModifyStore.updateFollowData('followId', id)
    navigate(
      `/selectUser?${encodeUrl({
        mode: 'follow',
        backUrl: currentPath,
      })}`
    )
  }

  const onAudioUploadChange = (status) => {
    audioRef.current = status
  }

  const onMentionUsersChange = (users = []) => {
    ModifyStore.updateFollowData({
      users,
    })
  }

  const onSave = (vals) => {
    const { followText, remindTime, customers, files } = vals
    const hasUploadingFile = files.some((item) => item.status === 'uploading')
    const remindMoment = remindTime ? moment(remindTime.toString()) : null
    if (hasUploadingFile && audioRef.current === RECORD_STATUS.UPLOADING) {
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
    let params = {
      content: {
        media: convertAttachItemToMediaParams(files),
        text: [
          {
            content: followText,
            type: TEXT_KEY_BY_VAL.TEXT,
          },
        ],
      },
      type: FOLLOW_TYPES.CUSTOMER,
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
      remindAt: remindTime
        ? remindMoment.format('YYYY-MM-DD HH:mm') + ':00'
        : '',
      shareExtStaffIds: selectedStaff.map((item) => item.extId),
    }
    if (isAddPage) {
      params = {
        ...params,
        extCustomerStaffList: customers.map((ele) => ({
          extCustomerId: ele.extId,
          extStaffId: ele.extCreatorId,
        })),
      }
    } else {
      params = {
        ...params,
        extCustomerStaffList: followData.extCustomerStaffList,
        id,
      }
    }
    if (isAddPage) {
      runAddCustomerFollow(params)
    } else {
      runEditFollow(params)
    }
  }

  const onAddTask = () => {
    navigate(
      `/addCustomerTask?${encodeUrl({
        backUrl: currentPath,
        mode: MODE_TYPES.ADD_FOLLOW,
      })}`
    )
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
          mode: MODE_TYPES.ADD_FOLLOW,
        })}`
      )
    } else {
      ModifyStore.updateCustomerFollow({
        taskList: taskList.filter((ele) => ele.id !== modalInfo.data.id),
      })
    }
    closeModal()
  }
  const shouldSubmit =
    followText.length > 0 &&
    (shouldSelectedCustomer ? selectedCustomers.length > 0 : true)
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
    <PageContent
      header={
        <div className={styles['page-header']}>
          <NavBar
            right={
              <Button
                onClick={form.submit}
                color="primary"
                fill="solid"
                disabled={!shouldSubmit}
                size="small">
                提交
              </Button>
            }
            onBack={onBackList}></NavBar>
        </div>
      }>
      <ActionSheet
        visible={visibleMap.actionVisible}
        actions={actions}
        onAction={onActionOk}
        onClose={closeModal}
      />
      <div className={styles['add-follow-page']}>
        <Form
          className={styles['follow-form']}
          form={form}
          onValuesChange={ModifyStore.updateFollowData}
          initialValues={{
            customers: [],
            files: [],
          }}
          onFinish={onSave}>
          {shouldSelectedCustomer ? (
            <Form.Item
              noStyle={true}
              name="customers"
              rules={[
                {
                  required: true,
                  type: 'arrray',
                  message: '请选择客户',
                },
              ]}>
              <SelectCustomer onSelect={onSelectedCustomer} />
            </Form.Item>
          ) : null}
          <Form.Item
            name="followText"
            rules={[
              {
                required: true,
                message: '请输入跟进内容',
              },
            ]}>
            <TextArea
              placeholder="跟进内容...,不超过600个字符"
              rows={12}
              maxLength={600}
              showCount={true}
              autoSize
            />
          </Form.Item>
          <Form.Item name="files" valuePropName="fileList" noStyle={true}>
            <UploadFormItem
              attachmentConfig={{
                showTrackMaterial: false,
              }}
              showAudio={true}
              onAudioUploadChange={onAudioUploadChange}
            />
          </Form.Item>
          <MentionUsers
            dataSource={selectedStaff}
            onSelect={onSelectStaff}
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
    </PageContent>
  )
})

const SelectCustomer = forwardRef(({ value, onSelect }, ref) => {
  const customers = useMemo(() => {
    return Array.isArray(value) ? value : []
  }, [value])
  const total = customers.length
  const maxLen = 6

  const customerText = useMemo(() => {
    const text = customers
      .map((item) => `${item.name}@${item.corpName || '微信'}`)
      .join()
    const str = text.substr(0, maxLen)
    return text.length > maxLen ? `${str}...等${total}位客户` : str
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customers])

  return (
    <div ref={ref}>
      <List className={styles['select-customer-section']} size="large">
        <List.Item
          onClick={onSelect}
          extra={
            <p className={styles['extra-text']}>
              {total ? customerText : '请选择'}
            </p>
          }>
          选择客户
        </List.Item>
      </List>
    </div>
  )
})
