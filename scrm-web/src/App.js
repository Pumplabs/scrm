import { ConfigProvider } from 'antd'
import locale from 'antd/lib/locale/zh_CN'
import 'moment/locale/zh-cn'
import Routes from './routes'
import './App.less'


const App = () => {
  return (
    <ConfigProvider locale={locale}>
      <Routes />
    </ConfigProvider>
  )
}

export default App
