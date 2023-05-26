import ReceviceBtn from '../ReceviceBtn'
import gifSrc from 'src/assets/image/gif.png'
import styles from './index.module.less'
export default ({ successCount, stageArr, onPrize }) => {
  return (
    <div className={styles['single-stage-content']}>
      <p className={styles['invite-tip']}>
        当前已成功邀请{successCount}人
      </p>
      {stageArr.map((ele) => (
        <div key={ele.id} className={styles['stage-item']}>
          <img src={gifSrc} alt="" className={styles['gif-icon']}/>
         {ele.needNum > 0 ?  <p className={styles['need-invite-tip']}>成功邀请{ele.needNum}人即可获得奖励</p> : null}
          <ReceviceBtn
            disabled={!ele.shouldPrize}
            onClick={() => {
              if (ele.shouldPrize && typeof onPrize === 'function') {
                onPrize(ele)
              }
            }}>
            {ele.prized ? '已领取' : '领取'}
          </ReceviceBtn>
        </div>
      ))}
    </div>
  )
}
