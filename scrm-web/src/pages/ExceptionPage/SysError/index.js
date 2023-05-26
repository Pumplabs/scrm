import { Link } from 'react-router-dom'
export default () => {
  return (
    <div style={{ textAlign: "center", paddingTop: 160 }}>
      抱歉，系统出了点问题
      <p><Link to="/home">返回首页</Link></p>
    </div>
  )
}