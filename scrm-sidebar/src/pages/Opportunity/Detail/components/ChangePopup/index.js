import { useState, useEffect } from 'react'
import { Radio } from 'antd-mobile'
import MyPopup from 'components/MyPopup'
import styles from './index.module.less'

export default ({ visible, stageId, stageList = [], onOk, ...rest }) => {
  const [curStage, setCurStage] = useState('')
  useEffect(() => {
    if (visible) {
      setCurStage(stageId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const onStageChange = (ele) => {
    setCurStage(ele.id)
  }
  const handleOk = () => {
    if (typeof onOk === 'function') {
      onOk(curStage)
    }
  }
  const hasChange = curStage && curStage !== stageId
  return (
    <MyPopup
      visible={visible}
      {...rest}
      title="选择阶段"
      okProps={{
        disabled: !hasChange,
      }}
      onOk={handleOk}>
      <div className={styles['popup-content']}>
        <Radio.Group value={curStage}>
          {stageList.map((ele) => {
            return (
              <div
                key={ele.id}
                className={styles['stage-item']}
                onClick={() => onStageChange(ele)}>
                <Radio value={ele.id}>{ele.name}</Radio>
              </div>
            )
          })}
        </Radio.Group>
      </div>
    </MyPopup>
  )
}
