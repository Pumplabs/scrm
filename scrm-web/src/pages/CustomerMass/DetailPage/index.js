import { useEffect, useState } from 'react'
import cls from 'classnames'
import { isEmpty } from 'lodash'
import { QuestionCircleOutlined, CaretDownOutlined } from '@ant-design/icons'
import {
  Tooltip,
  Dropdown,
  Menu,
  Button,
  Divider,
  Modal,
  Tag,
  message,
} from 'antd'
import { PageContent } from 'layout'
import { useRequest } from 'ahooks'
import OpenEle from 'components/OpenEle'
import { useParams, useNavigate } from 'react-router-dom'
import UserTag from 'components/UserTag'
import CustomerSection from './CustomerSection'
import StaffSection from './StaffSection'
import { MsgPreview, MsgCell } from 'components/WeChatMsgEditor'
import { getMsgList } from 'components/WeChatMsgEditor/utils'
import {
  getRequestError,
  exportByLink,
  actionRequestHookOptions,
} from 'services/utils'
import StaticsBox from 'components/StaticsBox'
import {
  ADVANCE_FILTER,
  ADVANCE_FILTER_OPTIONS,
} from '../AddOrEditPage/constants'
import { SEND_STATUS_NAMES } from '../constants'
import { CUSTOMER_STATUS_EN, MEMBER_STATUS_EN, CUSTOMER_STATUS_CN } from './constants'
import {
  GetCustomerMassDetail,
  ExportCustomerList,
  ExportStaff,
  RemindMass,
} from 'services/modules/customerMass'
import { getMassName } from '../utils'
import styles from './index.module.less'

const MEMBER_STATUS_OPTIONS = [
  {
    label: '全部',
    value: 'all',
  },
  {
    label: '已发送人员',
    value: MEMBER_STATUS_EN.SEND
  },
  {
    label: '未发送人员',
    value: MEMBER_STATUS_EN.WAIT_SEND,
  },
]
const CUSTOMER_STATUS_OPTIONS = [
  {
    label: '全部',
    value: 'all',
  },
  {
    label: '已送达',
    value: CUSTOMER_STATUS_EN.SEND,
  },
  {
    label: '未送达',
    value: CUSTOMER_STATUS_EN.WAIT_SEND,
  },
  {
    label: '接收达上限',
    value: CUSTOMER_STATUS_EN.OVER_LIMIT,
  },
  {
    label: '已不是好友',
    value: CUSTOMER_STATUS_EN.NOT_FRIEND,
  },
]
export default () => {
  const { id: massId } = useParams()
  const [msgList, setMsgList] = useState([])
  const navigate = useNavigate()
  const {
    run: runGetCustomerMassDetail,
    data: massData = {},
    loading,
  } = useRequest(GetCustomerMassDetail, {
    manual: true,
    onSuccess: async (res) => {
      if (!isEmpty(res)) {
        const mList = await getMsgList(massData.msg)
        setMsgList(mList)
      } else {
        message.error('没有客户群发信息')
      }
    },
    onError: (e) => {
      getRequestError(e, '没有客户群发信息')
      backToList()
    },
  })
  const { run: runExportStaff } = useRequest(ExportStaff, {
    manual: true,
    onSuccess: (res) => {
      exportByLink(res)
      message.info('正在导出中...')
    },
    onError: (e) => getRequestError(e, '导出异常'),
  })
  const { run: runExportCustomerList } = useRequest(ExportCustomerList, {
    manual: true,
    onSuccess: (res) => {
      exportByLink(res)
      message.info('正在导出中...')
    },
    onError: (e) => getRequestError(e, '导出异常'),
  })
  const { run: runRemindMass } = useRequest(RemindMass, {
    manual: true,
    ...actionRequestHookOptions({
      actionName: '提醒',
    }),
  })

  const backToList = () => {
    navigate(backurl)
  }
  const backurl = `/customerMass`
  const staffList = Array.isArray(massData.staffList) ? massData.staffList : []
  const customerList = Array.isArray(massData.customerList)
    ? massData.customerList
    : []

  useEffect(() => {
    if (massId) {
      runGetCustomerMassDetail({
        id: massId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [massId])
  const handleCustomerExport = ({ key }) => {
    const isAll = key === 'all'
    const label = isAll ? '全部' : CUSTOMER_STATUS_CN[key]
    runExportCustomerList({
      statusCN: label,
      status: isAll ? null : key,
      templateId: massId,
    })
  }
  const handleMemberExport = ({ key }) => {
    const isAll = key === 'all'
    const label = isAll ? '全部' : CUSTOMER_STATUS_CN[key]
    runExportStaff({
      statusCN: label,
      status: isAll ? null : key,
      templateId: massId,
    })
  }

  const onRemindAll = () => {
    Modal.confirm({
      title: '提示',
      content: '确定要提醒全部成员吗?',
      centered: true,
      onOk: () => {
        runRemindMass({
          staffExtId: '',
          templateId: massId,
        })
      },
    })
  }

  const onRemindItem = (data) => {
    Modal.confirm({
      title: '提示',
      centered: true,
      content: `确定要提醒成员"${data.name}"吗?`,
      onOk: () => {
        runRemindMass({
          staffExtId: data.extId,
          templateId: massId,
        })
      },
    })
  }

  const memberMenu = (
    <Menu onClick={handleMemberExport}>
      {MEMBER_STATUS_OPTIONS.map((item) => (
        <Menu.Item key={item.value}>{item.label}</Menu.Item>
      ))}
    </Menu>
  )
  const customerMenu = (
    <Menu onClick={handleCustomerExport}>
      {CUSTOMER_STATUS_OPTIONS.map((item) => (
        <Menu.Item key={item.value}>{item.label}</Menu.Item>
      ))}
    </Menu>
  )

  return (
    <PageContent showBack={true} backUrl={backurl} loading={loading}>
      <div className={styles['detail-page']}>
        <div className={styles['detail-page-header']}>群发详情</div>
        <div className={styles['detail-page-body']}>
          <div className={styles.preViewContainer}>
            <p style={{ textAlign: 'center', marginBottom: 10 }}>
              客户收到的消息
            </p>
            <MsgPreview mediaList={msgList} />
          </div>
          <DescItem label="群发名称">{getMassName(massData)}</DescItem>
          <DescItem label="创建者">
            <UserTag data={massData.staff} />
          </DescItem>
          <DescItem label="群发内容">
            <MsgCell data={massData.msg} maxHeight="auto" />
          </DescItem>
          <DescItem label="发送类型">
            {massData.hasSchedule ? '定时发送' : '立即发送'}
          </DescItem>
          <DescItem label="发送状态">
            {SEND_STATUS_NAMES[massData.status]}
          </DescItem>
          <DescItem label="发送时间">{massData.sendTime}</DescItem>
          <DescItem label="群发对象">
            <MassObjectDesc data={massData} count={customerList.length} />
          </DescItem>
        </div>
      </div>
      <div className={styles['data-detail-section']}>
        <div className={styles['card-header']}>数据统计</div>
        <div
          className={cls({
            [styles['dataStatics-container']]: true,
            clear: true,
          })}>
          <StaticsBox
            dataSource={[
              {
                label: `${massData.sendStaffCount || 0}人`,
                desc: '已发送成员',
              },
              {
                label: `${massData.sendCustomer || 0}人`,
                desc: '送达客户',
              },
            ]}
            className={styles['data-box']}
          />
          <StaticsBox
            dataSource={[
              {
                label: `${massData.noSendStaffCount || 0}人`,
                desc: '未发送成员',
              },
              {
                label: `${massData.noSendCustomer || 0}人`,
                desc: (
                  <span>
                    未送达客户
                    <Tooltip title="未发送和发送失败的员工拥有的所有客户数">
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                ),
              },
            ]}
            className={styles['data-box']}
          />
          <StaticsBox
            dataSource={[
              {
                label: `${massData.otherSendCustomer || 0}人`,
                desc: (
                  <span>
                    客户接收已达上限
                    <Tooltip title="每位客户每天可以接收1条群发消息，不限企业发布的群发和个人发布的群发。如果超出则发送不成功，记为客户接收已达上限">
                      <QuestionCircleOutlined style={{ marginLeft: 4 }} />
                    </Tooltip>
                  </span>
                ),
              },
              {
                label: `${massData.noFriendCustomer || 0}人`,
                desc: '因不是好友发送失败',
              },
            ]}
            className={styles['data-box']}
          />
        </div>
      </div>
      <div
        className={cls({
          [styles['customer-section']]: true,
          [styles.clear]: true,
        })}>
        <div className={styles['member-detail']}>
          <div
            className={styles['card-header']}
            style={{ position: 'relative' }}>
            成员详情
            <div className={styles['member-detail-extra']}>
              <Button type="primary" ghost>
                <Dropdown overlay={memberMenu}>
                  <span>
                    导出
                    <Divider type="vertical" />
                    <CaretDownOutlined />
                  </span>
                </Dropdown>
              </Button>
            </div>
          </div>
          <div>
            <StaffSection
              massId={massId}
              onRemindItem={onRemindItem}
              onRemindAll={onRemindAll}
            />
          </div>
        </div>
        <div className={styles['customer-detail']}>
          <div
            className={styles['card-header']}
            style={{ position: 'relative' }}>
            客户详情
            <div className={styles['member-detail-extra']}>
              <Button type="primary" ghost>
                <Dropdown overlay={customerMenu}>
                  <span>
                    导出
                    <Divider type="vertical" />
                    <CaretDownOutlined />
                  </span>
                </Dropdown>
              </Button>
            </div>
          </div>
          <div>
            <CustomerSection customerList={customerList} />
          </div>
        </div>
      </div>
    </PageContent>
  )
}
const DescItem = ({ label, children }) => {
  return (
    <div className={styles['desc-item']}>
      <div className={styles['desc-item-label']}>{label}</div>
      <div className={styles['desc-item-content']}>{children}</div>
    </div>
  )
}

// 账号
const getAccountName = (data = {}) => {
  const { hasAllStaff, staffList = [] } = data
  if (hasAllStaff) {
    return '全部账号'
  }
  const staffIds = Array.isArray(staffList) ? staffList : []
  if (staffIds.length) {
    const staff = staffIds[0]
    return (
      <>
        <OpenEle type="userName" openid={staff.name} />等{staffIds.length}个账号
      </>
    )
  } else {
    return ''
  }
}

const MassObjectDesc = ({ data = {}, count }) => {
  // const genderItem = GENDER_OPTIONS.find((ele) => ele.value === data.sex)
  if (data.hasPerson) {
    const customerList = Array.isArray(data.customerList)
      ? data.customerList
      : []
    return (
      <MassObjectContent
        title={
          <>
            {customerList[0].customerName}等{customerList.length}个客户
          </>
        }></MassObjectContent>
    )
  }
  if (data.hasAllCustomer) {
    return (
      <MassObjectContent
        title={<>{getAccountName(data)}的全部客户</>}></MassObjectContent>
    )
  }
  return (
    <MassObjectContent
      title={
        <>
          在{getAccountName(data)}里满足以下条件中的{count}个客户
        </>
      }>
      {data.addEndTime ? (
        <MassObjectDescItem label="添加时间">
          {data.addStartTime}-{data.addEndTime}
        </MassObjectDescItem>
      ) : null}
      <MassObjectTag
        chooseTags={data.chooseTags}
        chooseTagType={data.chooseTagType}
      />
      {Array.isArray(data.excludeTagNames) && data.excludeTagNames.length ? (
        <MassObjectDescItem label="排除客户">
          {data.excludeTagNames.map((ele) => (
            <Tag key={ele}>{ele}</Tag>
          ))}
        </MassObjectDescItem>
      ) : null}
    </MassObjectContent>
  )
}

const MassObjectTag = ({ chooseTagType, chooseTags }) => {
  const tagArr = Array.isArray(chooseTags) ? chooseTags : []
  if (chooseTagType !== ADVANCE_FILTER.NONE && !tagArr.length) {
    return null
  }
  const item = ADVANCE_FILTER_OPTIONS.find(
    (item) => item.value === chooseTagType
  )
  const filterName = item ? item.label : ''
  return (
    <MassObjectDescItem label="标签">
      {chooseTagType === ADVANCE_FILTER.NONE ? (
        filterName
      ) : (
        <>
          {tagArr.map((ele) => (
            <Tag key={ele}>{ele}</Tag>
          ))}
          ({filterName})
        </>
      )}
    </MassObjectDescItem>
  )
}
const MassObjectContent = ({ title, children }) => {
  return (
    <div className={styles['massObject-desc']}>
      <p className={styles['massObject-desc-header']}>{title}</p>
      {children ? (
        <div className={styles['massObject-descList']}>{children}</div>
      ) : null}
    </div>
  )
}
const MassObjectDescItem = ({ label, children }) => {
  return (
    <div className={styles['massObject-desc-item']}>
      <div className={styles['massObject-desc-item-label']}>{label}</div>
      <div className={styles['massObject-desc-item-content']}>{children}</div>
    </div>
  )
}
