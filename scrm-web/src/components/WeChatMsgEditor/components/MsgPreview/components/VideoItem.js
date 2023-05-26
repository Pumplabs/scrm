import { PlayCircleOutlined } from '@ant-design/icons'

export default ({name }) => {
  return (
    <div>
      <PlayCircleOutlined style={{fontSize: 24, verticalAlign: "middle"}}/>
      <span style={{marginLeft: 6}}>{name}</span>
    </div>
  )
}