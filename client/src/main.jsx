import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider} from "react-redux"
import appStore from './utils/appStore.js'
import process from "process"
import { Buffer } from "buffer"

window.process = process
window.Buffer = Buffer


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <App />
    </Provider>
  </StrictMode>,
)
