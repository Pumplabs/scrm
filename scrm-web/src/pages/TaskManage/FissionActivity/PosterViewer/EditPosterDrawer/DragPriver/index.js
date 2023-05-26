import { useEffect, useRef, useContext } from 'react'
import cls from 'classnames'
import { debounce } from 'lodash'
import DragContext from './DragContext'
import styles from './index.module.less'

/**
 * 计算图形位置
 * @param {Number} left 鼠标横坐标
 * @param {Number} top 鼠标纵坐标
 * @param {Object} config 配置对象
 * * @param {Number} canvasWidth 画布宽度
 * * @param {Number} canvasHeight 画布高度
 * * @param {Number} itemWidth 元素宽度
 * * @param {Number} itemHeight 元素高度
 * @returns 
 */
const calcPosition = (left, top, config = {}) => {
  const { x, y, canvasWidth, canvasHeight, itemWidth, itemHeight } = config
  const maxX = canvasWidth - itemWidth
  const maxY = canvasHeight - itemHeight
  let newLeft = left - x
  let newTop = top - y
  // 计算边界
  if (newLeft < 0) {
    newLeft = 0
  } else if (newLeft > maxX) {
    newLeft = maxX
  }
  if (newTop < 0) {
    newTop = 0
  } else if (newTop > maxY) {
    newTop = maxY
  }
  return {
    left: newLeft,
    top: newTop
  }
}

export default ({ canvasWidth, canvasHeight, children, onEnd, backgroundUrl }) => {
  const moveEleData = useRef()
  const containerRef = useRef()

  const onMouseUp = () => {
    if (moveEleData.current) {
      moveEleData.current.ele.classList.remove(styles['move'])
      const left = moveEleData.current.ele.style.left
      const top = moveEleData.current.ele.style.top
      const moveId = moveEleData.current.id
      moveEleData.current = null
      if (typeof onEnd === 'function'){
        onEnd({
          id: moveId,
          left: Number.parseInt(left),
          top: Number.parseInt(top)
        })
      }
    }
  }

  const onMouseMove = (e) => {
    if (moveEleData.current && containerRef.current === e.target) {
      const offsetX = e.nativeEvent.offsetX
      const offsetY = e.nativeEvent.offsetY
      const { left, top } = calcPosition(offsetX, offsetY, {
        x: moveEleData.current.x,
        y: moveEleData.current.y,
        canvasWidth,
        canvasHeight,
        itemWidth: moveEleData.current.width,
        itemHeight:moveEleData.current.height
      })
      moveEleData.current.ele.style.left = `${left}px`;
      moveEleData.current.ele.style.top = `${top}px`
    }
  }

  const _move = debounce(onMouseMove, 10)

  useEffect(() => {
    window.addEventListener('mouseup', onMouseUp)
    return () => {
      window.removeEventListener('mouseup', onMouseUp)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const itemMouseDown = (boxEle, e, id) => {
    const x = e.nativeEvent.offsetX
    const y = e.nativeEvent.offsetY
    moveEleData.current = {
      x,
      y,
      id,
      ele: boxEle,
      width: e.target.offsetWidth,
      height: e.target.offsetHeight
    }
    boxEle.classList.add(styles['move'])
  }
  const bgImgStyle = backgroundUrl ? {
    backgroundImage: `url("${backgroundUrl}")`,
    backgroundSize: `${canvasWidth}px ${canvasHeight}px`
  } : {}
  return (
    <div
      className={styles['container']}
      ref={ref => containerRef.current = ref}
      onMouseMoveCapture={_move}
      style={{
        width: canvasWidth,
        height: canvasHeight,
        ...bgImgStyle
      }}
    >
      <DragContext.Provider
        value={{
          canvasWidth,
          itemMouseDown,
          canvasHeight
        }}
      >
        {children}
      </DragContext.Provider>
    </div>
  )
}

export const DragItem = ({ children, id, left = 0, top = 0 }) => {
  const { itemMouseDown } = useContext(DragContext)
  const domRef = useRef()
  return (
    <div
      ref={ref => domRef.current = ref}
      className={cls([styles['box']])}
      style={{left, top}}
      onMouseDown={e => {
        itemMouseDown(domRef.current, e, id)
      }}
    >
      <i className={cls([styles['box-point'], styles['point-11']])} />
      <i className={cls([styles['box-point'], styles['point-12']])} />
      <i className={cls([styles['box-point'], styles['point-13']])} />
      <i className={cls([styles['box-point'], styles['point-21']])} />
      <i className={cls([styles['box-point'], styles['point-23']])} />
      <i className={cls([styles['box-point'], styles['point-31']])} />
      <i className={cls([styles['box-point'], styles['point-32']])} />
      <i className={cls([styles['box-point'], styles['point-33']])} />
      {children}
    </div>
  )
}