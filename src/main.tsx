import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Initialize MSW for demo purposes (both dev and prod)
async function initApp() {
  const { initMocks } = await import('./mocks/init')
  await initMocks()

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

initApp()
