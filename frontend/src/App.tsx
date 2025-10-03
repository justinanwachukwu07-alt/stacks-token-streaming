import { useState, useEffect } from 'react'
import { isConnected as stacksIsConnected } from '@stacks/connect'
import { ConnectWallet } from './components/ConnectWallet'
import { Dashboard } from './components/Dashboard'
import { CreateStream } from './components/CreateStream'
import { Header } from './components/Header'
import { setupGlobalWalletErrorHandler } from './utils/walletErrorHandler'
import './App.css'

function App() {
  const [userSession, setUserSession] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    // Set up global wallet error handler
    setupGlobalWalletErrorHandler()
    
    // Check if user is already connected
    if (stacksIsConnected()) {
      // Load cached address from local storage
      const dataRaw = localStorage.getItem('stacks-connect')
      if (dataRaw) {
        try {
          const data = JSON.parse(dataRaw)
          const stxAddr = data.addresses?.find((a: any) => a.address?.startsWith('ST') || a.address?.startsWith('SP'))?.address || ''
          const session = {
            isUserSignedIn: () => true,
            loadUserData: () => ({ profile: { stxAddress: { testnet: stxAddr } } }),
            signUserOut: () => { localStorage.removeItem('stacks-connect') }
          }
          setUserSession(session)
          setIsConnected(true)
          setUserAddress(stxAddr)
        } catch {}
      }
    }
  }, [])

  const handleConnect = (session: any) => {
    setUserSession(session)
    setIsConnected(true)
    setUserAddress(session.loadUserData().profile.stxAddress.testnet)
  }

  const handleDisconnect = () => {
    if (userSession) {
      userSession.signUserOut()
    }
    setUserSession(null)
    setIsConnected(false)
    setUserAddress('')
  }

  return (
    <div className="app">
      <Header 
        isConnected={isConnected}
        userAddress={userAddress}
        onDisconnect={handleDisconnect}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      <main className="main-content">
        {!isConnected ? (
          <ConnectWallet onConnect={handleConnect} />
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard userAddress={userAddress} userSession={userSession} />
            )}
            {activeTab === 'create' && (
              <CreateStream userAddress={userAddress} userSession={userSession} />
            )}
          </>
        )}
      </main>
    </div>
  )
}

export default App
