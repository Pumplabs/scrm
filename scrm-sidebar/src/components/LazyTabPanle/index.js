import { useRef } from 'react'
/**
 * @param {Stirng} tab 
 * @param {String} activeKey
 */
export default ({ tab, activeKey, children, style = {},  ...props }) => {
  const hasRenderRef = useRef()
  const isActive = tab === activeKey
  if (!isActive && !hasRenderRef.current) {
    return null
  }
  if (isActive) {
    hasRenderRef.current = true
  }
  const wrapStyle =  isActive ? {} : {display: "none"}
  return <div style={{...wrapStyle, ...style}} { ...props }>{children}</div>
}
