import { get } from 'lodash'
import { useMemo } from 'react'
import UserTag from 'components/UserTag'
import DescriptionsList from 'components/DescriptionsList'
import StatusItem from 'pages/CommercialOpportunityConfiguration/StageConfiguration/StageConfigDrawer/StatusItem'
import WeChatCell from 'components/WeChatCell'
import { PRIORITY_OPTIONS } from '../../constants'
import { formatNumber, getOptionItem } from 'src/utils'
import styles from './index.module.less'

export default ({ data = {}, groupName = '' }) => {
  const priorityName = useMemo(() => {
    return getOptionItem(PRIORITY_OPTIONS, data.priority)
  }, [data.priority])
  const cooperatorList = Array.isArray(data.cooperatorList) ? data.cooperatorList : []
  return (
    <div className={styles['info-side']}>
      <p className={styles['info-side-title']}>{data.name}</p>
      <DescriptionsList labelWidth={100}>
        <DescriptionsList.Item label="商机阶段">
          <StatusItem name={get(data, 'stage.name')} color={get(data, 'stage.color')} />
        </DescriptionsList.Item>
        <DescriptionsList.Item label="商机分组">
          {groupName}
        </DescriptionsList.Item>
        <DescriptionsList.Item label="商机金额">
          {data.expectMone || formatNumber(data.expectMoney, {
            padPrecision: 2
          })}
        </DescriptionsList.Item>
        <DescriptionsList.Item label="预计成交日期">
          {data.expectDealDate || '-'}
        </DescriptionsList.Item>
        <DescriptionsList.Item label="负责人">
          <UserTag data={data.ownerStaff} />
        </DescriptionsList.Item>
        <DescriptionsList.Item label="客户">
          <WeChatCell data={data.customer} />
        </DescriptionsList.Item>
        <DescriptionsList.Item label="上次跟进时间">
          {data.lastFollowAt || '-'}
        </DescriptionsList.Item>
        <div className={styles['divider-line']} />
        <DescriptionsList.Item label="协作人">
          {cooperatorList.map(ele => <UserTag data={ele.cooperatorStaff} key={ele.id} style={{marginRight: 4, marginBottom: 4}}/>)}
        </DescriptionsList.Item>
        <DescriptionsList.Item label="优先级">
          {priorityName}
        </DescriptionsList.Item>
        <DescriptionsList.Item label="描述">
          {data.desp}
        </DescriptionsList.Item>
        <DescriptionsList.Item label="创建人">
          <UserTag data={{ name: data.creatorCN }} />
        </DescriptionsList.Item>
        <DescriptionsList.Item label="创建时间">
          {data.createdAt}
        </DescriptionsList.Item>
        <DescriptionsList.Item label="上次更新人">
          {data.editor ? <UserTag data={data.editorStaff} /> : '-'}
        </DescriptionsList.Item>
        <DescriptionsList.Item label="上次更新时间">
          {data.updatedAt || '-'}
        </DescriptionsList.Item>
      </DescriptionsList>
    </div>
  )
}
