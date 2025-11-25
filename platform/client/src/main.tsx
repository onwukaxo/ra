import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { AuthProvider } from './context/AuthContext'

// Probe via proxy to avoid unsafe port restrictions
fetch('/api/health').then(() => {
  console.log('Platform API health: ok')
}).catch((err) => {
  console.warn('Platform API health error:', err?.message || err)
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
