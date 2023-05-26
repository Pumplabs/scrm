import { useMemo, useState } from 'react'
import { get } from 'lodash'
import { useRequest } from 'ahooks'
import { LineChart } from 'components/MyChart'
import StaticsCard from '../StaticsCard'
import ChartItem from '../ChartItem'
import { GetGroupStatics } from 'src/services/modules/home'
const chartOptions = [
  { label: '7日', value: 'seven' },
  { label: '30日', value: 'thirty' },
]
export default () => {
  const [chartOption, setChartOption] = useState('seven')
  const { data: groupStaticsData = {}, loading: groupStaticsLoading } =
    useRequest(GetGroupStatics)
  const indexOptions = [
    {
      title: '群总数',
      value: groupStaticsData.todayTotal || 0,
    },
    {
      title: '今日入群',
      value: get(groupStaticsData, 'todayStatisticsInfo.joinMemberNum') || 0,
    },
    {
      title: '今日退群',
      value: get(groupStaticsData, 'todayStatisticsInfo.quitMemberNum') || 0,
    },
  ]

  const onChartOptionChange = (e) => {
    setChartOption(e.target.value)
  }
  const lineChartData = useMemo(() => {
    const arr =
      chartOption === 'seven'
        ? groupStaticsData.last7StatisticsInfos
        : groupStaticsData.last30StatisticsInfos
    return Array.isArray(arr) ? [...arr].reverse() : []
  }, [groupStaticsData, chartOption])

  return (
    <StaticsCard
      title="群统计"
      indexOptions={indexOptions}
      chartOptions={chartOptions}
      onChartOptionChange={onChartOptionChange}
      chartOptionValue={chartOption}>
      <ChartItem
        options={chartOptions}
        onOptionsChange={onChartOptionChange}
        optionValue={chartOption}
        title="趋势">
        <LineChart
          dataSource={lineChartData || []}
          loading={groupStaticsLoading}
          needZoom={chartOption === 'thirty'}
          fieldNames={{
            label: 'day',
            value: [
              {
                name: '客户总数',
                key: 'customerNum',
              },
              {
                name: '入群人数',
                key: 'joinMemberNum',
              },
              {
                name: '退群人数',
                key: 'quitMemberNum',
              },
              {
                name: '总人数',
                key: 'totalMember',
              },
            ],
          }}
        />
      </ChartItem>
    </StaticsCard>
  )
}
