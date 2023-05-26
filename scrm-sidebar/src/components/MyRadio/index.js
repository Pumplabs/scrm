import { Button} from 'antd-mobile'
export default () => {
  return  (
    <div>
      <Button color="primary" fill="outline">员工统计</Button>
      <Button color="primary" fill="solid">客户统计</Button>
    </div>
  )
}

const MyRadioGroup = ({ options = [], activeKey, onChange, className }) => {
  const lastIdx = options.length - 1
  const getButtonStyle = (idx) => {
    if (options.length === 1) {
      return {}
    } else if (idx === 0) {
      return { '--border-radius': '4px 0px 0px 4px' }
    } else if (idx === lastIdx) {
      return { '--border-radius': '0px 4px 4px 0px' }
    } else {
      return { '--border-radius': '0px' }
    }
  }
  return (
    <div className={className}>
      {options.map((ele, idx) => {
        const isActive = ele.value === activeKey
        const buttonStyle = getButtonStyle(idx)
        return (
          <Button
            color="primary"
            fill={isActive ? 'solid' : 'outline'}
            key={ele.value}
            size="small"
            style={buttonStyle}
            onClick={(e) => {
              if (!isActive) {
                onChange(ele.value)
              }
            }}>
            {ele.label}
          </Button>
        )
      })}
    </div>
  )
}
export { MyRadioGroup as RadioGroup }