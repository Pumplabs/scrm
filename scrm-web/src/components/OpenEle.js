import React, { useRef, useContext, useEffect } from 'react'
import { observer, MobXProviderContext } from 'mobx-react'

const Comp = observer(({ ...props }) => {
  const { UserStore, WxWorkStore = {} } = useContext(MobXProviderContext)
  const extCorpId = UserStore ? UserStore.userData.extCorpId : ''
  return WxWorkStore.hasRegisterAgentConfig ? <OpenDataEle {...props} corpid={extCorpId}/> : <span className={props.className}>{props.openid}</span>
})

const OpenDataEle = ({ type, openid, corpid, ...rest }) => {
  const ref = useRef(null)

  const rebindRef = () => {
    window.WWOpenData.bind(ref.current)
  }
  useEffect(() => {
    return () => {
      if (window.WWOpenData) {
        window.WWOpenData.off('update', rebindRef)
      }
    }
  }, [])

  return <ww-open-data ref={ref} type={type} openid={openid} corpid={corpid} {...rest}/>
}
export { OpenDataEle }
export default Comp
