import {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useMemo,
} from 'react'
import { Empty, Spin } from 'antd'
import { usePrevious } from 'ahooks'
import * as echarts from 'echarts/core'
import ChartTip from './ChartTip'

/**
 * @param {Boolean} loading 加载状态
 * @param {Object} wrapStyle 外部容器样式
 * @param {Object} style 图表样式
 * @param {Function} chartRef 图表的ref
 * @param {Boolean} isEmptyData 是否为空值
 */
export default forwardRef((props, ref) => {
  const domRef = useRef(null)
  const chartRef = useRef(null)
  const {
    loading = false,
    showTip = false,
    wrapStyle,
    style = {},
    chartRef: chartRefFn,
    tipRef,
    isEmptyData = false,
  } = props
  const preEmptyStatus = usePrevious(isEmptyData)
  useEffect(() => {
    if (domRef.current && !chartRef.current) {
      chartRef.current = echarts.init(domRef.current)
      if (chartRefFn) {
        if (typeof chartRefFn === 'function') {
          chartRefFn(chartRef.current)
        } else if (chartRefFn.current) {
          chartRefFn.current = chartRef.current
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useImperativeHandle(ref, () => ({
    setChartOptions,
  }))

  const setChartOptions = (options) => {
    if (chartRef.current && options) {
      chartRef.current.setOption(options)
      setTimeout(() => {
        handleResize()
      }, 200)
    }
  }

  const handleResize = () => {
    if (chartRef.current) {
      chartRef.current.resize()
    }
  }

  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const getChartStyleAndEmptyStyle = (isEmpty) => {
    const hideStyle = { display: 'none', height: 0 }
    return {
      emptyStyle: isEmpty ? {} : hideStyle,
      chartStyle: isEmpty ? hideStyle : {},
    }
  }

  const { chartStyle, emptyStyle } = useMemo(() => {
    // 如果上次状态与本次相同
    if (preEmptyStatus === isEmptyData) {
      return getChartStyleAndEmptyStyle(preEmptyStatus)
    } else {
      return getChartStyleAndEmptyStyle(isEmptyData && !loading)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEmptyData, loading])

  const chartHeight = style.height ? style.height : 260
  return (
    <div style={wrapStyle} ref={ref}>
      {showTip ? <ChartTip ref={tipRef}/> : null}
      <Spin spinning={loading}>
        <div
          ref={(r) => (domRef.current = r)}
          style={{ height: chartHeight, ...style, ...chartStyle }}></div>
        <div
          style={{
            height: chartHeight,
            paddingTop: Math.floor((chartHeight - 60) / 2),
            ...emptyStyle,
          }}>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="暂无图表数据"
            style={{ margin: 0 }}
          />
        </div>
      </Spin>
    </div>
  )
})
