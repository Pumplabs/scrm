import { useState } from 'react'
import { SUCCESS_CODE } from 'src/utils/constants'

export default (request, options = {}) => {
  const [loading, setLoading] = useState(false)
  const [res, setRes] = useState(undefined)
  const { onSuccess, formatRes } = options
  const requestFn = async (params) => {
    setLoading(true)
    const res = await request(params)
    setLoading(false)
    if (
      res.code === SUCCESS_CODE
    ) {
      setRes(typeof formatRes === 'function' ? formatRes(res.data) : res.data)
      if (typeof onSuccess === 'function') {
        onSuccess(res.data)
      }
    } else {
      setRes(undefined)
    }
  }

  return  {
    run: requestFn,
    data: res,
    loading
  }
}