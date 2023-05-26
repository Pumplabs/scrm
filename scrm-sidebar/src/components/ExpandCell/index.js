import { useState, useRef, useEffect, useMemo } from 'react'
import { merge } from 'lodash'
import styles from './index.module.less'

const defaultFieldNames = {
  expand: '展开',
  collpase: '收起'
}
export default (props) => {
  const { dataSource, maxHeight = '40', renderItem, children, onToggleShow, fieldNames = {} } = props
  const list = Array.isArray(dataSource) ? dataSource : []
  const [show, setShow] = useState(false)
  const [showHandle, setShowHandle] = useState(false)
  const tagsRef = useRef(null)
  const contentRef = useRef(null)
  const actionFieldNames = merge(defaultFieldNames, fieldNames)

  useEffect(() => {
    const fn = () => {
      if (tagsRef.current || contentRef.current) {
        const target = tagsRef.current
        const height = contentRef.current ? contentRef.current.clientHeight : (target ? target.scrollHeight : 0)
        setShowHandle(height > maxHeight)
      } else {
        setShowHandle(false)
      }
    }

    setTimeout(() => {
      fn()
    }, 300)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  })

  const toggleShow = (e) => {
    e.stopPropagation()
    const nextStatus = !show
    if (typeof onToggleShow === 'function') {
      onToggleShow(nextStatus)
    } else {
      setShow(nextStatus)
    }
  }

  const showStyle = useMemo(() => {
    if (show || Number.isNaN(maxHeight * 1)) {
      return {}
    }
    return { maxHeight: `${maxHeight}px`, overflow: 'hidden' }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, maxHeight])

  return (
    <div>
      <div
        style={showStyle}
        ref={(r) => (tagsRef.current = r)}>
        <div ref={(r) => (contentRef.current = r)} style={{height: "100%"}}>
          {children
            ? children
            : list.map((ele, idx) => {
                if (typeof renderItem === 'function') {
                  return renderItem(ele, idx)
                } else {
                  return null
                }
              })}
        </div>
      </div>
      {showHandle ? (
        <span onClick={toggleShow} className={styles['expand-btn']}>
          {show ? actionFieldNames.collpase : actionFieldNames.expand}
        </span>
      ) : null}
    </div>
  )
}
