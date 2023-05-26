import { useEffect, useRef, forwardRef, useState } from 'react'
import { Steps, Form, Button, Dialog } from 'antd-mobile'
import cls from 'classnames'
import { useRequest } from 'ahooks'
import MyPopup from 'components/MyPopup'
import {
  GetJourneyList,
  GetJourneyAllStage,
} from 'services/modules/customerJourney'
import styles from './index.module.less'

const { Step } = Steps
export default (props) => {
  const { onCancel, visible, onOk, stageStep, ...rest } = props
  const [step, setStep] = useState(-1)
  const hasVisible = useRef()
  useRequest(GetJourneyList, {
    onSuccess: (res) => {
      const record = res.list[0]
      if (record) {
        runGetJourneyAllStage({
          journeyId: record.id,
        })
      }
    },
  })
  const { run: runGetJourneyAllStage, data: stageData = [] } = useRequest(
    GetJourneyAllStage,
    {
      manual: true,
    }
  )

  useEffect(() => {
    if (!visible && hasVisible.current) {
      setStep(-1)
    }
    if (visible && !hasVisible.current) {
      hasVisible.current = true
    }
    if (visible) {
      setStep(stageStep)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleOk = () => {
    const stageId = step === -1 ? '' : stageData[step].id
    if (typeof onOk === 'function') {
      onOk({
        step,
        stageId,
      })
    }
  }

  const onClearJourney = async () => {
    const result = await Dialog.confirm({
      content: `确定要将客户从旅程中移除吗`,
    })
    if (result) {
      if (typeof onOk === 'function') {
        onOk({
          step: -1,
          stageId: ''
        })
      }
    }
  }

  const onStepChange = (val) => {
    setStep(val)
  }
  const hasChange = stageStep !== step
  return (
    <MyPopup
      title={'修改阶段'}
      visible={visible}
      onCancel={onCancel}
      okClassName={cls({
        [styles['disabled-ok-btn']]: !hasChange,
      })}
      cancelProps={{
        style: {
          display: 'none',
        },
      }}
      okProps={{
        style: {
          display: 'none',
        },
      }}
      onOk={handleOk}
      {...rest}>
      <div className={styles['form-content']}>
        <StepsFormItem
          stageList={stageData}
          current={step}
          onChange={onStepChange}
        />
      </div>
      <div className={styles['popup-footer']}>
        <Button type="text" size="small" onClick={onCancel}>
          取消
        </Button>
        <div>
          <Button
            color="danger"
            onClick={onClearJourney}
            className={styles['remove-btn']}
            disabled={stageStep === -1}
            fill="none">
            移除旅程
          </Button>
          <Button
            color="primary"
            size="small"
            className={styles['ok-button']}
            disabled={!hasChange}
            onClick={handleOk}
            >
            确定
          </Button>
        </div>
      </div>
    </MyPopup>
  )
}

const Dot = ({ isDone, onClick }) => {
  return (
    <span
      onClick={onClick}
      className={cls({
        [styles['dot-item']]: true,
        [styles['done-dot']]: isDone,
        [styles['undone-dot']]: !isDone,
      })}
    />
  )
}
const StepsFormItem = forwardRef(
  ({ stageList = [], onChange, current }, ref) => {
    const handleChange = (stepCount) => {
      if (typeof onChange === 'function') {
        onChange(stepCount)
      }
    }
    const onClickTitle = (idx) => {
      handleChange(idx)
    }
    const onClickDot = (idx) => {
      handleChange(idx)
    }
    return (
      <div ref={ref}>
        <Steps direction="vertical" current={current}>
          {stageList.map((ele, idx) => (
            <Step
              icon={
                <Dot isDone={idx <= current} onClick={() => onClickDot(idx)} />
              }
              title={
                <span
                  onClick={() => {
                    onClickTitle(idx)
                  }}>
                  {ele.name}
                </span>
              }
              key={ele.id}
            />
          ))}
        </Steps>
      </div>
    )
  }
)
