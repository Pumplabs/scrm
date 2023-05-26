import { useState, useMemo, useEffect, useContext } from 'react'
import moment from 'moment'
import { CloseCircleFill } from 'antd-mobile-icons'
import { Button, DatePicker, Input, Form, TextArea } from 'antd-mobile'
import { isEmpty } from 'lodash'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useRequest } from 'ahooks'
import { MobXProviderContext, observer } from 'mobx-react'
import DetailCard from 'components/DetailCard'
import useGetCurCustomerHook from '../useGetCurCustomerHook'
import { EditCustomerInfo } from 'src/services/modules/customer'
import { actionRequestHookOptions } from 'src/services/utils'
import { fillZero } from 'src/utils'
import { useBack } from 'src/hooks'
import styles from './index.module.less'
const getTimePrecisionByDate = (time) => {
  return {
    year: time.getFullYear(),
    month: time.getMonth() + 1,
    date: time.getDate(),
  }
}
export default observer(() => {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { UserStore } = useContext(MobXProviderContext)
  const curUserStaffId = UserStore.userData.id
  const userStaffId =  searchParams.get('staffId') || curUserStaffId
  const { customerInfo, loading } = useGetCurCustomerHook({
    staffId: userStaffId
  })

  const backUrl = useMemo(() => {
    return `/customerDetail` + window.location.search
  }, [])

  useBack({
    backUrl
  })

  useEffect(() => {
    const info = customerInfo.customerInfo
    if (!isEmpty(info)) {
      form.setFieldsValue({
        tel: info.phoneNumber ? info.phoneNumber : '',
        email: info.email ? info.email : '',
        birthday: info.birthday ? new Date(info.birthday) : undefined,
        address: info.address ? info.address : '',
        corpName: info.corpName ? info.corpName : '',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerInfo])

  const { run: runEditCustomerInfo, loading: editLoading } = useRequest(
    EditCustomerInfo,
    {
      manual: true,
      ...actionRequestHookOptions({
        actionName: '保存',
        successFn: () => {
          navigate(backUrl)
        },
      }),
    }
  )

  const onSave = () => {
    const vals = form.getFieldsValue()
    let timeStr = ''
    if (vals.birthday) {
      const {
        year: curYear,
        month: curMonth,
        date,
      } = getTimePrecisionByDate(vals.birthday)
      timeStr = `${curYear}-${fillZero(curMonth)}-${fillZero(date)}`
    }
    const params = {
      birthday: timeStr,
      email: vals.email,
      customerId: customerInfo.id,
      phoneNumber: vals.tel,
      address: vals.address,
      corpName: vals.corpName,
      staffId: userStaffId
    }
    runEditCustomerInfo(params)
  }

  const { year, month, date } = useMemo(() => {
    const time = moment()
    const year = time.year()
    const month = time.month() + 1
    const date = time.date()
    return {
      year,
      month,
      date,
    }
  }, [])
  return (
    <DetailCard
      title="基本信息"
      backUrl={backUrl}
      loading={loading}
      extra={
        <Button
          color="primary"
          fill="solid"
          className={styles['right-action']}
          onClick={onSave}
          loading={editLoading}>
          确定
        </Button>
      }>
      <Form form={form} layout="horizontal">
        <Form.Item name="tel" label="电话">
          <Input
            bordered={false}
            placeholder="请输入电话"
            clearable
            maxLength={20}
          />
        </Form.Item>
        <Form.Item name="email" label="Email">
          <Input placeholder="请输入Email" clearable maxLength={50} />
        </Form.Item>
        <DatePickerInputItem
        pickerProps={
          {
            filter:{
              year: function (val) {
                return val <= year
              },
              month: function (val, time) {
                const { year: curYear } = getTimePrecisionByDate(time.date)
                return curYear === year ? val <= month : true
              },
              day: function (val, time) {
                const { year: curYear, month: curMonth } =
                  getTimePrecisionByDate(time.date)
                if (curYear === year && curMonth === month) {
                  return val <= date
                } else {
                  return true
                }
              },
            },
            min: new Date('1900-01-01 00:00:00')
          }
        }
        formProps={{
          name: 'birthday',
          label: '生日'
        }}
        />
        <Form.Item name="address" label="地址">
          <TextArea
            placeholder="请输入地址"
            clearable
            maxLength={200}
            rows={6}
            autoSize
          />
        </Form.Item>
        <Form.Item name="corpName" label="公司">
          <TextArea
            placeholder="请输入公司"
            clearable
            maxLength={50}
            rows={3}
            autoSize
          />
        </Form.Item>
      </Form>
    </DetailCard>
  )
})


const DatePickerInputItem = ({ formProps = {}, pickerProps = {}}) => {
  const [pickerVisible, setPickerVisible] = useState(false)
  return (
    <Form.Item
      noStyle
      shouldUpdate={(prevValues, curValues) =>
        prevValues[formProps.name] !== curValues[formProps.name]
      }
    >
      {({ getFieldValue, setFieldsValue }) => (
        <Form.Item
          trigger='onConfirm'
          {...formProps}
          arrow={
            getFieldValue(formProps.name) ? (
              <CloseCircleFill
                style={{
                  color: 'var(--adm-color-light)',
                  fontSize: 14,
                }}
                onClick={e => {
                  e.stopPropagation()
                  setFieldsValue({ [formProps.name]: null })
                }}
              />
            ) : (
              true
            )
          }
          onClick={() => {
            setPickerVisible(true)
          }}
        >
          <DatePicker
            visible={pickerVisible}
            onClose={() => {
              setPickerVisible(false)
            }}
            {...pickerProps}
          >
            {value =>
              value ? moment(value).format('YYYY-MM-DD') : '请选择日期'
            }
          </DatePicker>
        </Form.Item>
      )}
    </Form.Item>
  )
}
