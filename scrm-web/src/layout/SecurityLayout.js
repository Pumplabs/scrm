import React, {  useContext, useLayoutEffect } from 'react'
import { MobXProviderContext } from 'mobx-react'
import { Spin } from 'antd'

const Page = () => {
  const { UserStore } = useContext(MobXProviderContext)
  useLayoutEffect(() => {
    UserStore.getUserInfo()
  })
  return (
    <div style={{ textAlign: 'center', paddingTop: 100 }}>
      <span>
        <span>界面加载中，请稍后...</span>
        <Spin />
      </span>
    </div>
  )
}

export default Page
