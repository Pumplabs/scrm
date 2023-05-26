import { forwardRef, useRef, useImperativeHandle } from 'react'
import styles from './index.module.less'

export const getStyleStr = (style = {}) => {
  let res = ''
  for (const attr in style) {
    res += `${res ? ';' : ''}${attr}:${style[attr]}`
  }
  return res
}
const ChartTip = forwardRef((props, ref) => {
  const contentRef = useRef(null)
  const eleRef = useRef(null)
  const curInfo = useRef({})

  const setContent = (content) => {
    contentRef.current.innerHTML = content
    curInfo.current.content = content
  }

  const showTip = (e) => {
    const currLabel = e.event.target
    if (eleRef.current) {
      const left =
        currLabel.transform[4] - eleRef.current.offsetWidth / 2 + 'px'
      const top =
        currLabel.transform[5] - eleRef.current.offsetHeight - 15 + 'px'
      eleRef.current.style = getStyleStr({
        left,
        top,
        transform: '',
        visibility: 'visible',
      })
    }
    curInfo.current.show = true
  }

  const hideTip = () => {
    curInfo.current.show = false
    if (eleRef.current) {
      eleRef.current.style = getStyleStr({
        visibility: 'hidden',
        transform: 'scale(0)',
      })
    }
  }

  useImperativeHandle(ref, () => ({
    setContent,
    tipText: curInfo.current.content,
    show: curInfo.current.show,
    showTip: showTip,
    hideTip: hideTip,
  }))
  return (
    <div
      className={styles['chart-tip']}
      ref={(r) => {
        ref(r)
        eleRef.current = r
      }}
      {...props}>
      <div
        className={styles['chart-tip-content']}
        ref={(r) => (contentRef.current = r)}></div>
      <div className={styles['chart-tip-arrow']}> </div>
    </div>
  )
})
export default ChartTip