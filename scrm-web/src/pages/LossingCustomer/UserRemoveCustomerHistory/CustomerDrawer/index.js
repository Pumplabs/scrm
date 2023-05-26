import { useState, useEffect, useRef, useMemo } from 'react'
import { Tabs, Row, Col } from 'antd'
import { useRequest } from 'ahooks'
import { isEmpty } from 'lodash'
import CustomerDrawer from 'components/CommonDrawer'
import { WeChatEle } from 'components/WeChatCell'
import TagCell from 'components/TagCell'
import UserTag from 'components/UserTag'
import DescriptionsList from 'components/DescriptionsList'
import { Table } from 'components/TableContent'
import InfoSection from 'pages/CustomerManage/CustomerList/components/InfoSection'
import StateItem from 'pages/CustomerManage/CustomerList/components/StateItem'
import { JourneyItem, RemarkTag } from 'pages/CustomerManage/CustomerList/components/DetailDrawer'
import { GetLossingCustomerInfo } from 'services/modules/lossingCustomeHistory'
import { getRequestError } from 'services/utils'

const { TabPane } = Tabs
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
    customerAvatar = {},
    staff = {},
    ...rest
  } = props
  const [activeKey, setActiveKey] = useState('overview')
  const stateListRef = useRef(null)
  const {
    data: lossingDetail = {},
    loading: detailLoading,
    cancel,
    run: runGetCustomerDetail,
  } = useRequest(GetLossingCustomerInfo, {
    manual: true,
    onError: (e) => getRequestError(e, '查询客户信息失败'),
  })

  const customerData = useMemo(() => {
    return lossingDetail.customer || {}
  }, [lossingDetail.customer])

  useEffect(() => {
    if (!rest.visible) {
      setActiveKey('overview')
      if (!detailLoading) {
        cancel()
      }
    } else {
      runGetCustomerDetail({
        id: data.id,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rest.visible])

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
  const customerTags = Array.isArray(customerData.tags) ? customerData.tags : []
  const customerInfo = customerData.customerInfo ? customerData.customerInfo : {}
  const customerStageList = Array.isArray(customerData.customerStageIdList)
  ? customerData.customerStageIdList
  : []
  const journeyList = Array.isArray(customerData.journeyList)
  ? customerData.journeyList
  : []
  return (
    <CustomerDrawer footer={false} {...rest} width={800}>
      <div>
        <div style={{ marginBottom: 12 }}>
          <WeChatEle
            size="small"
            corpName={avatarData.corpName}
            avatarUrl={avatarData.avatarUrl}
            userName={customerData.name}
            extra={<RemarkTag remark={customerData.remark}/>}
          />
        </div>
        所属员工：{' '}
        <UserTag data={isEmpty(staff) ? customerData.creatorStaff : staff} />
      </div>
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
              </InfoSection>
              <InfoSection title="关联旅程信息">
                {journeyList.length
                  ? journeyList.map((item) => (
                      <JourneyItem
                        key={item.id}
                        data={item}
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
                        {customerInfo.phoneNumber}
                      </DescriptionsList.Item>
                    </Col>
                    <Col span={8}>
                      <DescriptionsList.Item label="生日">
                        {customerInfo.birthday || '-'}
                      </DescriptionsList.Item>
                    </Col>
                    <Col span={8}>
                      <DescriptionsList.Item label="邮箱">
                        {customerInfo.email || '-'}
                      </DescriptionsList.Item>
                    </Col>
                  </Row>
                  <DescriptionsList.Item label="企业">
                    {customerInfo.corpName || '-'}
                  </DescriptionsList.Item>
                  <DescriptionsList.Item label="地址">
                    {customerInfo.address || '-'}
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
