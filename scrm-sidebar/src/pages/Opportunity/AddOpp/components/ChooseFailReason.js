import { useState, useEffect } from 'react'
import MyPopup from 'components/MyPopup'
import { useRequest } from 'ahooks'
import RadioGroupList from './RadioGroupList'
import { GetConfigAllList } from 'services/modules/opportunity'

export default (props) => {
  const { visible, onOk, data = {}, ...rest } = props
  const { data: failReasonList = [] } = useRequest(GetConfigAllList, {
    defaultParams: [
      {
        typeCode: 'OPPORTUNITY_FAIL_REASON',
      },
    ],
  })
  const [reasonId, setReasonId] = useState('')

  useEffect(() => {
    if (visible) {
      setReasonId(data.value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onReasonChange = (val) => {
    setReasonId(val)
  }

  const handleOk = () => {
    if (typeof onOk === 'function') {
      const item = failReasonList.find((ele) => ele.id === reasonId)
      onOk(reasonId, item)
    }
  }

  return (
    <MyPopup title={'选择失败原因'} visible={visible} onOk={handleOk} {...rest}>
      <div style={{ height: '40vh', overflowY: 'auto' }}>
        <RadioGroupList
          list={failReasonList}
          value={reasonId}
          onChange={onReasonChange}
          fieldNames={{
            label: 'name',
            value: 'id',
          }}
        />
      </div>
    </MyPopup>
  )
}
