import { useState, useEffect, useRef, useMemo } from 'react'
import {
  Tabs,
  Row,
  Col,
  DatePicker,
  message,
  Tag,
  Select,
  Modal,
} from 'antd'
import { useRequest } from 'ahooks'
import moment from 'moment'
import CustomerDrawer from 'components/CommonDrawer'
import { WeChatEle } from 'components/WeChatCell'
import TagCell from 'components/TagCell'
import UserTag from 'components/UserTag'
import DescriptionsList from 'components/DescriptionsList'
import { ChooseTagModal } from 'components/TagSelect'
import { Table } from 'components/TableContent'
import {
  GetCustomerDetail,
  EditCustomerCompanyTag,
  UpdateCustomer,
} from 'services/modules/customerManage'
import { EditJourneyCustomer } from 'services/modules/customerJourney'
import { actionRequestHookOptions, getRequestError } from 'services/utils'
import { useModalHook } from 'src/hooks'
import { SUCCESS_CODE } from 'utils/constants'
import { compareArray } from 'src/utils'
import InfoSection from '../InfoSection'
import EditItem from '../EditItem'
import StateItem from '../StateItem'
import { getTagsByStaffId } from '../../utils'
import styles from './index.module.less'
import { isEmpty } from 'lodash'

const { TabPane } = Tabs
const EMAIL_REG =
  /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/g
const TEL_REG = /^1\d{10}$/
/**
 * @param {Object} params 参数
 * * @param {String} customerId 客户id
 * * @param {String} staffId 员工id
 * * @param {String} customerExtId 客户extId
 * @param {Object} customerAvatar 客户头像
 */
export default (props) => {
  const {
    data = {},
    params = {},
    onCancel,
    customerAvatar = {},
    staff = {},
    ...rest
  } = props
  const [baseData, setBaseData] = useState({})
  const [activeKey, setActiveKey] = useState('overview')
  const {
    openModal,
    closeModal,
    confirmLoading,
    requestConfirmProps,
    visibleMap,
  } = useModalHook(['tags'])
  const birthDateRef = useRef(null)
  const hasEdit = useRef(false)
  const stateListRef = useRef(null)
  const {
    data: customerData = {},
    loading: detailLoading,
    cancel,
    run: runGetCustomerDetail,
    refresh,
  } = useRequest(GetCustomerDetail, {
    manual: true,
    onSuccess: (res) => {
      const info = res.customerInfo ? res.customerInfo : {}
      setBaseData({
        ...info,
        birthday: info.birthday ? moment(info.birthday, 'YYYY-MM-DD') : '',
      })
    },
    onError: (e) => getRequestError(e, '查询客户信息失败'),
  })
  const { run: runEditCustomerCompanyTag } = useRequest(
    EditCustomerCompanyTag,
    {
      manual: true,
      ...requestConfirmProps,
      onSuccess: (res) => {
        if (res.code === SUCCESS_CODE && res.data) {
          hasEdit.current = true
          if (stateListRef.current) {
            stateListRef.current.refresh()
          }
          closeModal()
          refresh()
          message.success('操作成功')
        } else {
          message.error('操作失败')
        }
      },
      onError: (e) => {
        getRequestError(e, '操作失败')
      },
    }
  )
  const { run: runEditJourneyCustomer } = useRequest(EditJourneyCustomer, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '操作',
      successFn: () => {
        refresh()
      },
    }),
  })
  const { run: runUpdateCustomer } = useRequest(UpdateCustomer, {
    manual: true,
    ...requestConfirmProps,
    ...actionRequestHookOptions({
      actionName: '操作',
      successFn: () => {
        hasEdit.current = true
        closeModal()
        refresh()
      },
    }),
  })
  useEffect(() => {
    if (!rest.visible) {
      hasEdit.current = false
      setActiveKey('overview')
      setBaseData({})
      if (!detailLoading) {
        cancel()
      }
    } else {
      runGetCustomerDetail({
        id: params.customerId,
        staffId: params.staffId
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest.visible])

  const baseInfoParams = useMemo(() => {
    const info = customerData.customerInfo ? customerData.customerInfo : {}
    return {
      address: info.address || '',
      birthday: info.birthday || '',
      corpName: info.corpName || '',
      customerId: params.customerId,
      staffId: params.staffId,
      email: info.email || '',
      phoneNumber: info.phoneNumber || '',
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerData])
  const customerTags = getTagsByStaffId(customerData)
  const avatarData = useMemo(() => {
    return isEmpty(customerAvatar) && customerData.name
      ? {
          avatarUrl: customerData.avatar,
          name: customerData.name,
          corpName: customerData.corpName,
        }
      : customerAvatar
  }, [customerAvatar, customerData])

  const onChange = (key) => {
    setActiveKey(key)
  }

  const updateBaseData = (key, val) => {
    setBaseData((vals) => ({
      ...vals,
      [key]: val,
    }))
  }

  const onPhoneChange = (val) => {
    runUpdateCustomer({
      ...baseInfoParams,
      phoneNumber: val,
    })
    updateBaseData('phone', val)
  }

  const onEmailChange = (val) => {
    runUpdateCustomer({
      ...baseInfoParams,
      email: val,
    })
    updateBaseData('email', val)
  }

  const onCorpNameChange = (val) => {
    runUpdateCustomer({
      ...baseInfoParams,
      corpName: val,
    })
    updateBaseData('corpName', val)
  }

  const onAddressChange = (val) => {
    runUpdateCustomer({
      ...baseInfoParams,
      address: val,
    })
    updateBaseData('address', val)
  }

  const onDateChange = (val) => {
    runUpdateCustomer({
      ...baseInfoParams,
      birthday: val.format('YYYY-MM-DD'),
    })
    updateBaseData('date', val)
    if (birthDateRef.current) {
      birthDateRef.current.onCancel()
    }
  }

  const onEditTags = () => {
    openModal('tags')
  }

  const onChooseTagOk = (vals) => {
    const { addArr: addTags, removeArr: removeTags } = compareArray(
      customerTags,
      vals.tags,
      (item) => item.id
    )
    runEditCustomerCompanyTag({
      addTags,
      removeTags,
      id: params.customerId,
      staffId: params.staffId,
    })
  }

  const disabledDate = (current) => {
    return current.isAfter(moment(), 'days')
  }

  const validPhone = (text) => {
    if (!TEL_REG.test(text)) {
      return '电话格式不正确'
    }
  }

  const validEmail = (text) => {
    if (!EMAIL_REG.test(text)) {
      return '邮箱格式不正确'
    }
  }

  const handleCancel = () => {
    onCancel(hasEdit.current)
  }

  const onStageChange = (value, option) => {
    Modal.confirm({
      title: '提示',
      content: `确定要将客户阶段更改为"${option.children}"吗`,
      onOk() {
        runEditJourneyCustomer({
          customerId: params.customerId,
          journeyStageId: value,
        })
      },
    })
  }

  const columns = [
    {
      title: '所属员工',
      dataIndex: 'user',
      width: 140,
      render: (_, record) => (
        <UserTag
          data={{
            avatarUrl: record.avatarUrl,
            name: record.name,
          }}
        />
      ),
    },
    {
      title: '添加时间',
      dataIndex: 'createdAt',
    },
    {
      title: '添加渠道',
      dataIndex: 'addWayName',
    },
    {
      title: '标签',
      dataIndex: 'tags',
      render: (val) => <TagCell dataSource={val} />,
    },
  ]

  const customerStageList = Array.isArray(customerData.customerStageIdList)
    ? customerData.customerStageIdList
    : []
  const journeyList = Array.isArray(customerData.journeyList)
    ? customerData.journeyList
    : []
  return (
    <CustomerDrawer
      footer={false}
      {...rest}
      width={800}
      onCancel={handleCancel}>
      <div className={styles['user-info']}>
        <div style={{ marginBottom: 12 }}>
          <WeChatEle
            size="small"
            corpName={avatarData.corpName}
            avatarUrl={avatarData.avatarUrl}
            userName={data.name}
            extra={<RemarkTag remark={customerData.remark} />}
          />
        </div>
        所属员工：{' '}
        <UserTag data={isEmpty(staff) ? customerData.creatorStaff : staff} />
      </div>
      <ChooseTagModal
        data={{
          tags: customerTags,
        }}
        visible={visibleMap.tagsVisible}
        valueIsItem={true}
        onCancel={closeModal}
        onOk={onChooseTagOk}
        confirmLoading={confirmLoading}
      />
      <div>
        <Tabs activeKey={activeKey} onChange={onChange}>
          <TabPane tab="客户总览" key="overview">
            <div>
              <InfoSection title="客户标签">
                <TagCell
                  dataSource={customerTags}
                  maxHeight="auto"
                  empty="无"
                />
                <p>
                  <span
                    onClick={onEditTags}
                    className={styles['edit-tag-action']}>
                    编辑标签
                  </span>
                </p>
              </InfoSection>
              <InfoSection title="关联旅程信息">
                {journeyList.length
                  ? journeyList.map((item) => (
                      <JourneyItem
                        key={item.id}
                        data={item}
                        onChange={onStageChange}
                        stageLocalList={customerStageList}
                      />
                    ))
                  : '无'}
              </InfoSection>
              <InfoSection title="客户信息">
                <DescriptionsList mode="wrap">
                  <Row>
                    <Col span={8}>
                      <DescriptionsList.Item label="电话">
                        <EditItem
                          onChange={onPhoneChange}
                          inputProps={{
                            validMsg: validPhone,
                          }}
                          defaultValue={baseData.phoneNumber}
                        />
                      </DescriptionsList.Item>
                    </Col>
                    <Col span={8}>
                      <DescriptionsList.Item label="生日">
                        <EditItem
                          ref={(r) => (birthDateRef.current = r)}
                          defaultValue={
                            baseData.birthday
                              ? baseData.birthday.format('YYYY-MM-DD')
                              : '-'
                          }>
                          <DatePicker
                            value={baseData.birthday}
                            format="YYYY-MM-DD"
                            disabledDate={disabledDate}
                            onChange={onDateChange}
                          />
                        </EditItem>
                      </DescriptionsList.Item>
                    </Col>
                    <Col span={8}>
                      <DescriptionsList.Item label="邮箱">
                        <EditItem
                          onChange={onEmailChange}
                          inputProps={{
                            validMsg: validEmail,
                          }}
                          defaultValue={baseData.email}
                        />
                      </DescriptionsList.Item>
                    </Col>
                  </Row>
                  <DescriptionsList.Item label="企业">
                    <EditItem
                      onChange={onCorpNameChange}
                      inputProps={{
                        maxLength: 50,
                      }}
                      defaultValue={baseData.corpName}
                    />
                  </DescriptionsList.Item>
                  <DescriptionsList.Item label="地址">
                    <EditItem
                      inputProps={{
                        maxLength: 200,
                        type: 'TextArea',
                      }}
                      onChange={onAddressChange}
                      defaultValue={baseData.address}
                    />
                  </DescriptionsList.Item>
                </DescriptionsList>
              </InfoSection>
              <InfoSection title="关联信息">
                <Table
                  columns={columns}
                  dataSource={customerData.followStaffList}
                />
              </InfoSection>
            </div>
          </TabPane>
          <TabPane tab="客户动态" key="dynamic">
            <StateItem
              data={params}
              ref={(r) => (stateListRef.current = r)}
              avatarData={avatarData}
            />
          </TabPane>
        </Tabs>
      </div>
    </CustomerDrawer>
  )
}

export const RemarkTag = ({ remark = '' }) => {
  if (!remark) {
    return null
  }
  return (
    <span className={styles['customer-remark']}>
      <label className={styles['remark-label']}>备注:</label>
      <Tag className={styles['remark-tag']}>{remark}</Tag>
    </span>
  )
}
export const JourneyItem = ({ data = {}, stageLocalList = [], onChange }) => {
  const journeyStages = useMemo(
    () => (Array.isArray(data.journeyStages) ? data.journeyStages : []),
    [data]
  )

  const { id: selectedStageId } = useMemo(() => {
    const item = journeyStages.find((ele) => stageLocalList.includes(ele.id))
    return item ? item : {}
  }, [journeyStages, stageLocalList])

  return (
    <div className={styles['journey-item']}>
      <span className={styles['journey-item-name']}>{data.name}</span>
      <Select value={selectedStageId} onChange={onChange}>
        {journeyStages.map((ele) => (
          <Select.Option key={ele.id} value={ele.id}>
            {ele.name}
          </Select.Option>
        ))}
      </Select>
    </div>
  )
}
