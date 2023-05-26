import { SearchBar } from 'antd-mobile'

export default ({
  onChange,
  onSearch,
  value,
  onClear,
  style = {},
  className,
  ...rest
}) => {
  const handleChange = (text) => {
    if (typeof onChange === 'function') {
      onChange({
        target: {
          value: text,
        },
      })
    }
  }

  const handleSearch = (text = '') => {
    if (typeof onSearch === 'function') {
      onSearch({
        target: {
          value: text,
        },
      })
    }
  }

  return (
    <SearchBar
      className={className}
      value={value}
      placeholder="请输入内容"
      showCancelButton
      onChange={handleChange}
      onSearch={handleSearch}
      onClear={onClear}
      clearOnCancel={true}
      style={{ '--background': '#ffffff', ...style }}
      {...rest}
    />
  )
}
