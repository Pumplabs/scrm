const OverText = ({ list = [], suffixText = '', renderItem }) => {
  if (!Array.isArray(list) || list.length === 0) {
    return '无'
  }
  const total = list.length
  const maxLen = 1
  const arr = list.slice(0, maxLen)
  return (
    <span style={{ wordBreak: 'break-all' }}>
      {arr.map((ele, idx) => (
        <span key={idx}>
          {idx > 0 ? ',' : ''}
          {typeof renderItem === 'function' ? renderItem(ele, idx) : null}
        </span>
      ))}
      {total > 0 ? `等${total}${suffixText}` : ''}
    </span>
  )
}

export default OverText