/* eslint-disable no-empty */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

const savedTheme = (() => {
  try {
    const stored = localStorage.getItem('anaksehat-theme')
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed?.state?.theme || 'dark'
    }
  } catch {}
  return 'dark'
})()
document.documentElement.setAttribute('data-theme', savedTheme)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)