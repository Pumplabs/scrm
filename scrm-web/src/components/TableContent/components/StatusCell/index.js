import { Badge } from 'antd'
import { isEmpty } from 'lodash'

const getBadeProps = (item = {}) => {
  if (item.color) {
    return {
      color: item.color
    }
  } else if (item.status) {
    return {
      status: item.status
    }
  }
  return {}
}

export default ({options = [], val }) => {
  const item = options.find(ele => `${ele.value}` === `${val}`)
  if (item) {
    const text = item ? item.label || val : ''
    const badgeProps = getBadeProps(item)
    if (isEmpty(badgeProps)) {
      return text
    } else {
      return <Badge
        {...getBadeProps(item)}
        text={text}
      />
    }
  } else {
    return ''
  }
}