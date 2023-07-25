import { useRequest } from 'ahooks'
import { useMemo } from 'react'
import { Tooltip } from 'antd'
import DescriptionsList from 'components/DescriptionsList'
import { GetJourneyStatics } from 'services/modules/home'
import StaticsCard from '../StaticsCard'
import { COLORS } from 'pages/CustomerJourney/JourneyStages/StageList/constants'
import styles from './index.module.less'

export default () => {
  const { data: journeyStaticsList = [] } = useRequest(GetJourneyStatics)
  return (
    <StaticsCard title="客户阶段" className={styles['journey-statics']}>
      <div>
        {journeyStaticsList.length
          ? journeyStaticsList.map((item, idx) => (
            <JourneyItem key={item.name} data={item} bgColor={COLORS[idx]} />
          ))
          : '暂无'}
      </div>
    </StaticsCard>
  )
}

const JourneyItem = ({ data = {}, bgColor }) => {
  const stageList = useMemo(() => {
    return Array.isArray(data.stageList) ? data.stageList : []
  }, [data.stageList])

  const totalCustomerNum = useMemo(() => {
    return stageList.reduce((res, ele) => {
      return ele.customerNum > 0 ? ele.customerNum + res : res
    }, 0)
  }, [stageList])
  return (
    <div className={styles['journey-item']}>
      {/* <div className={styles['journey-item-header']}>
        <span
          className={styles['journey-name']}
          style={{ backgroundColor: bgColor }}>
          {data.name}
          <span className={styles['journey-stage-count']}>
            ({totalCustomerNum})
          </span>
        </span>
      </div> */}
      <div className={styles['journey-item-content']}>
        <DescriptionsList mode="wrap">
          {stageList.length
            ? stageList.map((item) => (
              <div className={styles['stage-item']} key={item.name}>
                <DescriptionsList.Item
                  label={
                    <Tooltip title={item.name} placement="topLeft">
                      <span className={styles['stage-name']}>
                        {item.name}
                      </span>
                    </Tooltip>
                  }
                  labelStyle={{
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                  <span className={styles['stage-num']}>
                    {item.customerNum}
                  </span>
                </DescriptionsList.Item>
              </div>
            ))
            : '暂无阶段'}
        </DescriptionsList>
      </div>
    </div>
  )
}
