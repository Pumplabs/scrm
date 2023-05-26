import { ArrowLeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router'
export default (props) => {
  const { children, onBack, backUrl } = props
  const navigate = useNavigate()
  const handleBack = () => {
    if (typeof onBack === 'function') {
      onBack()
    } else {
      if (backUrl) {
        navigate(backUrl)
      }
    }
  }
  return (
    <div style={{ lineHeight: "32px" }}>
      <span
        style={{ marginRight: 8, cursor: "pointer" }}
        onClick={handleBack}
      >
        <ArrowLeftOutlined />
      </span>
      {children}
    </div>
  )
}