import { useEffect, useMemo, useState } from 'react'
import { Skeleton } from 'antd-mobile'
import { useParams, useNavigate } from 'react-router-dom'
import { decode } from 'js-base64'
import { useRequest } from 'ahooks'
import List from 'components/List'
import { RadioGroup } from 'components/MyRadio'
import LazyTabPanle from 'components/LazyTabPanle'
import StatusItem from '../StatusItem'
import UserStat from './UserStat'
import CustomerStat from './CustomerStat'
import { useBack } from 'src/hooks'
import { GetMassDetail } from 'src/services/modules/customerMass'
import { getMassName } from '../utils'
import { SEND_STATUS_VAL } from '../constants'
import styles from './index.module.less'

const tabOptions = [
  {
    label: '员工统计',
    value: 'user',
  },
  {
    label: '客户统计',
    value: 'customer',
  },
]
const MyPageContent = ({ loading, children }) => {
  if (loading) {
    return (
      <div>
        <Skeleton.Title animated />
        <Skeleton.Paragraph lineCount={5} animated />
      </div>
    )
  }
  return children
}
export default () => {
  const [tab, setTab] = useState('user')
  const { id } = useParams()
  const navigate = useNavigate()
  const {
    run: runGetMassDetail,
    data: massData = {},
    loading,
  } = useRequest(GetMassDetail, {
    manual: true,
  })

  const massId = useMemo(() => {
    return decode(id)
  }, [id])
  useBack({
    backUrl: `/customerMass`
  })
  useEffect(() => {
    if (massId) {
      runGetMassDetail({
        id: massId,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [massId])

  const onDetail = () => {
    navigate(`/customerMassInfoDetail/${id}`)
  }

  const onTabChange = (key) => {
    setTab(key)
  }
  return (
    <MyPageContent loading={loading}>
      <div className={styles['detail-page']}>
        <div>
          <List className={styles['mass-item']}>
            <List.Item
              onClick={onDetail}
              title="群发名称"
              extra={
                <StatusItem data={massData} statusVals={SEND_STATUS_VAL} />
              }
            >
              {getMassName(massData)}
            </List.Item>
          </List>
        </div>
        <div>
          <RadioGroup
            className={styles['radio-tabs']}
            options={tabOptions}
            activeKey={tab}
            onChange={onTabChange}
          />
          <LazyTabPanle activeKey={tab} tab="user">
            <UserStat data={massData} />
          </LazyTabPanle>
          <LazyTabPanle activeKey={tab} tab="customer">
            <CustomerStat data={massData} />
          </LazyTabPanle>
        </div>
      </div>
    </MyPageContent>
  )
}
