import { useState } from 'react'
import { useRequest } from 'ahooks'
import { GetCustomerStatics } from 'services/modules/home'
import StaticsCard from '../StaticsCard'
import ChartItem from '../ChartItem'
import { LineChart } from 'components/MyChart'
const chartOptions = [
  { label: '7日', value: 'seven' },
  { label: '30日', value: 'thirty' },
]

export default () => {
  const [chartOption, setChartOption] = useState('seven')
  const { data: customerStaticsData = {}, loading: staticsLoading } =
    useRequest(GetCustomerStatics)

  const indexOptions = [
    {
      title: '客户总数（去重）',
      value: customerStaticsData.total || 0,
    },
    {
      title: '今日新增',
      value: customerStaticsData.todaySaveTotal || 0,
    },
    {
      title: '今日流失',
      value: customerStaticsData.todayLossTotal || 0,
    },
  ]

  const onChartOptionChange = (e) => {
    setChartOption(e.target.value)
  }
  const lineChartData =
    chartOption === 'seven'
      ? customerStaticsData.last7DaysStatisticsInfos
      : customerStaticsData.last30DaysStatisticsInfos
  return (
    <StaticsCard title="客户统计" indexOptions={indexOptions}>
      <ChartItem
        options={chartOptions}
        onOptionsChange={onChartOptionChange}
        optionValue={chartOption}
        title="趋势">
        <LineChart
          dataSource={lineChartData || []}
          loading={staticsLoading}
          needZoom={chartOption === 'thirty'}
          fieldNames={{
            label: 'day',
            value: [
              {
                name: '流失总数',
                key: 'lossTotal',
              },
              {
                name: '新增总数',
                key: 'saveTotal',
              },
            ],
          }}
        />
      </ChartItem>
    </StaticsCard>
  )
}
