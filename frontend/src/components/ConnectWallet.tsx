import React from 'react'
import { connect } from '@stacks/connect'
import { Wallet, ArrowRight, Copy, Check, AlertTriangle } from 'lucide-react'
import { CONTRACT_CONFIG } from '../config'
import { handleWalletError, getWalletTroubleshootingSteps, checkWalletAvailability } from '../utils/walletErrorHandler'
import { WalletDiagnostic } from './WalletDiagnostic'

interface ConnectWalletProps {
  onConnect: (session: any) => void
}

// App details are provided via the Connect provider in main.tsx

export const ConnectWallet: React.FC<ConnectWalletProps> = ({ onConnect }) => {
  const [copiedAddress, setCopiedAddress] = React.useState<string | null>(null)
  const [walletError, setWalletError] = React.useState<string>('')
  const [troubleshootingSteps, setTroubleshootingSteps] = React.useState<string[]>([])
  const [availableWallets, setAvailableWallets] = React.useState<string[]>([])

  React.useEffect(() => {
    // Check wallet availability on component mount
    const { available, wallets } = checkWalletAvailability()
    setAvailableWallets(wallets)
    
    if (!available) {
      setWalletError('No Stacks wallet detected. Please install Leather, Xverse, or Hiro wallet.')
      setTroubleshootingSteps(getWalletTroubleshootingSteps('UNKNOWN'))
    }
  }, [])

  const handleConnect = async () => {
    try {
      setWalletError('')
      setTroubleshootingSteps([])
      
      // Check if any wallet is available
      if (typeof window === 'undefined') {
        setWalletError('Wallet connection not available in this environment')
        return
      }

      // Trigger wallet connection using new API
      await connect({ forceWalletSelect: true })
      // After connect, construct a minimal session-like object to keep existing app flow
      const session = {
        isUserSignedIn: () => true,
        loadUserData: () => ({
          profile: {
            stxAddress: {
              testnet: (JSON.parse(localStorage.getItem('stacks-connect') || '{"addresses":[]}').addresses?.find((a: any) => a.address?.startsWith('ST') || a.address?.startsWith('SP'))?.address) || ''
            }
          }
        }),
        signUserOut: () => {
          localStorage.removeItem('stacks-connect')
        }
      }
      onConnect(session)
    } catch (error: any) {
      const walletError = handleWalletError(error)
      setWalletError(walletError.message)
      setTroubleshootingSteps(getWalletTroubleshootingSteps(walletError.type))
    }
  }

  const copyToClipboard = async (address: string, label: string) => {
    try {
      await navigator.clipboard.writeText(address)
      setCopiedAddress(label)
      setTimeout(() => setCopiedAddress(null), 2000)
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
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

        {walletError && (
          <div className="wallet-error">
            <AlertTriangle size={16} />
            <span>{walletError}</span>
          </div>
        )}

        <button className="connect-button" onClick={handleConnect}>
          <Wallet size={20} />
          Connect Wallet
          <ArrowRight size={20} />
        </button>

        {(walletError || troubleshootingSteps.length > 0) && (
          <div className="wallet-troubleshooting">
            <h4>Troubleshooting Steps:</h4>
            <ul>
              {troubleshootingSteps.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ul>
            {availableWallets.length > 0 && (
              <p className="detected-wallets">
                <strong>Detected wallets:</strong> {availableWallets.join(', ')}
              </p>
            )}
          </div>
        )}

        <div className="demo-section">
          <h3>Contract</h3>
          <div className="demo-info">
            <div className="demo-item">
              <label>Contract Address:</label>
              <div className="address-row">
                <code>{CONTRACT_CONFIG.address}</code>
                <button 
                  className="copy-btn"
                  onClick={() => copyToClipboard(CONTRACT_CONFIG.address, 'contract')}
                  title="Copy contract address"
                >
                  {copiedAddress === 'contract' ? <Check size={16} /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="network-info">
          <p>Currently connected to: <strong>Stacks {CONTRACT_CONFIG.network.charAt(0).toUpperCase() + CONTRACT_CONFIG.network.slice(1)}</strong></p>
        </div>

        <WalletDiagnostic />
      </div>
    </div>
  )
}
