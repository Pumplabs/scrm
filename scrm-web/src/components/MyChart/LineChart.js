import { useRef, useEffect, useMemo } from 'react'
import ChartWrap from './ChartComp'
import * as echarts from 'echarts/core'
import { BarChart, LineChart } from 'echarts/charts'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  LegendComponent,
  DataZoomComponent
} from 'echarts/components'
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
  CanvasRenderer,
  LegendComponent,
  DataZoomComponent
])

/**
 * @param {Array} dataSource 源数据
 * @param {Boolean} loading
 * @param {Object} fieldNames
 * * @param {String} label 
 */
export default (props) => {
  const containerRef = useRef(null)
  const { dataSource = [], loading = false, fieldNames = {}, needLegend = true, needZoom = false, options: baseOptions = {}, ...rest } = props
  const { value: valueKey = 'id', label: labelKey = 'name' } = fieldNames
  useEffect(() => {
    setOption()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataSource, valueKey])

  const getLegendOption = (seriesData = []) => {
    if (needLegend) {
      const legendData = seriesData.map(item => item.name)
      return {
        legend: {
          data:legendData,
          right: 0,
          top: 20
        },
      }
    } else {
      return {}
    }
  }

  const getOption = () => {
    const keyArr = Array.isArray(valueKey) ? valueKey : [valueKey]
    const { obj: resObj } = dataSource.reduce(
      (preRes, item) => {
        const { obj } = preRes
        let nextObj = {
          ...obj,
        }
        keyArr.forEach((keyItem, keyIdx) => {
          const nextArr = nextObj[keyIdx] ? nextObj[keyIdx] : []
          const key = typeof keyItem === 'object' ? keyItem.key : ''
          nextObj = {
            ...nextObj,
            [keyIdx]: [...nextArr, item[key]],
          }
        })
        return {
          obj: nextObj,
        }
      },
      { obj: {} }
    )
    const seriesData = keyArr.map((ele, idx) => {
      const name = typeof ele === 'object' ? ele.name : ''
      return {
        name: name,
        data: resObj[idx],
        type: 'line',
      }
    })
    const xData = dataSource.map((ele) => ele[labelKey])
    const option = {
      xAxis: {
        type: 'category',
        data: xData,
      },
      ...getLegendOption(seriesData),
      grid: {
        bottom: 0,
        left: 0,
        right: 0,
        top: 60,
        containLabel: true
      },
      ...(needZoom ? ({
        dataZoom: [
          {
            type: 'inside',
            start: 0,
            end: 100
          },
          {
            start: 0,
            end: 100,
            moveHandleSize: 5
          }
        ],
      }): {}),
      tooltip: {
        trigger: 'axis',
      },
      yAxis: {
        type: 'value',
        min: 0,
        minInterval: 1
      },
      series: seriesData,
    }
    return option
  }

  const setOption = () => {
    if (containerRef.current) {
      const option = getOption()
      containerRef.current.setChartOptions({
        ...option,
        ...baseOptions
      })
    }
  }
  return (
    <ChartWrap
      ref={(r) => (containerRef.current = r)}
      isEmptyData={dataSource.length === 0}
      {...rest}></ChartWrap>
  )
}
