import { useEffect, useState } from 'react'
import { Radio } from 'antd-mobile'
import { useRequest } from 'ahooks'
import MyPopup from 'components/MyPopup'
import { GetOppStageByGroupId } from 'services/modules/opportunity'
import styles from './index.module.less'

export default ({ visible, onOk, ...rest }) => {
  const [type, setType] = useState('')
  const { data: failReasonList = [] } = useRequest(GetOppStageByGroupId, {
    defaultParams: [
      {
        typeCode: 'OPPORTUNITY_FAIL_REASON',
      },
    ],
  })
  useEffect(() => {
    if (visible && failReasonList[0]) {
      setType(failReasonList[0].id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onTypeChange = (item) => {
    setType(item.id)
  }
  const handleOk = () => {
    if (typeof onOk === 'function') {
      onOk(type)
    }
  }
  return (
    <MyPopup
      visible={visible}
      {...rest}
      popupBodyClassName={styles['popup-content']}
      title="请选择输单原因"
      onOk={handleOk}>
      <Radio.Group value={type}>
        {failReasonList.map((ele) => {
          return (
            <div
              key={ele.id}
              className={styles['stage-item']}
              onClick={() => onTypeChange(ele)}>
              <Radio value={ele.id}>{ele.name}</Radio>
            </div>
          )
        })}
      </Radio.Group>
    </MyPopup>
  )
}
