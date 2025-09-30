import { useState, useEffect } from 'react'
import { getUserSession } from '@stacks/connect'
import { ConnectWallet } from './components/ConnectWallet'
import { Dashboard } from './components/Dashboard'
import { CreateStream } from './components/CreateStream'
import { Header } from './components/Header'
import './App.css'

function App() {
  const [userSession, setUserSession] = useState<any>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [userAddress, setUserAddress] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    // Check if user is already connected
    const session = getUserSession()
    if (session && session.isUserSignedIn()) {
      setUserSession(session)
      setIsConnected(true)
      setUserAddress(session.loadUserData().profile.stxAddress.testnet)
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
