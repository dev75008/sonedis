import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import App from './app/App'
import './i18n/config'
import './styles/tokens.css'
import './styles/global.css'

const redirect = sessionStorage.getItem('spa-redirect')
if (redirect) {
  sessionStorage.removeItem('spa-redirect')
  window.history.replaceState(null, '', `${import.meta.env.BASE_URL.replace(/\/$/, '')}${redirect}`)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)
