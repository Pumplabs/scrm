import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'mobx-react'
import { BrowserRouter } from 'react-router-dom'
import stores from 'store'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { SYSTEM_PREFIX_PATH } from 'src/utils/constants'

ReactDOM.render(
  <BrowserRouter basename={SYSTEM_PREFIX_PATH}>
    <Provider {...stores}>
      <App />
    </Provider>
  </BrowserRouter>,
  document.getElementById('root')
)

reportWebVitals()
