import {
  forwardRef,
  useMemo,
  useEffect,
  useRef,
  useContext,
  useState,
} from 'react'
import {
  Form,
  Button,
  Input,
  TextArea,
  Tag,
  Toast,
  DotLoading,
} from 'antd-mobile'
import { RightOutline, CloseCircleFill, CloseOutline } from 'antd-mobile-icons'
import { get, isEmpty } from 'lodash'
import { useRequest } from 'ahooks'
import { toJS } from 'mobx'
import moment from 'moment'
import { decode } from 'js-base64'
import { MobXProviderContext, observer } from 'mobx-react'
import { useNavigate, useLocation, useParams } from 'react-router-dom'
import OpenEle from 'components/OpenEle'
import CustomerText from 'components/CustomerText'
import MyDatePicker, { formatDate } from 'components/MyDatePicker'
import ChooseGroup from './components/ChooseGroup'
import ChoosePriority from './components/ChoosePriority'
import ChooseStage from './components/ChooseStage'
import ChooseFailReason from './components/ChooseFailReason'
import { MODE_TYPES } from 'pages/SelectPages/SelectedCustomer'
import { useModalHook, useBack } from 'src/hooks'
import { actionRequestHookOptions } from 'services/utils'
import {
  AddOpportunity,
  GetOppDetail,
  EditOpp,
} from 'services/modules/opportunity'
import { encodeUrl } from 'src/utils'
import { PRIORITY_OPTIONS } from '../constants'
import styles from './index.module.less'

export default observer(() => {
  const { ModifyStore, UserStore } = useContext(MobXProviderContext)
  const { id: oppParId } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const toastRef = useRef()
  const { pathname, search } = useLocation()
  const [shouldShowReason, setShouldShowReason] = useState(false)
  const { openModal, closeModal, visibleMap, modalInfo } = useModalHook([
    'choosePriority',
    'chooseGroup',
    'chooseStage',
    'chooseDate',
    'chooseReason',
  ])
  const { run: runAddOpportunity, loading: addLoading } = useRequest(
    AddOpportunity,
    {
      manual: true,
      onBefore: () => {
        toastRef.current = Toast.show({
          icon: 'loading',
        })
      },
      onFinally: () => {
        if (toastRef.current) {
          toastRef.current.close()
          toastRef.current = null
        }
      },
      ...actionRequestHookOptions({
        actionName: '操作',
        successFn: () => {
          onBack()
        },
      }),
    }
  )
  const { run: runEditOpp } = useRequest(EditOpp, {
    manual: true,
    onBefore: () => {
      toastRef.current = Toast.show({
        icon: 'loading',
      })
    },
    onFinally: () => {
      if (toastRef.current) {
        toastRef.current.close()
        toastRef.current = null
      }
    },
    ...actionRequestHookOptions({
      actionName: '操作',
      successFn: () => {
        onBack()
      },
    }),
  })
  const {
    run: runGetOppDetail,
    data: oppData = {},
    loading: oppLoading,
  } = useRequest(GetOppDetail, {
    manual: true,
    onSuccess: (data) => {
      if (ModifyStore.oppAddData.init) {
        const partners = Array.isArray(data.cooperatorList)
          ? data.cooperatorList.map((ele) => ({
              extId: ele.cooperatorId,
              name: ele.cooperatorId,
            }))
          : []
        const priorityItem = PRIORITY_OPTIONS.find(
          (ele) => `${ele.value}` === `${data.priority}`
        )
        let storeData = {
          name: data.name,
          // 负责人
          users: [data.ownerStaff],
          // 客户
          customer: [
            {
              ...data.customer,
              creatorStaff: {
                extId: data.owner,
              },
            },
          ],
          // 协作人
          partners: partners,
          expectMoney: data.expectMoney,
          date: data.expectDealDate ? data.expectDealDate : '',
          desc: data.desp,
          priority: data.priority,
          priorityName: priorityItem ? priorityItem.label : '',
          groupId: data.groupId,
          groupName: data.groupName,
          stageId: data.stageId,
          stageName: data.stage ? data.stage.name : '',
          failId: data.failReasonId,
          failName: data.failReasonCN,
          dealChance: data.dealChance,
        }
        ModifyStore.updateOppAddData(storeData)
      }
    },
  })

  const currentPath = useMemo(() => {
    return `${pathname}${search}`
  }, [pathname, search])

  const oppId = useMemo(() => oppParId ? decode(oppParId): '', [oppParId])
  const isEdit = pathname.startsWith('/editOpp')

  useEffect(() => {
    if (isEdit && oppId) {
      runGetOppDetail({
        id: oppId,
      })
    }
    return () => {
      if (toastRef.current) {
        toastRef.current.close()
        toastRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onBack = () => {
    ModifyStore.clearOppAddData()
    let url = '/opportunity'
    if (isEdit && oppParId) {
      url = `/opportunity/${oppParId}`
    }
    // 返回新增界面
    navigate(url)
  }

  useBack({
    onBack,
  })

  useEffect(() => {
    const data = toJS(ModifyStore.oppAddData)
    if (!data.init) {
      const ownerId = data.users[0] ? data.users[0].extId : ''
      const customerStaffId = data.customer[0]
        ? get(data.customer[0], 'creatorStaff.extId')
        : ''
      let formVals = {
        name: data.name,
        users: data.users,
        customer: data.customer,
        stageId: data.stageId,
        // stageName: data.stageName,
        groupId: data.groupId,
        // groupName: data.groupName,
        partners: data.partners,
        priority: data.priority,
        // priorityName: data.priorityName,
        expectMoney: data.expectMoney,
        date: data.date,
        desc: data.desc,
        failId: data.failId,
        dealChance: data.dealChance,
      }
      if (ownerId && ownerId !== customerStaffId) {
        formVals.customer = []
        ModifyStore.oppAddData.customer = []
      }
      form.setFieldsValue(formVals)
      setShouldShowReason(data.stageName === '输单')
    } else {
      if (!isEdit) {
        const todayStr = moment().format('YYYY-MM-DD')
        let formVals = {
          date: todayStr,
          dealChance: 1,
        }
        ModifyStore.oppAddData.date = todayStr
        form.setFieldsValue(formVals)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ModifyStore.oppAddData.init])

  useEffect(() => {
    const userData = toJS(UserStore.userData)
    if (userData.extId && !userData.isAdmin) {
      const curStaff = [
        {
          extId: userData.extId,
          name: userData.name,
        },
      ]
      form.setFieldsValue({
        users: curStaff,
      })
      ModifyStore.oppAddData.users = curStaff
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserStore.userData.extId])

  const onSelectPriority = (value) => {
    openModal('choosePriority', {
      value,
    })
  }
  const onSelectGroup = (value) => {
    openModal('chooseGroup', {
      value,
    })
  }
  const onSelectStage = (val) => {
    if (!form.getFieldValue('groupId')) {
      Toast.show({
        content: '请选择分组',
      })
      return
    }
    openModal('chooseStage', {
      value: val,
      groupId: form.getFieldValue('groupId'),
    })
  }

  const onSelectOwner = () => {
    navigate(
      `/selectUser?${encodeUrl({
        mode: 'oppOwner',
        backUrl: currentPath,
      })}`
    )
    // partners
  }
  const onSelectPartner = () => {
    navigate(
      `/selectUser?${encodeUrl({
        mode: 'oppPartner',
        backUrl: currentPath,
      })}`
    )
  }
  const onSelectCustomer = () => {
    if (isEmpty(form.getFieldValue('users'))) {
      Toast.show({
        content: '请先选择负责人',
      })
      return
    }
    navigate(
      `/selectCustomer?${encodeUrl({
        backUrl: currentPath,
        mode: MODE_TYPES.ADD_OPP,
      })}`
    )
  }

  const onSelectDate = () => {
    openModal('chooseDate')
  }
  const onSelectReason = () => {
    openModal('chooseReason')
  }

  const onSelectPriorityOk = (val, item = {}) => {
    closeModal()
    form.setFieldsValue({
      priority: val,
    })
    ModifyStore.updateOppAddData({
      priority: val,
      priorityName: item.label,
    })
  }
  const onSelectGroupOk = (val, item = {}) => {
    closeModal()
    let updateData = {
      groupId: val,
      groupName: item.name,
    }
    let updateFormData = {
      groupId: val,
    }
    const oldGroupId = ModifyStore.oppAddData.groupId
    if (oldGroupId && oldGroupId !== val) {
      updateFormData = {
        ...updateFormData,
        stageId: '',
        failId: '',
      }
      updateData = {
        ...updateData,
        stageId: '',
        stageName: '',
        failId: '',
        failName: '',
      }
      setShouldShowReason(false)
    }
    form.setFieldsValue(updateFormData)
    ModifyStore.updateOppAddData(updateData)
  }

  const onSelectStageOk = (val, item = {}) => {
    // setShouldShowReason
    const isLoss = item && item.isSystem && item.name === '输单'
    // 判断是否为输单
    setShouldShowReason(isLoss)
    closeModal()
    form.setFieldsValue({
      stageId: val,
    })
    ModifyStore.updateOppAddData({
      stageId: val,
      stageName: item.name,
      failId: '',
      failName: '',
    })
  }
  const onSelectReasonOk = (_, item = {}) => {
    closeModal()
    form.setFieldsValue({
      failId: item,
    })
    ModifyStore.updateOppAddData({
      failName: item.name,
    })
  }

  const onValuesChange = (vals) => {
    let data = {
      ...vals,
    }
    let formData = {}
    const [key, val] = Object.entries(vals)[0]
    switch (key) {
      case 'users':
        // 负责人改变了，客户必须要清空
        if (!isEmpty(form.getFieldValue('customer'))) {
          formData = {
            customer: [],
          }
          data = {
            ...data,
            customer: [],
          }
        }
        break
      case 'groupId':
        // 如果清空分组
        if (!val) {
          formData = {
            stageId: '',
            failId: '',
          }
          data = {
            ...data,
            stageId: '',
            stageName: '',
            failId: '',
            failName: '',
          }
          setShouldShowReason(false)
        }
        break
      case 'stageId':
        if (!val) {
          formData = {
            failId: '',
          }
          data = {
            ...data,
            stageId: '',
            stageName: '',
            failId: '',
            failName: '',
          }
          setShouldShowReason(false)
        }
        break
      default:
        break
    }
    if (!isEmpty(formData)) {
      form.setFieldsValue(formData)
    }
    ModifyStore.updateOppAddData(data)
  }
  const onDateOk = (val) => {
    const str = formatDate(val)
    form.setFieldsValue({
      date: str,
    })
    ModifyStore.updateOppAddData({
      date: str,
    })
  }

  const onSubmit = (vals) => {
    const partners =
      isEdit && Array.isArray(oppData.cooperatorList)
        ? oppData.cooperatorList
        : []
    const params = {
      customerExtId: vals.customer[0].extId,
      dealChance: vals.dealChance,
      desp: vals.desc,
      expectDealDate: vals.date
        ? `${vals.date} 23:59:59`
        : '',
      expectMoney: vals.expectMoney,
      failReasonId: shouldShowReason ? vals.failId : '',
      groupId: vals.groupId,
      name: vals.name,
      opportunityCooperatorList: vals.partners.map((ele) => {
        const oldItem = partners.length
          ? partners.find((item) => item.cooperatorId === ele.extId)
          : null
        let data = {
          canUpdate: true,
          cooperatorId: ele.extId,
        }
        if (oldItem) {
          data.id = oldItem.id
          data.canUpdate = oldItem.canUpdate
        }
        return data
      }),
      owner: vals.users[0].extId,
      priority: vals.priority,
      stageId: vals.stageId,
    }
    if (isEdit) {
      params.id = oppId
      runEditOpp(params)
    } else {
      runAddOpportunity(params)
    }
  }
  const onClearUserPicker = ({ onChange }) => {
    onChange([])
  }

  const { isAdmin, isOwner } = useMemo(() => {
    // const partners = Array.isArray(oppData.cooperatorList)
    //   ? oppData.cooperatorList
    //   : []
    const userData = toJS(UserStore.userData)
    const owner = oppData.owner
    const userExtId = userData.extId
    const isAdmin = userData.isAdmin
    if (userExtId) {
      return {
        isAdmin,
        isOwner: owner === userExtId,
      }
    } else {
      return {
        isAdmin: false,
        isOwner: false,
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UserStore.userData, oppData.owner])
  const storeData = ModifyStore.oppAddData
  if (oppLoading) {
    return (
      <div className={styles['loading-page']}>
        <DotLoading color="currentColor" />
        <span>界面加载中...</span>
      </div>
    )
  }
  return (
    <>
      <ChoosePriority
        visible={visibleMap.choosePriorityVisible}
        data={modalInfo.data}
        onOk={onSelectPriorityOk}
        onCancel={closeModal}
      />
      <ChooseGroup
        visible={visibleMap.chooseGroupVisible}
        data={modalInfo.data}
        onOk={onSelectGroupOk}
        onCancel={closeModal}
      />
      <ChooseStage
        visible={visibleMap.chooseStageVisible}
        data={modalInfo.data}
        onOk={onSelectStageOk}
        onCancel={closeModal}
      />
      <ChooseFailReason
        visible={visibleMap.chooseReasonVisible}
        data={modalInfo.data}
        onOk={onSelectReasonOk}
        onCancel={closeModal}
      />
      <MyDatePicker
        value={
          storeData.date
            ? new Date(moment(`${storeData.date} 00:00:00`).valueOf())
            : null
        }
        visible={visibleMap.chooseDateVisible}
        onClose={closeModal}
        precision="day"
        onConfirm={onDateOk}
        shouldSelectBeforeCurrent={false}
        shouldSelectCurrent={true}
      />
      <Form
        className={styles['add-opp-form']}
        form={form}
        onValuesChange={onValuesChange}
        onFinish={onSubmit}
        footer={
          <Button
            block
            type="submit"
            color="primary"
            size="large"
            disabled={addLoading}>
            提交
          </Button>
        }>
        <Form.Item
          name="name"
          label="商机名称"
          rules={[{ required: true }]}
          required={false}>
          <Input placeholder="请填写商机名称" maxLength={20} />
        </Form.Item>
        <Form.Item
          name="users"
          label="负责人"
          rules={[{ required: true }]}
          required={false}>
          {isAdmin ? (
            <SelectPicker
              placeholder="请选择负责人"
              onSelect={onSelectOwner}
              onClear={onClearUserPicker}
              renderContent={(item) =>
                Array.isArray(item) && item.length
                  ? item.map((ele) => (
                      <OpenEle
                        type="userName"
                        openid={ele.extId}
                        key={ele.extId}
                      />
                    ))
                  : null
              }
            />
          ) : (
            <StaffItem />
          )}
        </Form.Item>
        <Form.Item
          name="customer"
          label="客户"
          required={false}
          rules={[{ required: true }]}>
          <SelectPicker
            placeholder="请选择客户"
            onSelect={onSelectCustomer}
            onClear={onClearUserPicker}
            renderContent={(item) =>
              Array.isArray(item) && item.length ? (
                <CustomerText data={item[0]} />
              ) : null
            }
          />
        </Form.Item>
        <Form.Item
          name="groupId"
          label="商机分组"
          required={false}
          rules={[{ required: true }]}>
          <SelectPicker
            placeholder="请选择商机分组"
            disabled={isEdit}
            onSelect={onSelectGroup}
            renderContent={(item) => (item ? storeData.groupName : '')}
          />
        </Form.Item>
        <Form.Item
          name="stageId"
          label="商机阶段"
          required={false}
          rules={[{ required: true }]}>
          <SelectPicker
            placeholder="请选择商机阶段"
            onSelect={onSelectStage}
            renderContent={(item) => (item ? storeData.stageName : '')}
          />
        </Form.Item>
        {shouldShowReason ? (
          <Form.Item
            name="failId"
            label="失败原因"
            required={false}
            rules={[{ required: true }]}>
            <SelectPicker
              placeholder="请选择失败原因"
              onSelect={onSelectReason}
              renderContent={(item) => (item ? storeData.failName : '')}
            />
          </Form.Item>
        ) : null}
        <Form.Item name="partners" label="协作人">
          <SelectPicker
            placeholder="请选择协作人"
            onSelect={onSelectPartner}
            disabled={isEdit ? !isOwner && !isAdmin : false}
            onClear={onClearUserPicker}
            renderContent={(arr, { onChange }) =>
              Array.isArray(arr) && arr.length
                ? arr.map((ele) => (
                    <Tag
                      key={ele.extId}
                      color="primary"
                      fill="outline"
                      className={styles['user-tag']}>
                      <OpenEle
                        type="userName"
                        openid={ele.extId}
                        key={ele.extId}
                      />
                      {isOwner || isAdmin ? (
                        <CloseOutline
                          onClick={(e) => {
                            onChange(
                              arr.filter((item) => item.extId !== ele.extId)
                            )
                            e.stopPropagation()
                          }}
                        />
                      ) : null}
                    </Tag>
                  ))
                : null
            }
          />
        </Form.Item>
        <Form.Item name="priority" label="优先级">
          <SelectPicker
            placeholder="请选择优先级"
            onSelect={onSelectPriority}
            renderContent={(item) => (item ? storeData.priorityName : '')}
          />
        </Form.Item>
        <Form.Item name="expectMoney" label="预计金额(元)">
          <Input
            type="number"
            placeholder="请填写预计金额"
            min={0}
            max={Number.MAX_SAFE_INTEGER}
          />
        </Form.Item>
        <Form.Item name="dealChance" label="成单概率(%)">
          <Input type="number" placeholder="请填写0-100" min={0} max={100} />
        </Form.Item>
        <Form.Item name="date" label="预计成交日期">
          <SelectPicker
            placeholder="请选择预计成交日期"
            onSelect={onSelectDate}
            renderContent={(item) => item}
          />
        </Form.Item>
        <Form.Item name="desc" label="商机描述">
          <TextArea
            placeholder="请填写商机描述"
            rows={8}
            maxLength={200}
            showCount={true}
            autoSize
          />
        </Form.Item>
      </Form>
    </>
  )
})

const StaffItem = forwardRef(({ value = [] }, ref) => {
  const extId = value[0] ? value[0].extId : ''
  return (
    <span ref={ref}>
      {extId ? (
        <OpenEle type="userName" openid={extId} />
      ) : (
        <span>请选择负责人</span>
      )}
    </span>
  )
})
const SelectPicker = forwardRef(
  (
    {
      children,
      onSelect,
      renderContent,
      placeholder,
      value,
      onChange,
      disabled,
      onClear,
      ...rest
    },
    ref
  ) => {
    const renderEle =
      typeof renderContent === 'function'
        ? renderContent(value, { onChange })
        : ''
    const handleClear = (e) => {
      e.stopPropagation()
      if (typeof onClear === 'function') {
        onClear({ value, onChange })
      } else {
        onChange('')
      }
    }
    const handleSelect = () => {
      if (typeof onSelect === 'function' && !disabled) {
        onSelect(value)
      }
    }

    const valueIsEmpty = useMemo(() => {
      if (value === 0) {
        return false
      }
      if (value) {
        return typeof value === 'object' ? isEmpty(value) : false
      } else {
        return true
      }
    }, [value])
    return (
      <div
        className={styles['select-item']}
        ref={ref}
        {...rest}
        onClick={handleSelect}>
        <div className={styles['select-content']}>
          {valueIsEmpty ? (
            <span className={styles['select-placeholder']}>{placeholder}</span>
          ) : children ? (
            children
          ) : (
            renderEle
          )}
        </div>
        {!disabled ? (
          <div className={styles['select-icon']}>
            {valueIsEmpty ? (
              <RightOutline className={styles['arrow-icon']} />
            ) : (
              <CloseCircleFill onClick={handleClear} />
            )}
          </div>
        ) : null}
      </div>
    )
  }
)
