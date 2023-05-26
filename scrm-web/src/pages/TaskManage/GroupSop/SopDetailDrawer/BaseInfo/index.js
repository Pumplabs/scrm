import { useMemo, useEffect } from 'react'
import { Row, Col, Divider, Empty, Spin } from 'antd'
import { useRequest } from 'ahooks'
import UserTag from 'components/UserTag'
import DescriptionsList from 'components/DescriptionsList'
import ExpandCell from 'components/ExpandCell'
import TagCell from 'components/TagCell'
import GroupTag from 'components/GroupChatCell'
import { refillUsers } from 'components/MySelect/utils'
import { UserAndDepTags } from 'components/MySelect'
import DescriptItem from '../../components/DescriptItem'
import Section from '../../components/Section'
import RuleInfoItem from 'src/pages/TaskManage/GroupSop/components/RuleInfoItem'
import RuleDetailModal from './components/RuleDetailModal'
import {
  TRIGGER_OPTIONS,
  EXECUTE_WAY_OPTIONS,
  TRIGGER_TYPES,
} from '../../constants'
import { useModalHook } from 'src/hooks'
import { getOptionItem } from 'src/utils'
import { GetExecuteRuleDetail } from 'services/modules/groupSop'
import { TYPE_EN as FILTER_TYPE_EN } from '../../AddOrEditPage/components/GroupItem'
import { getGroupFilterType } from '../../utils'
import styles from './index.module.less'

export default ({ data = {}, visible }) => {
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

  const groupFilterType = useMemo(() => {
    return getGroupFilterType(data)
  }, [data])

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
      <Section title={'群聊'}>
        <div style={{ paddingTop: 10 }}>
          <GroupInfoItem filterType={groupFilterType} data={data} />
        </div>
      </Section>
      <Divider />
      <Section title={`规则`}>
        <Spin spinning={ruleLoading}>
          {executeRuleList.length ? (
            executeRuleList.map((ele, idx) => (
              <RuleInfoItem
                visible={visible}
                isTriggerTime={isTriggerTime}
                triggerName={triggerName}
                key={idx}
                data={ele}
                wayOptions={EXECUTE_WAY_OPTIONS}
                executorName="群主"
                executedName="群聊"
                onDetail={onRuleDetail}
                >
              </RuleInfoItem>
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

const GroupInfoItem = ({ filterType, data }) => {
  const ownerList = useMemo(() => {
    return refillUsers({
      userArr: data.staffList,
      depArr: data.departmentList,
    })
  }, [data])

  if (filterType === FILTER_TYPE_EN.ALL) {
    return <span className={styles['all-group-item']}>全部群聊</span>
  }
  if (filterType === FILTER_TYPE_EN.PART) {
    const groupChatList = Array.isArray(data.groupChatList)
      ? data.groupChatList
      : []

    return (
      <>
        {groupChatList.map((ele) => {
          return <GroupTag key={ele.id} data={ele} />
        })}
      </>
    )
  }

  return (
    <>
      {data.startTime && data.endTime ? (
        <DescriptionsList.Item label="创建时间">
          {`${data.startTime}~${data.endTime}`}
        </DescriptionsList.Item>
      ) : null}
      {data.groupName ? (
        <DescriptionsList.Item label="群名关键字">
          {data.groupName}
        </DescriptionsList.Item>
      ) : null}
      {Array.isArray(data.tagList) && data.tagList.length ? (
        <DescriptionsList.Item label="群标签">
          <TagCell dataSource={data.tagList} />
        </DescriptionsList.Item>
      ) : null}
      {ownerList.length ? (
        <DescriptionsList.Item label="群主">
          <ExpandCell maxHeight="auto">
            <UserAndDepTags dataSource={ownerList} />
          </ExpandCell>
        </DescriptionsList.Item>
      ) : null}
    </>
  )
}
