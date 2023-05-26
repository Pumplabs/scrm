const joinColor = (color = {}) => {
  const { r, g, b } = color
  return `${r}, ${g}, ${b}`
}
export const formatColorStr = (color = {}, alpha) => {
  if (typeof alpha === 'undefined') {
    return `rgb(${joinColor(color)})`
  } else {
    return `rgba(${joinColor(color)}, ${alpha})`
  }
}

// 解析rgb/rgba
export const parseRgb = (color) => {
  const startIdx = color.indexOf('(')
  const endIdx = color.lastIndexOf(')')
  const [r, g, b, a] = color.slice(startIdx + 1, endIdx).split(',')
  return {
    r,
    g,
    b,
    a
  }
}

export const formatRgbColor = (color, alpha = 1) => {
  let nextColor = typeof color === 'string' ? color.toLowerCase() : ''
  let reg = /^#[0-9a-fA-F]{3}|[0-9a-fA-F]{6}$/
  if (nextColor && reg.test(nextColor)) {
    if (nextColor.length === 4) {
      let newColor = '#'
      for (let i = 1; i < 4; i++) {
        const str = nextColor.slice(i, i + 1)
        newColor = `${newColor}${str}${str}`
      }
      nextColor = newColor
    }
    let colorArr = []
    for (let i = 1; i < 7; i += 2) {
      colorArr = [...colorArr, parseInt(`0x${nextColor.slice(i, i + 2)}`)]
    }
    return `rgba(${colorArr.join()},${alpha})`
  } else if (nextColor.startsWith('rgb')) {
    const { r, g, b } = parseRgb(nextColor)
    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  } else {
    return nextColor
  }
}
