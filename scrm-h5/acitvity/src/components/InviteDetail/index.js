import { useMemo, useState } from 'react'
import cls from 'classnames'
import Dialog from 'src/components/Dialog'
import Steps from 'src/components/Steps'
import Tabs from 'src/components/Tabs'
import PowerUserItem from 'src/components/PowerUserItem'
import SingleStage from './SingleStage'
import ReceviceBtn from './ReceviceBtn'
import styles from './index.module.less'

const { TabPane } = Tabs
const { Step } = Steps
export default ({ className, stageList = [], powerUsers = [], isExpired }) => {
  const [displayData, setDisplayData] = useState({})
  const onPrize = (stageData) => {
    setDisplayData(stageData)
  }

  const onClose = () => {
    setDisplayData({})
  }

  const { currentStep, successCount, stageArr } = useMemo(() => {
    const { res, successCount, step } = stageList.reduce(
      (preRes, item) => {
        const { res, preTotal, successCount, step } = preRes
        // 阶段人数
        const count = item.fissionStage ? item.fissionStage.num : 0
        const nextCount = count + preTotal
        // 是否可以领奖
        const shouldPrize = item.hasFinish && !item.hasPrize

        return {
          res: [
            ...res,
            {
              ...item,
              sum: nextCount,
              shouldPrize,
              // 是否已领奖
              prized: item.hasFinish && item.hasPrize,
            },
          ],
          step: !item.hasFinish && step === 0 ? item.stage : step,
          successCount: successCount + (item.hasFinish ? item.successNum : 0),
          preTotal: nextCount,
        }
      },
      { res: [], preTotal: 0, successCount: 0, step: 0 }
    )
    return {
      stageArr: res,
      // 当前阶段
      currentStep: step === 0 && res.length > 0 ? res.length : step,
      // 已成功邀请的数量
      successCount,
    }
  }, [stageList])
  const visible = !!displayData.id

  return (
    <>
      <Dialog title="领取奖品" visible={visible} onClose={onClose}>
        <div className={styles['qcode-box']}>
          <p className={styles['tip']}>恭喜你完成任务，扫描领取奖励吧</p>
          <img
            src={displayData.fissionStage && displayData.fissionStage.qrCode}
            alt=""
            className={styles['qcode-img']}
          />
          <p className={styles['tip']}>长按识别二维码添加微信</p>
        </div>
      </Dialog>
      <Tabs
        names={['邀请有礼', '邀请记录']}
        className={cls({
          [styles['invite-section']]: true,
          [className]: className,
        })}>
        <TabPane>
          {stageArr.length > 1 ? (
            <MoreStage
              successCount={successCount}
              currentStep={currentStep}
              stageArr={stageArr}
              onPrize={onPrize}
            />
          ) : (
            <SingleStage
              successCount={successCount}
              stageArr={stageArr}
              onPrize={onPrize}
            />
          )}
        </TabPane>
        <TabPane>
          <div className={styles['power-user-section']}>
            {powerUsers.length ? (
              powerUsers.map((ele) => <PowerUserItem key={ele.id} data={ele} />)
            ) : (
              <p className={styles['no-power-user']}>
                {isExpired ? '暂无好友助力' : '暂无好友助力,快去邀请好友吧'}
              </p>
            )}
          </div>
        </TabPane>
      </Tabs>
    </>
  )
}
const MoreStage = ({ successCount, currentStep, stageArr, onPrize }) => {
  const maxIdx = stageArr.length - 1
  return (
    <div className={styles['stage-content']}>
      <p className={styles['current-invite-tip']}>
        当前已成功邀请{successCount}人
      </p>
      <Steps current={currentStep} className={styles['invite-progress']}>
        {stageArr.map((ele, idx) => {
          return (
            <Step
              title={`邀${ele.sum}人`}
              sort={ele.stage}
              key={ele.id}
              isLast={idx === maxIdx}>
              <ReceviceBtn
                disabled={!ele.shouldPrize}
                onClick={() => {
                  if (ele.shouldPrize && typeof onPrize === 'function') {
                    onPrize(ele)
                  }
                }}>
                {ele.prized ? '已领取' : '领取'}
              </ReceviceBtn>
            </Step>
          )
        })}
      </Steps>
    </div>
  )
}
