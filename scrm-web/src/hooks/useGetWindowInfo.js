import { useState, useEffect, useRef } from 'react'
import { debounce } from 'lodash'

export default () => {
  const preHeight = useRef(window.innerHeight)
  const [screenWidth, setScreenWidth] = useState(window.innerWidth)
  const [screenHeight, setScreenHeight] = useState(window.innerHeight)
  const handleResize = (e) => {
    preHeight.current = screenHeight
    // 判断当前窗口是否比之前的窗口高
    setScreenHeight(window.innerHeight)
    setScreenWidth(window.innerWidth)
  }
  const _resize = debounce(handleResize, 200)

  useEffect(() => {
    window.addEventListener('resize', _resize)
    return () => {
      window.removeEventListener('resize', _resize)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    screenWidth,
    screenHeight,
    isMoreHeight: screenHeight > preHeight
  }
}