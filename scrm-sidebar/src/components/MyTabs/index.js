import React, { useEffect, useState, useRef } from 'react'
import cls from 'classnames'
import styles from './index.module.less'

const Tabs = (props) => {
  const { activeKey, onChange, children, className, defaultKey, rightClassName, navUlClassName } = props
  const [renderKeys, setRenderKeys] = useState({})
  const [localActiveKey, setLocalActiveKey] = useState('')
  const firstChildKeyRef = useRef('')
  const isNotDefinedKey = typeof activeKey === 'undefined'
  const curTabActiveKey = isNotDefinedKey ? localActiveKey : activeKey

  const handleSelected = (key) => {
    if (typeof onChange === 'function') {
      onChange(key)
    }
    if (isNotDefinedKey) {
      setLocalActiveKey(key)
    }
  }

  useEffect(() => {
    if (!renderKeys[curTabActiveKey] && curTabActiveKey) {
      setRenderKeys((obj) => ({
        ...obj,
        [curTabActiveKey]: true,
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [curTabActiveKey])

  useEffect(() => {
    const key = defaultKey ? defaultKey : firstChildKeyRef.current
    setLocalActiveKey(key)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultKey])

  return (
    <div
      className={cls({
        [styles['tabs']]: true,
        [className]: className,
      })}>
      <div className={styles['tabs-nav']}>
        <ul className={cls({
          [styles['nav-ul']]: true,
          [navUlClassName]: navUlClassName
        })}>
          {React.Children.map(children, (child, childIdx) => {
            const title = child.props.tab
            const itemKey = child.key
            if (childIdx === 0) {
              firstChildKeyRef.current = itemKey
            }
            return (
              <li
                key={itemKey}
                className={cls({
                  [styles['nav-item']]: true,
                  [styles['active']]: curTabActiveKey === itemKey,
                })}
                onClick={() => handleSelected(itemKey)}>
                {title}
              </li>
            )
          })}
        </ul>
      </div>
      <div className={styles['panle-content']}>
        {React.Children.map(children, (child) => {
          const itemKey = child.key
          const hasRender = renderKeys[itemKey]
          return (
            <RightContent
              key={itemKey}
              hasRender={hasRender}
              isActive={curTabActiveKey === itemKey}
              className={cls({
                [styles['right-content']]: true,
                [rightClassName]: rightClassName
              })}
            >
              {child.props.children}
            </RightContent>
          )
        })}
      </div>
    </div>
  )
}
const RightContent = ({ hasRender, isActive, children, className }) => {
  const itemStyle = isActive ? {}: { display: 'none'}
  if (hasRender) {
    return <div style={itemStyle} className={className}>{children}</div>
  } else {
    return null
  }
}

const TabPane = ({ tab, key, ...props }) => {
  return <div {...props}>{tab}</div>
}
Tabs.TabPane = TabPane
export default Tabs
