import React, { useContext } from 'react'
import cls from 'classnames'
import styles from './index.module.less'

const StepContext = React.createContext({
  currentStep: 1,
})
/**
 * 
 * @param {String} mode 对齐方式， 默认为左对齐，left center  
 * @returns 
 */
const Steps = ({ children, current, className, mode = 'left' }) => {
  return (
    <div className={cls({
      [styles['steps-container']]: true,
      [styles['steps-container-center']]: Array.isArray(children) && children.length === 1,
      [className]: className,
    })}>
      <StepContext.Provider value={{ currentStep: current, mode }}>
        {children}
      </StepContext.Provider>
    </div>
  )
}

const StepItem = ({ title, children, sort, isLast }) => {
  const { currentStep = 1, mode} = useContext(StepContext)
  return (
    <div
      className={cls({
        [styles['step-center-mode-item']]: mode === 'center',
        [styles['step-item']]: true,
        [styles['step-single-item']]: currentStep === 1 && isLast,
        [styles['step-last-item']]: isLast,
        [styles['disabled-step-item']]: sort > currentStep,
      })}>
      <div className={styles['step-item-header']}>
        {mode === 'center' && isLast ?  <p className={styles['step-item-line']}/>: null}
        <div className={styles['step-title-container']}>
          <span className={styles['step-count']}>{sort}</span>
          <span className={styles['step-name']}>{title}</span>
        </div>
        {isLast ? null: <p className={styles['step-item-line']}/>}
      </div>
      <div className={styles['step-content-wrap']}>
        <div className={styles['step-item-content']}>{children}</div>
      </div>
    </div>
  )
}

Steps.Step = StepItem
export default Steps
