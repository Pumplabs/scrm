import { useState, useEffect } from 'react'
import { useRequest } from 'ahooks'
import MyPopup from 'components/MyPopup'
import RadioGroupList from 'components/RadioGroupList'
import { GetConfigAllList } from 'services/modules/opportunity'

export default (props) => {
  const { visible, onOk, list = [], data = {}, ...rest } = props
  const { data: stageList = [], run: runGetStageList } = useRequest(
    GetConfigAllList,
    {
      manual: true,
    }
  )
  const [stageId, setStageId] = useState('')

  useEffect(() => {
    if (visible) {
      setStageId(data.value)
    }
    if (data.groupId) {
      runGetStageList({
        groupId: data.groupId,
        typeCode: 'OPPORTUNITY_STAGE',
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onStageChange = (val) => {
    setStageId(val)
  }

  const handleOk = () => {
    if (typeof onOk === 'function') {
      const item = stageList.find((ele) => ele.id === stageId)
      onOk(stageId, item)
    }
  }

  return (
    <MyPopup title={'选择阶段'} visible={visible} onOk={handleOk} {...rest}>
      <div style={{ height: '40vh', overflowY: 'auto' }}>
        <RadioGroupList
          list={stageList}
          value={stageId}
          onChange={onStageChange}
          fieldNames={{
            label: 'name',
            value: 'id',
          }}
        />
      </div>
    </MyPopup>
  )
}
