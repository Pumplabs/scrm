import { Fragment } from 'react'
import OpenEle from 'components/OpenEle'
import { resolveJson } from 'utils'

const DepName = ({ id }) => {
  return <OpenEle type="departmentName" openid={id} />
}
export default DepName
export const DepNames = ({ dataSource, jsonStr }) => {
  let depArr = []
  if (Array.isArray(dataSource) && dataSource.length) {
    depArr = [...dataSource]
  } else if (jsonStr) {
    depArr = resolveJson(jsonStr)
  } else {
    depArr = []
  }
  if (depArr.length) {
    return (
      <span>
        {depArr.map((ele, idx) => {
          const key = typeof ele === 'object' ? ele.name : ele
          return (
            <Fragment key={key}>
              {idx === 0 ? '' : '/'}
              <DepName id={key} />
            </Fragment>
          )
        })}
      </span>
    )
  } else {
    return null
  }
}
