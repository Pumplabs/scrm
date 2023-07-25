import { forwardRef } from 'react'

import { cloneElement } from 'src/utils/reactNode'

export default forwardRef((props, ref) => {
  const { suffixText, children, prefixText = '', ...rest } = props
  const nextChildren = children ? cloneElement(children, rest) : children
  return (
    <div ref={ref}>
      {prefixText ? <span style={{ marginRight: 8 }}>{prefixText}</span> : null}
      {nextChildren}
      {suffixText ? <span style={{ marginLeft: 8 }}>{suffixText}</span> : null}
    </div>
  )
})
