import { Routes, Route } from 'react-router-dom'
import Home from 'src/pages/Home'
import Index from 'src/pages/Index'
import { NotFound, SysException, NoActivity } from 'src/pages/ExceptionPage'
import ActivityExpired from 'src/pages/ActivityExpired'
import LocalLogin from 'src/pages/LocalLogin'
import JoinActivity from 'src/pages/JoinActivity'

export const whiteRouteList = ['/empty', '/expired', '/sysError']
export default () => {
  return (
    <Routes>
      <Route path="/" element={<Index />}>
        {window.myMode ? <Route path="localLogin" element={<LocalLogin />}></Route>  : null }
        <Route path="home" element={<Home />}></Route>
        <Route path="joinActivity" element={<JoinActivity />} />
        <Route path="sysError" element={<SysException />} />
        {/* 无任务 */}
        <Route path="empty" element={<NoActivity />} />
        {/* 活动过期 */}
        <Route path="expired" element={<ActivityExpired />} />
        {/* 其它界面错误 */}
        <Route path="*" element={<NotFound />}></Route>
      </Route>
      <Route path="*" element={<NotFound />}></Route>
    </Routes>
  )
}
