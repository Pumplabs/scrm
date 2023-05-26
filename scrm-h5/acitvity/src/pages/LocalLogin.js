import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createURLSearchParams } from 'src/utils'
import { USER_KEY, CORP_ID, EXT_CUSTOMER_ID, TEST_TASK_ID } from 'src/utils/constants'
export default () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    corpId: CORP_ID,
    taskId: TEST_TASK_ID,
    extCustomerId: EXT_CUSTOMER_ID
  })

  const onLogin = () => {
    const str = createURLSearchParams(data)
    localStorage.setItem(USER_KEY, data.extCustomerId)
    navigate(`/?${str}`)
  }

  return (
    <div>
      {Object.keys(data).map(key => (
        <div key={key}>
          {key}: <input value={data[key]} onChange={e => {
            setData(preData => ({
              ...preData,
              [key]: e.target.value
            }))
          }} />
        </div>
      ))}
      <div>
        <button onClick={onLogin}>登录</button>
      </div>
    </div>
  )
}