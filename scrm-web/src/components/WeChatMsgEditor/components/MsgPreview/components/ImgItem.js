const MsgImgItem = ({ thumbUrl }) => {
  if (thumbUrl) {
    return <img
      src={thumbUrl}
      alt=""
      style={{
        maxWidth: "100%",
        maxHeight: "100%"
      }}
    />
  } else {
    return null
  }
}

export default MsgImgItem