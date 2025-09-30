import React, { useState } from 'react'
import { 
  Clock, 
  User, 
  Coins, 
  Download, 
  Plus, 
  RotateCcw, 
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { contractFunctions, contractUtils } from '../utils/contract'
import type { StreamData } from '../utils/contract'

interface StreamCardProps {
  stream: StreamData
  userAddress: string
  userSession: any
  onStreamUpdate: () => void
}

export const StreamCard: React.FC<StreamCardProps> = ({ 
  stream, 
  userAddress, 
  userSession, 
  onStreamUpdate 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [availableBalance, setAvailableBalance] = useState(0)
  const [refuelAmount, setRefuelAmount] = useState('')

  const isSender = stream.sender === userAddress
  const isRecipient = stream.recipient === userAddress
  const currentBlock = contractUtils.getCurrentBlockHeight()
  const isActive = currentBlock >= stream.timeframe.startBlock && currentBlock < stream.timeframe.stopBlock
  const isCompleted = currentBlock >= stream.timeframe.stopBlock

  const fetchAvailableBalance = async () => {
    try {
      const balance = await contractFunctions.getStreamBalance(stream.id, userAddress)
      setAvailableBalance(balance)
    } catch (error) {
      console.error('Error fetching balance:', error)
    }
  }

  React.useEffect(() => {
    fetchAvailableBalance()
  }, [stream.id, userAddress])

  const handleWithdraw = async () => {
    setIsLoading(true)
    try {
      await contractFunctions.withdrawFromStream(
        stream.id,
        userSession,
        () => {
          setIsLoading(false)
          onStreamUpdate()
        },
        () => {
          setIsLoading(false)
        }
      )
    } catch (error) {
      console.error('Error withdrawing:', error)
      setIsLoading(false)
    }
  }

  const handleRefuel = async () => {
    if (!refuelAmount) return
    
    setIsLoading(true)
    try {
      await contractFunctions.refuelStream(
        stream.id,
        parseFloat(refuelAmount),
        userSession,
        () => {
          setIsLoading(false)
          setRefuelAmount('')
          onStreamUpdate()
        },
        () => {
          setIsLoading(false)
        }
      )
    } catch (error) {
      console.error('Error refueling:', error)
      setIsLoading(false)
    }
  }

  const handleRefund = async () => {
    setIsLoading(true)
    try {
      await contractFunctions.refundStream(
        stream.id,
        userSession,
        () => {
          setIsLoading(false)
          onStreamUpdate()
        },
        () => {
          setIsLoading(false)
        }
      )
    } catch (error) {
      console.error('Error refunding:', error)
      setIsLoading(false)
    }
  }

  const getStatusColor = () => {
    if (isCompleted) return '#10b981' // green
    if (isActive) return '#f59e0b' // yellow
    return '#6b7280' // gray
  }

  const getStatusText = () => {
    if (isCompleted) return 'Completed'
    if (isActive) return 'Active'
    return 'Pending'
  }

  const formatAddress = (address: string) => {
    return contractUtils.formatAddress(address)
  }

  return (
    <div className="stream-card">
      <div className="stream-card-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="stream-info">
          <div className="stream-id">Stream #{stream.id}</div>
          <div className="stream-status" style={{ color: getStatusColor() }}>
            {getStatusText()}
          </div>
        </div>
        <div className="stream-amount">
          {stream.balance.toFixed(6)} STX
        </div>
        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
      </div>

      {isExpanded && (
        <div className="stream-card-content">
          <div className="stream-details">
            <div className="detail-row">
              <User size={16} />
              <span className="detail-label">Sender:</span>
              <span className="detail-value">{formatAddress(stream.sender)}</span>
            </div>
            
            <div className="detail-row">
              <User size={16} />
              <span className="detail-label">Recipient:</span>
              <span className="detail-value">{formatAddress(stream.recipient)}</span>
            </div>
            
            <div className="detail-row">
              <Clock size={16} />
              <span className="detail-label">Duration:</span>
              <span className="detail-value">
                {stream.timeframe.stopBlock - stream.timeframe.startBlock} blocks
              </span>
            </div>
            
            <div className="detail-row">
              <Coins size={16} />
              <span className="detail-label">Payment/Block:</span>
              <span className="detail-value">{stream.paymentPerBlock.toFixed(6)} STX</span>
            </div>
            
            <div className="detail-row">
              <Coins size={16} />
              <span className="detail-label">Withdrawn:</span>
              <span className="detail-value">{stream.withdrawnBalance.toFixed(6)} STX</span>
            </div>
            
            {isRecipient && (
              <div className="detail-row">
                <Coins size={16} />
                <span className="detail-label">Available:</span>
                <span className="detail-value">{availableBalance.toFixed(6)} STX</span>
              </div>
            )}
          </div>

          <div className="stream-actions">
            {isRecipient && availableBalance > 0 && (
              <button 
                className="action-button withdraw-button"
                onClick={handleWithdraw}
                disabled={isLoading}
              >
                <Download size={16} />
                Withdraw {availableBalance.toFixed(6)} STX
              </button>
            )}

            {isSender && isActive && (
              <div className="refuel-section">
                <input
                  type="number"
                  placeholder="Refuel amount (STX)"
                  value={refuelAmount}
                  onChange={(e) => setRefuelAmount(e.target.value)}
                  className="refuel-input"
                />
                <button 
                  className="action-button refuel-button"
                  onClick={handleRefuel}
                  disabled={isLoading || !refuelAmount}
                >
                  <Plus size={16} />
                  Refuel
                </button>
              </div>
            )}

            {isSender && isCompleted && (
              <button 
                className="action-button refund-button"
                onClick={handleRefund}
                disabled={isLoading}
              >
                <RotateCcw size={16} />
                Refund Excess
              </button>
            )}

            <button 
              className="action-button settings-button"
              disabled={true} // TODO: Implement stream updates
            >
              <Settings size={16} />
              Update Stream
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
