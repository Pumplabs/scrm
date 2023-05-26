import { useEffect, useState, useRef, useMemo } from 'react'
import { Row, Col } from 'antd'
import { useRequest } from 'ahooks'
import { get } from 'lodash'
import DescriptionsList from 'components/DescriptionsList'
import ChartItem from '../ChartItem'
import { BarChart } from 'components/MyChart'
import { DetailTalkScriptDrawer } from 'pages/TalkScript'
import {
  GetTodayMaterialStatics,
  GetMaterialTopsStatics,
} from 'services/modules/home'
import MaterialDetail from './MaterialDetail'
import { formatNumber } from 'src/utils'
import { useModalHook } from 'src/hooks'
import { getStartTime } from '../utils'
import styles from './index.module.less'

const chartOptions = [
  { label: '7日', value: 'seven' },
  { label: '30日', value: 'thirty' },
]
const TOPS_TYPE = {
  SEND: 2,
  VISIT: 1,
}

export default () => {
  const [sendOption, setSendOption] = useState('seven')
  const [visitOption, setVisitOption] = useState('seven')
  const sendChartRef = useRef(null)
  const visitChartRef = useRef(null)
  const sendChartTipRef = useRef(null)
  const visitChartTipRef = useRef(null)
  const { openModal, closeModal, modalInfo, visibleMap } = useModalHook([
    'talkScriptDetail',
    'materialDetail',
  ])
  const { data: todayStaticsData = {}, loading: todayStaticsLoading } =
    useRequest(GetTodayMaterialStatics)
  const {
    data: sendTops = [],
    run: runGetSendMaterialTopsStatics,
    loading: sendTopsLoading,
  } = useRequest(GetMaterialTopsStatics, {
    manual: true,
  })
  const {
    data: visitTops = [],
    run: runGetVisitMaterialTopsStatics,
    loading: visitLoading,
  } = useRequest(GetMaterialTopsStatics, {
    manual: true,
  })

  const handleSendDetail = (params) => {
    if (params.targetType === 'axisLabel') {
      onDetail(sendTops[params.tickIndex])
    }
  }
  const handleChartMouseOver = (e, domRef) => {
    if (e.targetType !== 'axisLabel') {
      return
    }
    if (e.componentType !== 'yAxis') {
      return
    }
    const fullText = e.value
    if (domRef.current.show && domRef.current.tipText === fullText) {
      return
    }
    domRef.current.setContent(fullText)
    domRef.current.showTip(e)
  }
  const handleChartMouseOut = (domRef) => {
    domRef.current.hideTip()
  }
  const handleSendChartMouseOver = (params) => {
    if (sendChartTipRef.current) {
      handleChartMouseOver(params, sendChartTipRef)
    }
  }
  const handleSendChartMouseOut = () => {
    if (sendChartTipRef.current) {
      handleChartMouseOut(sendChartTipRef)
    }
  }
  const handleVisitChartMouseOver = (params) => {
    if (visitChartTipRef.current) {
      handleChartMouseOver(params, visitChartTipRef)
    }
  }
  const handleVisitChartMouseOut = () => {
    if (visitChartTipRef.current) {
      handleChartMouseOut(visitChartTipRef)
    }
  }
  useEffect(() => {
    if (sendChartRef.current) {
      sendChartRef.current.on('click', 'yAxis', handleSendDetail)
      sendChartRef.current.on('mouseover', handleSendChartMouseOver)
      sendChartRef.current.on('mouseout', handleSendChartMouseOut)
    }
    return () => {
      sendChartRef.current.off('click', handleSendDetail)
      sendChartRef.current.off('mouseover', handleSendChartMouseOver)
      sendChartRef.current.off('mouseout', handleSendChartMouseOut)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendTops])

  useEffect(() => {
    if (visitChartRef.current) {
      visitChartRef.current.on('click', 'yAxis', function (params) {
        if (params.targetType === 'axisLabel') {
          onDetail(visitTops[params.tickIndex])
        }
      })
      visitChartRef.current.on('mouseover', handleVisitChartMouseOver)
      visitChartRef.current.on('mouseout', handleVisitChartMouseOut)
    }
    return () => {
      visitChartRef.current.off('mouseover', handleVisitChartMouseOver)
      visitChartRef.current.off('mouseout', handleVisitChartMouseOut)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitTops])

  useEffect(() => {
    if (sendOption) {
      runGetSendMaterialTopsStatics({
        showCount: 5,
        startTime: getStartTime(sendOption),
        type: TOPS_TYPE.SEND,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sendOption])

  useEffect(() => {
    if (visitOption) {
      runGetVisitMaterialTopsStatics({
        showCount: 5,
        startTime: getStartTime(visitOption),
        type: TOPS_TYPE.VISIT,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visitOption])

  const onSendTopsOptionsChange = (e) => {
    setSendOption(e.target.value)
  }
  const onVisitTopsOptionsChange = (e) => {
    setVisitOption(e.target.value)
  }
  const onDetail = (item) => {
    if (item) {
      if (item.mediaInfo) {
        openModal('materialDetail', item.mediaInfo)
      } else {
        openModal('talkScriptDetail', {
          ...(item.mediaSay ? item.mediaSay : {}),
          groupName: get(item, 'mediaSayGroup.name') || '',
        })
      }
    }
  }

  const sendChartData = useMemo(() => {
    return sendTops.map((item) => ({
      ...item,
      name: item.mediaSay ? item.mediaSay.name : get(item, 'mediaInfo.title'),
    }))
  }, [sendTops])
  return (
    <>
      <DetailTalkScriptDrawer
        title="话术详情"
        visible={visibleMap.talkScriptDetailVisible}
        data={modalInfo.data}
        onCancel={closeModal}
      />
      <MaterialDetail
        title="素材详情"
        visible={visibleMap.materialDetailVisible}
        data={modalInfo.data}
        onCancel={closeModal}
      />
      <div className={styles['material-statics']}>
        <div className={styles['material-header']}>
          <div className={styles['material-title']}>素材统计</div>
          <div className={styles['material-index']}>
            <DescriptionsList mode="wrap">
              <DescriptionsList.Item
                label="今日发送次数"
                className={styles['desc-item']}>
                <span className={styles['num-item']}>
                  {formatNumber(todayStaticsData.sendCount)}
                </span>
              </DescriptionsList.Item>
              <DescriptionsList.Item
                label="今日浏览次数"
                className={styles['desc-item']}>
                <span className={styles['num-item']}>
                  {formatNumber(todayStaticsData.lookCount)}
                </span>
              </DescriptionsList.Item>
            </DescriptionsList>
          </div>
        </div>
        {/* <Demo/> */}
        <div className={styles['material-body']}>
          <Row>
            <Col span={12} className={styles['left-side']}>
              <ChartItem
                title="发送TOP5"
                options={chartOptions}
                onOptionsChange={onSendTopsOptionsChange}
                optionValue={sendOption}>
                <BarChart
                  wrapStyle={{
                    position: 'relative',
                  }}
                  dataSource={sendChartData}
                  loading={sendTopsLoading}
                  fieldNames={{
                    label: 'name',
                    value: 'count',
                  }}
                  chartOption={{
                    color: ['#306FDB'],
                    yAxis: {
                      axisLabel: {
                        width: 120,
                        overflow: 'truncate',
                        backgroundColor: 'transparent',
                      },
                    },
                  }}
                  showTip={true}
                  tipRef={(r) => (sendChartTipRef.current = r)}
                  chartRef={(r) => (sendChartRef.current = r)}
                />
              </ChartItem>
            </Col>
            <Col span={12} className={styles['right-side']}>
              <ChartItem
                title="浏览TOP5"
                options={chartOptions}
                optionValue={visitOption}
                onOptionsChange={onVisitTopsOptionsChange}>
                <BarChart
                  dataSource={visitTops}
                  loading={visitLoading}
                  wrapStyle={{
                    position: 'relative',
                  }}
                  fieldNames={{
                    label: 'mediaInfo.title',
                    value: 'count',
                  }}
                  chartOption={{
                    yAxis: {
                      axisLabel: {
                        width: 180,
                        overflow: 'truncate',
                        backgroundColor: 'transparent',
                      },
                    },
                    color: ['#57A65B'],
                  }}
                  showTip={true}
                  tipRef={(r) => (visitChartTipRef.current = r)}
                  chartRef={(r) => (visitChartRef.current = r)}
                />
              </ChartItem>
            </Col>
          </Row>
        </div>
      </div>
    </>
  )
}
