import { getTextMsg } from 'components/MsgSection/utils'
import { NAME_LEN } from './constants'

export const getMassName = (data = {}) => {
  if (data.name) {
    return data.name
  } else if (data.msg) {
    return getNameByMsg(data.msg.text)
  } else {
    return ''
  }
}

export const getNameByMsg = (textArr) => {
  const res = getTextMsg(textArr)
  if (res.length) {
    return res[0].text.substr(0, NAME_LEN)
  } else {
    return ''
  }
}