import {
  useEffect,
  useState,
  useRef,
  useMemo,
  forwardRef,
  useImperativeHandle,
} from 'react'
import { Row, Col, Radio, DatePicker, Button } from 'antd'
import moment from 'moment'
import { useRequest } from 'ahooks'
import { get } from 'lodash'
import { Table } from 'components/TableContent'
import UserTag from 'components/UserTag'
import WeChatCell from 'components/WeChatCell'
import DescriptionsList from 'components/DescriptionsList'
import { LineChart } from 'components/MyChart'
import {
  GetChannelCodeIndexStatic,
  GetChannelCodeStaticsByTime,
  GetChannelCodeStaticsByUser,
  GetChannelCodeStaticsByCustomer,
  ExportCustomer,
  ExportDate,
  ExportUser,
} from 'services/modules/channelQrCode'
import { exportByLink } from 'services/utils'
import { handleTimes } from 'utils/times'
import styles from './index.module.less'

const TREND_TIME_EN = {
  SEVEN: 'seven',
  THIRTY: 'thirty',
  DEFINED: 'defined',
}
const TIME_VALS = {
  [TREND_TIME_EN.SEVEN]: [moment().subtract(6, 'days'), moment()],
  [TREND_TIME_EN.THIRTY]: [moment().subtract(29, 'days'), moment()],
}
const trendOptions = [
  {
    label: '近7日',
    value: TREND_TIME_EN.SEVEN,
    times: [moment().subtract(6, 'days'), moment()],
  },
  {
    label: '近30日',
    value: TREND_TIME_EN.THIRTY,
    times: [moment().subtract(29, 'days'), moment()],
  },
  {
    label: '自定义',
    value: TREND_TIME_EN.DEFINED,
    times: [moment(), moment()],
  },
]
const TABLE_TYPE_EN = {
  USER: 'user',
  CUSTOMER: 'customer',
  DATE: 'date',
}
const detailOptions = [
  {
    label: '客户',
    value: TABLE_TYPE_EN.CUSTOMER,
  },
  {
    label: '员工',
    value: TABLE_TYPE_EN.USER,
  },
  {
    label: '日期',
    value: TABLE_TYPE_EN.DATE,
  },
]

const customerColumns = [
  {
    title: '客户名称',
    dataIndex: 'customer',
    render: (val) => <WeChatCell data={val} />,
  },
  {
    title: '添加员工',
    dataIndex: 'staff',
    render: (val) => <UserTag data={val} />,
  },
  {
    title: '状态',
    dataIndex: 'hasDelete',
    render: (val) => (val ? '已流失' : '未流失'),
  },
  {
    title: '添加时间',
    dataIndex: 'createTime',
  },
]
const userColumns = [
  {
    title: '员工名称',
    dataIndex: 'staff',
    render: (val) => <UserTag data={val} />,
  },
  {
    title: '添加客户总数',
    dataIndex: 'totalNum',
  },
  {
    title: '流失数',
    dataIndex: 'loseNum',
  },
  {
    title: '净添加客户数',
    dataIndex: 'actualNum',
  },
]
const dateColumns = [
  {
    title: '日期',
    dataIndex: 'dateStr',
  },
  {
    title: '添加客户总数',
    dataIndex: 'totalNum',
  },
  {
    title: '流失数',
    dataIndex: 'loseNum',
  },
  {
    title: '净添加客户数',
    dataIndex: 'actualNum',
  },
]
const columnsConfig = {
  customer: customerColumns,
  user: userColumns,
  date: dateColumns,
}

const getTrendTimeParams = (vals = {}) => {
  const times =
    vals.type === TREND_TIME_EN.DEFINED ? vals.times : TIME_VALS[vals.type]
  const [start = '', end = ''] = handleTimes(times, { searchTime: true })
  return {
    start,
    end,
  }
}
export default ({ data = {} }) => {
  const tableStatics = useRef({})
  const timeOptionRef = useRef()
  const { run: runGetChannelCodeIndexStatic, data: indexDta = {} } = useRequest(
    GetChannelCodeIndexStatic,
    {
      manual: true,
    }
  )
  const {
    run: runGetChannelCodeStaticsByTime,
    data: trendData = [],
    loading: timeTrendLoading,
  } = useRequest(GetChannelCodeStaticsByTime, {
    manual: true,
  })
  // 按时间
  const {
    run: runGetChannelDetailByTime,
    data: allTimeData = [],
    loading: timeLoading,
  } = useRequest(GetChannelCodeStaticsByTime, {
    manual: true,
    onFinally: () => {
      tableStatics.current[TABLE_TYPE_EN.DATE] = true
    },
  })
  // 按客户
  const {
    run: runGetChannelCodeStaticsByCustomer,
    data: customerData = [],
    loading: customerLoading,
  } = useRequest(GetChannelCodeStaticsByCustomer, {
    manual: true,
    onFinally: () => {
      tableStatics.current[TABLE_TYPE_EN.CUSTOMER] = true
    },
  })
  // 按员工
  const {
    run: runGetChannelCodeStaticsByUser,
    data: userData = [],
    loading: userLoading,
  } = useRequest(GetChannelCodeStaticsByUser, {
    manual: true,
    onFinally: () => {
      tableStatics.current[TABLE_TYPE_EN.USER] = true
    },
  })
  const [detailType, setDetailType] = useState('customer')
  useEffect(() => {
    if (!data.id) {
      tableStatics.current = {}
      setDetailType('customer')
      if (timeOptionRef.current) {
        timeOptionRef.current.resetVal()
      }
    } else {
      runGetChannelCodeIndexStatic({
        contactWayId: data.id,
        state: data.state,
      })
      runGetChannelCodeStaticsByCustomer({
        contactWayId: data.id,
        state: data.state,
      })
      runGetChannelCodeStaticsByTime({
        contactWayId: data.id,
        state: data.state,
        ...getTrendTimeParams(),
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.id])

  const onTimeOptionChange = (vals) => {
    if (data.id) {
      runGetChannelCodeStaticsByTime({
        contactWayId: data.id,
        state: data.state,
        ...getTrendTimeParams(vals),
      })
    }
  }

  const onDetailTypeChange = (e) => {
    const type = e.target.value
    switch (type) {
      case TABLE_TYPE_EN.CUSTOMER:
        if (!tableStatics.current[type]) {
          runGetChannelCodeStaticsByCustomer({
            contactWayId: data.id,
            state: data.state,
          })
        }
        break
      case TABLE_TYPE_EN.DATE:
        if (!tableStatics.current[type]) {
          runGetChannelDetailByTime({
            contactWayId: data.id,
            state: data.state,
          })
        }
        break
      case TABLE_TYPE_EN.USER:
        if (!tableStatics.current[type]) {
          runGetChannelCodeStaticsByUser({
            contactWayId: data.id,
            state: data.state,
          })
        }
        break
      default:
        break
    }
    setDetailType(type)
  }

  const onExportData = async () => {
    let request = null
    switch (detailType) {
      case TABLE_TYPE_EN.CUSTOMER:
        request = ExportCustomer
        break
      case TABLE_TYPE_EN.USER:
        request = ExportUser
        break
      case TABLE_TYPE_EN.DATE:
        ExportDate({
          contactWayId: data.id,
          state: data.state,
        })
        break
      default:
        break
    }
    if (typeof request === 'function') {
      const res = await request({
        contactWayId: data.id,
        state: data.state,
      })
      if (res) {
        exportByLink(res)
      }
    }
  }

  const columns = columnsConfig[detailType]
  const trendKeys = [
    {
      name: '净客户数',
      key: 'actualNum',
    },
    {
      name: '流失数',
      key: 'loseNum',
    },
    {
      name: '总客户数',
      key: 'totalNum',
    },
  ]
  const tableLoading = useMemo(() => {
    switch (detailType) {
      case TABLE_TYPE_EN.CUSTOMER:
        return customerLoading
      case TABLE_TYPE_EN.USER:
        return userLoading
      case TABLE_TYPE_EN.DATE:
        return timeLoading
      default:
        return false
    }
  }, [detailType, customerLoading, userLoading, timeLoading])

  const { tableData, tableRowKey } = useMemo(() => {
    let res = {}
    switch (detailType) {
      case TABLE_TYPE_EN.CUSTOMER:
        res = {
          tableData: customerData,
          tableRowKey: (record) =>
            `${get(record, 'customer.id')}_${get(record, 'staff.id')}`,
        }
        break
      case TABLE_TYPE_EN.USER:
        res = {
          tableData: userData,
          tableRowKey: (record) => get(record, 'staff.id'),
        }
        break
      case TABLE_TYPE_EN.DATE:
        res = {
          tableData: allTimeData,
          tableRowKey: (record) => record.dateStr,
        }
        break
      default:
        res = {
          tableData: [],
        }
        break
    }
    return res
  }, [detailType, customerData, userData, allTimeData])

  return (
    <div className={styles['data-overview']}>
      <div className={styles['data-index-section']}>
        <DescriptionsList mode="wrap">
          <Row style={{ marginBottom: 20 }}>
            <Col span={8}>
              <DescriptionsList.Item label="总客户数">
                <span className={styles['count-item']}>
                  {get(indexDta, 'total.totalNum') || 0}
                </span>
              </DescriptionsList.Item>
            </Col>
            <Col span={8}>
              <DescriptionsList.Item label="流失数">
                <span className={styles['count-item']}>
                  {get(indexDta, 'total.loseNum') || 0}
                </span>
              </DescriptionsList.Item>
            </Col>
            <Col span={8}>
              <DescriptionsList.Item label="净客户数">
                <span className={styles['count-item']}>
                  {get(indexDta, 'total.actualNum') || 0}
                </span>
              </DescriptionsList.Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <DescriptionsList.Item label="今日添加客户总数">
                <span className={styles['count-item']}>
                  {get(indexDta, 'today.totalNum') || 0}
                </span>
              </DescriptionsList.Item>
            </Col>
            <Col span={8}>
              <DescriptionsList.Item label="今天流失数">
                <span className={styles['count-item']}>
                  {get(indexDta, 'today.loseNum') || 0}
                </span>
              </DescriptionsList.Item>
            </Col>
            <Col span={8}>
              <DescriptionsList.Item label="今天添加净客户数">
                <span className={styles['count-item']}>
                  {get(indexDta, 'today.actualNum') || 0}
                </span>
              </DescriptionsList.Item>
            </Col>
          </Row>
        </DescriptionsList>
      </div>
      <DataSection title="趋势">
        <TimeOption
          ref={(r) => (timeOptionRef.current = r)}
          options={trendOptions}
          defaultType={TREND_TIME_EN.SEVEN}
          otherType={TREND_TIME_EN.DEFINED}
          onChange={onTimeOptionChange}
        />
        <LineChart
          loading={timeTrendLoading}
          dataSource={trendData}
          fieldNames={{
            value: trendKeys,
            label: 'dateStr',
          }}
        />
      </DataSection>
      <DataSection title="明细">
        <div className={styles['detail-actions']}>
          <Radio.Group
            options={detailOptions}
            onChange={onDetailTypeChange}
            value={detailType}
            buttonStyle="solid"
            optionType="button"
            className={styles['radio-group']}
          />
          <Button
            ghost
            type="primary"
            className={styles['detail-export-btn']}
            onClick={onExportData}>
            导出数据
          </Button>
        </div>
        <div>
          <Table
            columns={columns}
            dataSource={tableData}
            loading={tableLoading}
            rowKey={tableRowKey}
          />
        </div>
      </DataSection>
    </div>
  )
}

/**
 *
 * @param {*} props
 * @returns
 */
const TimeOption = forwardRef((props, ref) => {
  const { options = [], otherType = '', defaultType, onChange } = props
  const [filterVals, setFilterVals] = useState({
    type: defaultType,
    times: [],
  })

  const typeTimesMap = useMemo(() => {
    let opt = {}
    options.forEach((ele) => {
      opt[ele.value] = ele.times || []
    })
    return opt
  }, [options])

  useEffect(() => {
    if (defaultType) {
      const item = options.find((item) => item.value === defaultType)
      setFilterVals({
        type: defaultType,
        times: item ? item.times : [],
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultType])

  const resetVal = () => {
    setFilterVals({
      type: defaultType,
      times: typeTimesMap[defaultType],
    })
  }

  useImperativeHandle(ref, () => ({
    resetVal,
  }))

  const handleChange = (vals) => {
    if (typeof onChange === 'function') {
      onChange(vals)
    }
  }

  const onTypeChange = (e) => {
    const type = e.target.value
    const data = {
      type,
      times: typeTimesMap[type],
    }
    setFilterVals((vals) => ({
      ...vals,
      ...data,
    }))
    handleChange({
      ...filterVals,
      ...data,
    })
  }

  // 自定义时间
  const onDefinedTimeChange = (val) => {
    const data = {
      type: otherType,
      times: val,
    }
    setFilterVals((vals) => ({
      ...vals,
      ...data,
    }))
    handleChange({
      ...filterVals,
      ...data,
    })
  }

  const disabledDate = (current) => {
    return current.isAfter(moment())
  }

  return (
    <div>
      <Radio.Group
        value={filterVals.type}
        onChange={onTypeChange}
        buttonStyle="solid"
        className={styles['radio-group']}>
        {options.map((item) => (
          <Radio.Button value={item.value} key={item.value}>
            {item.label}
          </Radio.Button>
        ))}
      </Radio.Group>
      <div className={styles['time-item']}>
        <span className={styles['time-item-label']}>时间</span>
        <DatePicker.RangePicker
          disabledDate={disabledDate}
          onChange={onDefinedTimeChange}
          value={filterVals.times}
          disabled={filterVals.type !== otherType}
        />
      </div>
    </div>
  )
})
const DataSection = ({ title, children }) => {
  return (
    <div className={styles['data-section']}>
      <p className={styles['data-section-title']}>{title}</p>
      <div className={styles['data-section-body']}>{children}</div>
    </div>
  )
}
