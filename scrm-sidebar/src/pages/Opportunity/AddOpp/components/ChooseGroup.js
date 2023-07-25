import { useState, useEffect } from 'react'
import MyPopup from 'components/MyPopup'
import { useRequest } from 'ahooks'
import RadioGroupList from 'components/RadioGroupList'
import { GetGroupList } from 'services/modules/opportunity'

export default (props) => {
  const { visible, onOk, data = {}, ...rest } = props
  const { data: groupList, loading: groupListLoading } =
    useRequest(GetGroupList)
  const [groupId, setGroupId] = useState('')

  useEffect(() => {
    if (visible) {
      setGroupId(data.value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onGroupChange = (val) => {
    setGroupId(val)
  }

  const handleOk = () => {
    if (typeof onOk === 'function') {
      const item = groupList.find((ele) => ele.id === groupId)
      onOk(groupId, item)
    }
  }

  return (
    <MyPopup title={'选择分组'} visible={visible} onOk={handleOk} {...rest}>
      <div style={{ height: '40vh', overflowY: 'auto' }}>
        <RadioGroupList
          list={groupList}
          value={groupId}
          onChange={onGroupChange}
          fieldNames={{
            label: 'name',
            value: 'id',
          }}
        />
      </div>
    </MyPopup>
  )
}
