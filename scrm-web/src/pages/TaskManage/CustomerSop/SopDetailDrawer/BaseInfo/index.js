import { useEffect, useMemo } from 'react'
import { Row, Col, Divider, Spin, Empty } from 'antd'
import UserTag from 'components/UserTag'
import DescriptItem from 'pages/TaskManage/GroupSop/components/DescriptItem'
import RuleInfoItem from 'pages/TaskManage/GroupSop/components/RuleInfoItem'
import Section from 'pages/TaskManage/GroupSop/components/Section'
import TagCell from 'components/TagCell'
import { UserAndDepTags } from 'components/MySelect'
import { refillUsers } from 'components/MySelect/utils'
import { convertTags } from 'components/TagSelect/utils'
import ExpandCell from 'components/ExpandCell'
import WeChatCell from 'components/WeChatCell'
import RuleDetailModal from './components/RuleDetailModal'
import DescriptionsList from 'components/DescriptionsList'
import {
  TRIGGER_OPTIONS,
  EXECUTE_WAY_OPTIONS,
  TRIGGER_TYPES,
} from '../../constants'
import { getOptionItem } from 'src/utils'
import { useModalHook } from 'src/hooks'
import { GetExecuteRuleDetail } from 'services/modules/customerSop'
import styles from './index.module.less'
import { useRequest } from 'ahooks'

export default ({ data = {} }) => {
  const { openModal, closeModal, visibleMap, modalInfo } = useModalHook([
    'detail',
  ])
  const {
    run: runGetExecuteRuleDetail,
    data: executeRuleList = [],
    loading: ruleLoading,
  } = useRequest(GetExecuteRuleDetail, {
    manual: true,
  })

  useEffect(() => {
    if (data.id) {
      runGetExecuteRuleDetail({
        sopId: data.id,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id])

  const triggerName = useMemo(() => {
    return getOptionItem(TRIGGER_OPTIONS, data.term)
  }, [data])
  const isTriggerTime = data.term === TRIGGER_TYPES.TIME

  const onRuleDetail = (item) => {
    openModal('detail', {
      ...item,
      isTriggerTime,
      triggerName,
    })
  }

  return (
    <div>
      <RuleDetailModal
        title="执行详情"
        footer={null}
        visible={visibleMap.detailVisible}
        onCancel={closeModal}
        data={modalInfo.data}
      />
      <Row>
        <Col span={8}>
          <DescriptItem label="触发条件">{triggerName}</DescriptItem>
        </Col>
        <Col span={8}>
          <DescriptItem label="创建人">
            <UserTag data={{ name: data.creatorCN }} />
          </DescriptItem>
        </Col>
        <Col span={8}>
          <DescriptItem label="创建时间">{data.createdAt}</DescriptItem>
        </Col>
      </Row>
      <Divider />
      <Section title="客户">
        {data.hasAllCustomer ? '全部客户' : <CustomerInfo data={data} />}
      </Section>
      <Divider />
      <Section title={`规则`}>
        <Spin spinning={ruleLoading}>
          {executeRuleList.length ? (
            executeRuleList.map((ele, idx) => (
              <RuleInfoItem
                isTriggerTime={isTriggerTime}
                triggerName={triggerName}
                key={idx}
                data={ele}
                wayOptions={EXECUTE_WAY_OPTIONS}
                executorName="员工"
                executedName="客户"
                onDetail={onRuleDetail}></RuleInfoItem>
            ))
          ) : (
            <div style={{ width: 536 }}>
              <Empty description="暂时没有规则数据" />
            </div>
          )}
        </Spin>
      </Section>
    </div>
  )
}

const CustomerInfo = ({ data }) => {
  if (Array.isArray(data.customerList) && data.customerList.length) {
    return (
      <ExpandCell
        dataSource={data.customerList}
        maxHeight="auto"
        renderItem={(item) => (
          <div key={item.id} className={styles['customer-item']}>
            <WeChatCell data={item} />
          </div>
        )}></ExpandCell>
    )
  } else {
    return <FilterCustomer data={data} />
  }
}

const FilterCustomer = ({ data = {} }) => {
  const { tags, usersList } = useMemo(() => {
    const usersList = refillUsers({
      userArr: data.staffList,
      depArr: data.departmentList,
    })
    const tags = convertTags(data.chooseTags, data.chooseTagNames)
    return {
      tags,
      usersList,
    }
  }, [data])

  if (!tags.length && !usersList.length) {
    return '无'
  }

  return (
    <div className={styles['filter-box']}>
      {tags.length ? (
        <DescriptionsList.Item label="标签">
          <TagCell dataSource={tags} />
        </DescriptionsList.Item>
      ) : null}
      {usersList.length ? (
        <DescriptionsList.Item label="员工">
          <ExpandCell maxHeight="auto">
            <UserAndDepTags dataSource={usersList} />
          </ExpandCell>
        </DescriptionsList.Item>
      ) : null}
    </div>
  )
}
