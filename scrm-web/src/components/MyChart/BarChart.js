import {
  useRef,
  useEffect,
} from 'react'
import { get, mergeWith, merge} from 'lodash'
import * as echarts from 'echarts/core'
import { BarChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
} from 'echarts/components'
import { LabelLayout, UniversalTransition } from 'echarts/features'
import { CanvasRenderer } from 'echarts/renderers'
import ChartWrap from './ChartComp'

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LabelLayout,
  UniversalTransition,
  CanvasRenderer,
])
const mergeFn = (objValue, srcValue) => {
  if (Array.isArray(objValue) && Array.isArray(srcValue)) {
    return [...objValue, ...srcValue]
  } else {
    return srcValue
  }
}
export default (props) => {
  const containerRef = useRef(null)
  const { dataSource = [], fieldNames = {}, chartOption =  {}, ...rest } = props
  const { value: valueKey = 'id', label: labelKey = 'name' } = fieldNames

  useEffect(() => {
    if (dataSource.length) {
      setOption()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource, valueKey])

  const getOption = () => {
    const names = dataSource.map((ele) => get(ele, labelKey) || '')
    const arr = dataSource.map((ele) => get(ele, valueKey) || 0)

    const dataOptions = {
      xAxis: {
        type: 'value',
        boundaryGap: [0, 0.01],
        splitLine: {
          show: false,
        },
        label: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
      },
      yAxis: {
        type: 'category',
        triggerEvent: true,
        inverse: true,
        axisTick: {
          show: false,
        },
        axisLine: {
          show: false,
        },
        splitLine: {
          show: false,
        },
        data: names,
      },
      series: [
        {
          type: 'bar',
          data: arr,
          barWidth: 12,
          barCategoryGap: 10,
          label: {
            show: true,
            position: 'right',
          },
        },
      ],
    }
    const nextOptions = merge(dataOptions, chartOption)
    return nextOptions
  }

  const setOption = () => {
    if (containerRef.current) {
      const option = getOption()
      containerRef.current.setChartOptions(option)
    }
  }

  return (
    <ChartWrap
      ref={(r) => (containerRef.current = r)}
      isEmptyData={dataSource.length === 0}
      {...rest}></ChartWrap>
  )
}
