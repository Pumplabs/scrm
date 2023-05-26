import { forwardRef, useContext, useMemo, useState, useEffect } from 'react'
import { Form, TextArea, Button, Toast } from 'antd-mobile'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import { observer, MobXProviderContext } from 'mobx-react'
import moment from 'moment'
import { toJS } from 'mobx'
import { isEmpty, uniqueId } from 'lodash'
import { useRequest } from 'ahooks'
import List from 'components/List'
import OpenEle from 'components/OpenEle'
import MyDatePicker, { formatDate } from 'components/MyDatePicker'
import { GetCustomerInfo } from 'services/modules/customer'
import { useBack } from 'src/hooks'
import { decodeUrl, encodeUrl } from 'src/utils'
import styles from './index.module.less'
import { ConsoleSqlOutlined } from '@ant-design/icons'

export const MODE_TYPES = {
  ADD_FOLLOW: 'addFollow',
  ADD_CUSTOMER_FOLLOW: 'addCustomerFollow',
  ADD_OPP_FOLLOWE: 'addOppFollow'
}
export default observer(() => {
  const { ModifyStore } = useContext(MobXProviderContext)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { search, pathname } = useLocation()
  const { id: taskId } = useParams()
  const { run: runGetTaskInfo, data: taskInfo = {} } = useRequest(
    GetCustomerInfo,
    {
      manual: true,
      onSuccess: (res) => {
        if (!isEmpty(res)) {
          form.setFieldsValue({
            name: res.info,
            users: [{
              extId: res.owner,
              name: res.owner,
              id: res.owner
            }],
            finishAt: res.deadline,
          })
        }
      },
    }
  )
  const currentPath = useMemo(() => {
    return `${pathname}${search}`
  }, [pathname, search])

  const { isEdit, isEditNew, isAdd } = useMemo(() => {
    const isEdit = pathname.startsWith('/editCustomerTask') || pathname.startsWith('/editOppFollowTask')
    return {
      isEdit,
      isEditNew: isEdit && taskId && taskId.startsWith('taskId'),
      isAdd: !taskId,
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  const { backUrl, mapName, fnName, mode, oppId } = useMemo(() => {
    const str = search ? search.slice(1) : ''
    const { backUrl = '/addFollow', mode = MODE_TYPES.ADD_CUSTOMER_FOLLOW, oppId } = (str ? decodeUrl(search) : {})
    let config = {
      mapName: 'customerFollow',
      fnName: 'updateCustomerFollow'
    }
    switch(mode) {
      case MODE_TYPES.ADD_FOLLOW:
        config.mapName = 'addFollowData'
        config.fnName = 'updateFollowData'
        break;
      case MODE_TYPES.ADD_OPP_FOLLOWE:
        config.mapName = 'oppFollowData'
        config.fnName = 'updateOppFollow'
        break;
      default:
        break;
    }
    return {
      backUrl,
      mode,
      oppId,
      ...config
    }
  }, [search])

  useEffect(() => {
    if (isEdit && ModifyStore.followTask.init && !isEditNew) {
      runGetTaskInfo({
        id: taskId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, ModifyStore.followTask.init, taskId, isEditNew])

  useEffect(() => {
    const followTask = toJS(ModifyStore.followTask)
    if (!followTask.init) {
      form.setFieldsValue({
        name: followTask.name,
        users: followTask.users,
        finishAt: followTask.finishAt
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ModifyStore.followTask.init])

  const onBack = () => {
    ModifyStore.clearFollowTask()
    navigate(backUrl)
  }

  useBack({
    onBack,
  })

  const onOk = (vals) => {
    const { finishAt, users, ...rest } = vals
    const deadlineMoment =  moment(finishAt.toString())
    if (!deadlineMoment.isAfter(moment(), 'minutes')) {
      Toast.show({
        icon: 'fail',
        content: '任务的截止时间必须大于当前时间',
      })
      return
    }
    const data = {
      ...rest,
      owner: users[0].name,
      isNew: isEditNew || isAdd,
      id: isEdit ? taskId : uniqueId('taskId'),
      finishAt:deadlineMoment.format('YYYY-MM-DD HH:mm') + ':00',
    }
    if (ModifyStore[mapName].init) {
      ModifyStore[fnName]({
        temp: {
          taskList: [data],
        },
      })
    } else {
      const preTaskList = ModifyStore[mapName].taskList
      ModifyStore[fnName]({
        taskList: isEdit || isEditNew ? preTaskList.map(ele => {
          return ele.id === taskId ? data : ele
        }) : [...preTaskList, data],
      })
    }
    onBack()
  }

  const onSelectUser = () => {
    if (mode === MODE_TYPES.ADD_OPP_FOLLOWE) {
      navigate(
        `/selectOppTaskUser/${oppId}?${encodeUrl({
          mode: 'oppFollow',
          backUrl: currentPath,
        })}`
      )
    } else {
      navigate(
        `/selectUser?${encodeUrl({
          mode: 'followTask',
          backUrl: currentPath,
        })}`
      )
    }
  }

  return (
    <div className={styles['add-task-page']}>
      <Form
        form={form}
        onFinish={onOk}
        mode="card"
        className={styles['task-form']}
        onValuesChange={ModifyStore.updateFollowTask}
        footer={
          <Button
            style={{ width: '100%' }}
            color="primary"
            fill="solid"
            onClick={form.submit}>
            {isEdit ? '修改': '创建'}
          </Button>
        }>
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: '请填写任务内容',
            },
          ]}>
          <TextArea maxLength={30} placeholder="请填写任务内容,30字以内" />
        </Form.Item>
        <Form.Item
          className={styles['owner-item']}
          name="users"
          rules={[
            {
              required: true,
              type: 'array',
              message: '请选择负责人',
            },
          ]}>
          <OwnerFormItem onSelect={onSelectUser} />
        </Form.Item>
        <Form.Item
          className={styles['deadine-item']}
          name="finishAt"
          rules={[
            {
              required: true,
              message: '请选择截止时间',
            },
          ]}>
          <DeadLineItem />
        </Form.Item>
      </Form>
    </div>
  )
})

const DeadLineItem = forwardRef((props, ref) => {
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
    <div ref={ref}>
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
          extra={
            <span>
              {value ? formatDate(value) : '请选择'}
              {/* {value ? moment(value.toString()).format('YYYY-MM-DD HH:mm') : '请选择'} */}
            </span>
          }
          onClick={onSelect}>
          截止时间
        </List.Item>
      </List>
    </div>
  )
})
const OwnerFormItem = forwardRef((props, ref) => {
  const { value = [], onSelect } = props
  return (
    <div ref={ref}>
      <List>
        <List.Item
          extra={
            value.length ? (
              <OpenEle type="userName" openid={value[0].name} />
            ) : (
              '请选择'
            )
          }
          onClick={onSelect}>
          负责人
        </List.Item>
      </List>
    </div>
  )
})
