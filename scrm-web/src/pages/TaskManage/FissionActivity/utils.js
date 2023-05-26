import { formatColorStr } from 'components/MyColorPicker/utils'
export const getColor = (res) => {
  const color = res.nameColor ? {
    r: res.nameColor.red,
    b: res.nameColor.blue,
    g: res.nameColor.green
  } : {
    r: 0,
    b: 0,
    g: 0
  }
  return color
}
export const getPosterConfig = (res, color) => {
  const headPos = res.headPos ? res.headPos :  {x: 0, y: 0}
  const namePos = res.namePos ? res.namePos :  {x: 0, y: 0}
  const qrCodePos = res.qrCodePos ? res.qrCodePos: {x: 0, y: 0}
  return {
    showName: res.hasName,
    showAvatar: res.hasHead,
    code: {
      left: qrCodePos.x,
      top: qrCodePos.y
    },
    avatar: {
      left: headPos.x,
      top: headPos.y
    },
    name: {
      left: namePos.x,
      top: namePos.y
    },
    color: formatColorStr(color)
  }
}

export const handleTags = (names =[], ids = []) => {
  if (!Array.isArray(names) || !Array.isArray(ids)) {
    return []
  }
  let tagRes = []
  names.forEach((idItem, idx) =>{
    tagRes = [
      ...tagRes,
      {
        name: names[idx],
        id: idItem
      }
    ]
  })
  return tagRes
}