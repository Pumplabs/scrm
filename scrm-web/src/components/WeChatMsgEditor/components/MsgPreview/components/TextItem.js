const MsgTextItem = ({ text }) => {
  if (!text) {
    return null
  }
  return <span style={{ wordBreak: "break-all" }}>
    {text}
  </span>
}
export default MsgTextItem