import { useRef, useEffect } from 'react'
import { ChartComp } from 'components/MyChart'
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, GridComponent, DatasetComponent, DatasetComponentOption, TransformComponent } from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer
])

export default ({ dataSource = [], valueKey = 'customerNum', ...rest }) => {
  const containerRef = useRef(null)
  useEffect(() => {
    if (dataSource.length) {
      setOption()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource, valueKey])

  const getOption = () => {
    const values = dataSource.map(ele => {
      const count = ele[valueKey]
      return count
    })
    const xData = dataSource.map(ele => ele.createDate.slice(0, 'YYYY-MM-DD'.length))
    const option = {
      xAxis: {
        type: 'category',
        data: xData,
      },
      tooltip: {
        trigger: "axis"
      },
      yAxis: {
        type: 'value',
        minInterval: 1
      },
      series: [
        {
          name: '人数',
          data:values,
          type: 'line',
          areaStyle: {
            opacity: 0.5
          }
        }
      ]
    };
    return option
  }

  const setOption = () => {
    if (containerRef.current) {
      const option = getOption()
      containerRef.current.setChartOptions(option)
    }
  }
  return (
    <ChartComp
      ref={(r) => (containerRef.current = r)}
      isEmptyData={dataSource.length === 0}
      {...rest}></ChartComp>
  )
}