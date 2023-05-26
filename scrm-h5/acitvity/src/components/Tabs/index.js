import cls from 'classnames'
import React, { useState } from 'react'
import styles from './index.module.less'

const Tabs = ({ names = [], children, className }) => {
  const [activeKey, setActiveKey] = useState(0)
  const onSelectTab = (idx) => {
    setActiveKey(idx)
  }
  return (
    <div className={cls({
      [styles['tabs']]: true,
      [className]: className
    })}>
      <ul className={styles['tab-name-list']}>
        {names.map((ele, idx) => (
          <li key={idx}
          onClick={() => onSelectTab(idx)}
          className={cls({
            [styles['tab-name-item']]: true,
            [styles['active-name-item']]: activeKey === idx
          })}>
            <span className={styles['tabpane-title']}>{ele}</span>
          </li>
        ))}
      </ul>
      <div className={styles['tab-content']}>
        {React.Children.map(children, (child, idx) => {
          return (
            <div key={idx} className={cls({
              [styles[`tab-panle-${idx}`]]: true,
              [styles[`hide-tab-panle`]]: idx !== activeKey,
            })}>
              {child}
            </div>
          )
        })}
      </div>
    </div>
  )
}

const TabPane = ({ children }) => {
  return (
    <div
      className={cls({
        [styles['tabpane']]: true,
        [styles['tabpane-active']]: true,
      })}>
      {children}
    </div>
  )
}
export default Tabs
Tabs.TabPane = TabPane
