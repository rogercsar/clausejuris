import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { MSW_CONFIG } from './mocks/config'

// Initialize app and conditionally load MSW based on env config
async function initApp() {
  if (MSW_CONFIG.enabled) {
    const { initMocks } = await import('./mocks/init')
    await initMocks()
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

initApp()
