import React from 'react'
import { showConnect, getUserSession } from '@stacks/connect'
import { Wallet, ArrowRight } from 'lucide-react'
import { APP_CONFIG, CONTRACT_CONFIG } from '../config'

interface ConnectWalletProps {
  onConnect: (session: any) => void
}

const appDetails = {
  name: APP_CONFIG.name,
  icon: window.location.origin + '/vite.svg',
}

export const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnect }) => {
  const handleConnect = () => {
    showConnect({
      appDetails,
      redirectTo: '/',
      onFinish: (payload) => {
        const { userSession } = payload
        onConnect(userSession)
      },
      userSession: getUserSession(),
    })
  }

  return (
    <div className="connect-wallet-container">
      <div className="connect-wallet-card">
        <div className="connect-wallet-header">
          <div className="wallet-icon">
            <Wallet size={48} />
          </div>
          <h2>Welcome to STX Stream</h2>
          <p>Connect your wallet to start streaming STX tokens</p>
        </div>

        <div className="features-list">
          <div className="feature-item">
            <div className="feature-icon">💰</div>
            <div className="feature-text">
              <h3>Create Streams</h3>
              <p>Set up continuous payments to recipients over time</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">⏰</div>
            <div className="feature-text">
              <h3>Time-based Payments</h3>
              <p>Configure payment schedules with start and end blocks</p>
            </div>
          </div>
          
          <div className="feature-item">
            <div className="feature-icon">🔄</div>
            <div className="feature-text">
              <h3>Manage Streams</h3>
              <p>Withdraw, refuel, and update stream parameters</p>
            </div>
          </div>
        </div>

        <button className="connect-button" onClick={handleConnect}>
          <Wallet size={20} />
          Connect Wallet
          <ArrowRight size={20} />
        </button>

        <div className="network-info">
          <p>Currently connected to: <strong>Stacks {CONTRACT_CONFIG.network.charAt(0).toUpperCase() + CONTRACT_CONFIG.network.slice(1)}</strong></p>
        </div>
      </div>
    </div>
  )
}
