import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Connect } from '@stacks/connect-react'
import { APP_CONFIG } from './config'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Connect
      authOptions={{
        appDetails: {
          name: APP_CONFIG.name,
          icon: window.location.origin + '/vite.svg',
        },
        redirectTo: '/',
      }}
    >
      <App />
    </Connect>
  </StrictMode>,
)
