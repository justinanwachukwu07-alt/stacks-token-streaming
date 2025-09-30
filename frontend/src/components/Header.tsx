import React from 'react'
import { Wallet, Plus, LayoutDashboard } from 'lucide-react'

interface HeaderProps {
  isConnected: boolean
  userAddress: string
  onDisconnect: () => void
  activeTab: string
  onTabChange: (tab: string) => void
}

export const Header: React.FC<HeaderProps> = ({
  isConnected,
  userAddress,
  onDisconnect,
  activeTab,
  onTabChange
}) => {
  const formatAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <h1 className="app-title">STX Stream</h1>
          <p className="app-subtitle">Token Streaming Protocol</p>
        </div>

        {isConnected && (
          <nav className="navigation">
            <button
              className={`nav-button ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => onTabChange('dashboard')}
            >
              <LayoutDashboard size={20} />
              Dashboard
            </button>
            <button
              className={`nav-button ${activeTab === 'create' ? 'active' : ''}`}
              onClick={() => onTabChange('create')}
            >
              <Plus size={20} />
              Create Stream
            </button>
          </nav>
        )}

        <div className="wallet-section">
          {isConnected ? (
            <div className="wallet-info">
              <div className="wallet-address">
                <Wallet size={16} />
                <span>{formatAddress(userAddress)}</span>
              </div>
              <button className="disconnect-button" onClick={onDisconnect}>
                Disconnect
              </button>
            </div>
          ) : (
            <div className="wallet-placeholder">
              <Wallet size={20} />
              <span>Connect Wallet</span>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
