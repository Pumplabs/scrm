import { useState, useEffect, useMemo, useContext } from 'react'
import { Row, Col } from 'antd'
import { useRequest } from 'ahooks'
import { observer, MobXProviderContext } from 'mobx-react'
import { InfoCircleOutlined } from '@ant-design/icons'
import ChartItem from '../ChartItem'
import { BarChart } from 'components/MyChart'
import {
  GetUserPullNewStatics,
  GetGroupStatics,
} from 'src/services/modules/home'
import styles from './index.module.less'

const batchCovertName = (items) => {
  return new Promise((resolve) => {
    if (window.WWOpenData && window.WWOpenData.prefetch) {
      window.WWOpenData.prefetch(
        {
          items,
        },
        (err, data) => {
          if (err) {
            resolve([])
          } else {
            resolve(data.items)
          }
        }
      )
    } else {
      resolve([])
    }
  })
}
const covertPrefetchItems = (corpid, ...args) => {
  let res = {}
  args.forEach((argItem) => {
    if (Array.isArray(argItem)) {
      argItem.forEach((item) => {
        if (!res[item.extStaffId]) {
          res[item.extStaffId] = {
            type: 'userName',
            id: item.extStaffId,
            corpid: corpid,
          }
        }
      })
    }
  })
  return Object.values(res)
}
const covertByItems = (items, arr = []) => {
  if (Array.isArray(arr) && arr.length) {
    return arr.map((item) => {
      const data = items.find((ele) => ele.id === item.extStaffId)
      const extStaffName = data ? data.data : item.extStaffId
      return {
        ...item,
        extStaffName,
      }
    })
  } else {
    return []
  }
}
const chartOptions = [
  { label: '7日', value: 'seven' },
  { label: '30日', value: 'thirty' },
]
export default observer(() => {
  const [userNewOption, setUserNewOption] = useState('seven')
  const [groupNewOption, setGroupNewOption] = useState('seven')
  const { UserStore, WxWorkStore } = useContext(MobXProviderContext)
  const {
    data: userPullNewData = {},
    loading: userPullNewLoading,
    mutate,
  } = useRequest(GetUserPullNewStatics, {
    defaultParams: [
      {
        topNum: 5,
      },
    ],
    onSuccess: async () => {
      const { last7DaysStatisticsInfos = [], last30DaysStatisticsInfos = [] } =
        userPullNewData
      const extCorpId = UserStore ? UserStore.userData.extCorpId : ''
      const items = covertPrefetchItems(
        extCorpId,
        last7DaysStatisticsInfos,
        last30DaysStatisticsInfos
      )
      const arr = await batchCovertName(items)
      mutate({
        ...userPullNewData,
        last7DaysStatisticsInfos: covertByItems(arr, last7DaysStatisticsInfos),
        last30DaysStatisticsInfos: covertByItems(
          arr,
          last30DaysStatisticsInfos
        ),
      })
    },
  })
  const { data: groupPullNewData = {}, loading: groupPullNewLoading, mutate: mutateGroupData } =
    useRequest(GetGroupStatics, {
      defaultParams: [
        {
          topNum: 5,
        },
      ],
      onSuccess: async () => {
        const {
          last7PullNewStatisticsInfos = [],
          last30PullNewStatisticsInfos = [],
        } = groupPullNewData
        const extCorpId = UserStore ? UserStore.userData.extCorpId : ''
        const items = covertPrefetchItems(
          extCorpId,
          last7PullNewStatisticsInfos,
          last30PullNewStatisticsInfos
        )
        const arr = await batchCovertName(items)
        mutateGroupData({
          ...groupPullNewData,
          last7PullNewStatisticsInfos: covertByItems(
            arr,
            last7PullNewStatisticsInfos
          ),
          last30PullNewStatisticsInfos: covertByItems(
            arr,
            last30PullNewStatisticsInfos
          ),
        })
      },
    })
  useEffect(() => {
    if (window.WWOpenData.initCanvas) {
      window.WWOpenData.initCanvas()
    }
  }, [WxWorkStore.hasRegisterAgentConfig])

  const onUserNewOptionsChange = (e) => {
    setUserNewOption(e.target.value)
  }

  const onGroupNewOptionsChange = (e) => {
    setGroupNewOption(e.target.value)
  }

  const userPullNewChartData = useMemo(() => {
    const chartArr =
      userNewOption === 'seven'
        ? userPullNewData.last7DaysStatisticsInfos
        : userPullNewData.last30DaysStatisticsInfos
    return Array.isArray(chartArr) ? chartArr : []
  }, [userNewOption, userPullNewData])
  const groupOwnerPullNewChartData = useMemo(() => {
    const chartArr =
      groupNewOption === 'seven'
        ? groupPullNewData.last7PullNewStatisticsInfos
        : groupPullNewData.last30PullNewStatisticsInfos
    return Array.isArray(chartArr) ? chartArr : []
  }, [groupPullNewData, groupNewOption])
  return (
    <Row className={styles['pull-new-section']}>
      <Col span={12} className={styles['left-side']}>
        <ChartItem
          title="员工拉新榜"
          subTitle={
            <span className={styles['title-tip']}>
              <InfoCircleOutlined className={styles['tip-icon']} />
              员工净新增客户数
            </span>
          }
          options={chartOptions}
          onOptionsChange={onUserNewOptionsChange}
          optionValue={userNewOption}>
          <BarChart
            dataSource={userPullNewChartData}
            loading={userPullNewLoading}
            fieldNames={{
              label: 'extStaffName',
              value: 'newCustomerTotal',
            }}
            chartOption={{
              color: ['#DD4377'],
            }}
          />
        </ChartItem>
      </Col>
      <Col span={12} className={styles['right-side']}>
        <ChartItem
          title="群主拉新榜"
          subTitle={
            <span className={styles['title-tip']}>
              <InfoCircleOutlined className={styles['tip-icon']} />
              群主所有群净入群客户数
            </span>
          }
          options={chartOptions}
          onOptionsChange={onGroupNewOptionsChange}
          optionValue={groupNewOption}>
          <BarChart
            dataSource={groupOwnerPullNewChartData}
            loading={groupPullNewLoading}
            fieldNames={{
              label: 'extStaffName',
              value: 'pullNewTotal',
            }}
            chartOption={{
              color: ['#F0BF42'],
            }}
          />
        </ChartItem>
      </Col>
    </Row>
  )
})
