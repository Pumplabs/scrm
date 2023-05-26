import { useState } from 'react'
import { Spin } from 'antd'
import { useRequest } from 'ahooks'
import { SettingOutlined } from '@ant-design/icons'
import StaticsBox from 'components/StaticsBox'
import { GetLossingStatisticsData } from 'services/modules/lossingCustomeHistory'
import SettingModal from './SettingModal'
import { formatNumber } from 'utils'

export default () => {
  const [visible, setVisible] = useState(false)
  const { data: statisticsData = {}, loading } = useRequest(
    GetLossingStatisticsData
  )
  const onSetting = () => {
    setVisible(true)
  }
  const onCancel = () => {
    setVisible(false)
  }
  return (
    <>
      <Spin spinning={loading}>
        <div style={{ marginBottom: 10 }}>
          <SettingOutlined onClick={onSetting} style={{marginRight: 6}}/>
          通知设置
        </div>
        <SettingModal footer={null} visible={visible} onCancel={onCancel} />
        <StaticsBox
          dataSource={[
            {
              label: formatNumber(statisticsData.total),
              desc: '总流失客户数',
            },
            {
              label: formatNumber(statisticsData.last30DayTotal),
              desc: '近30天流失数',
            },
            {
              label: formatNumber(statisticsData.last7DayTotal),
              desc: '近7天流失数',
            },
            {
              label: formatNumber(statisticsData.todayTotal),
              desc: '今日流失数',
            },
          ]}
        />
      </Spin>
    </>
  )
}
