import React, { useState } from 'react'
import { Plus, Clock, User, Coins } from 'lucide-react'
import { contractFunctions, contractUtils } from '../utils/contract'
import type { CreateStreamParams } from '../utils/contract'

interface CreateStreamProps {
  userAddress: string
  userSession: any
}

export const CreateStream: React.FC<CreateStreamProps> = ({ userAddress, userSession }) => {
  const [formData, setFormData] = useState({
    recipient: '',
    initialBalance: '',
    startBlock: '',
    stopBlock: '',
    paymentPerBlock: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [txId, setTxId] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const params: CreateStreamParams = {
        recipient: formData.recipient,
        initialBalance: parseFloat(formData.initialBalance),
        startBlock: parseInt(formData.startBlock),
        stopBlock: parseInt(formData.stopBlock),
        paymentPerBlock: parseFloat(formData.paymentPerBlock)
      }

      await contractFunctions.createStream(
        params,
        userSession,
        (data: any) => {
          setTxId(data.txId)
          setIsLoading(false)
        },
        () => {
          setIsLoading(false)
        }
      )
    } catch (error) {
      console.error('Error creating stream:', error)
      setIsLoading(false)
    }
  }

  const isFormValid = () => {
    return formData.recipient && 
           formData.initialBalance && 
           formData.startBlock && 
           formData.stopBlock && 
           formData.paymentPerBlock &&
           parseInt(formData.startBlock) < parseInt(formData.stopBlock)
  }

  return (
    <div className="create-stream-container">
      <div className="create-stream-card">
        <div className="create-stream-header">
          <Plus size={32} />
          <h2>Create New Stream</h2>
          <p>Set up a continuous payment stream to a recipient</p>
        </div>

        {txId && (
          <div className="success-message">
            <h3>Stream Created Successfully!</h3>
            <p>Transaction ID: <code>{txId}</code></p>
            <a 
              href={`https://explorer.stacks.co/txid/${txId}?chain=testnet`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Explorer
            </a>
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-stream-form">
          <div className="form-group">
            <label htmlFor="recipient">
              <User size={16} />
              Recipient Address
            </label>
            <input
              type="text"
              id="recipient"
              name="recipient"
              value={formData.recipient}
              onChange={handleInputChange}
              placeholder="SP1..."
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="initialBalance">
              <Coins size={16} />
              Initial Balance (STX)
            </label>
            <input
              type="number"
              id="initialBalance"
              name="initialBalance"
              value={formData.initialBalance}
              onChange={handleInputChange}
              placeholder="10"
              min="0"
              step="0.000001"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startBlock">
                <Clock size={16} />
                Start Block
              </label>
              <input
                type="number"
                id="startBlock"
                name="startBlock"
                value={formData.startBlock}
                onChange={handleInputChange}
                placeholder="100000"
                min="0"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stopBlock">
                <Clock size={16} />
                Stop Block
              </label>
              <input
                type="number"
                id="stopBlock"
                name="stopBlock"
                value={formData.stopBlock}
                onChange={handleInputChange}
                placeholder="100100"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="paymentPerBlock">
              <Coins size={16} />
              Payment Per Block (STX)
            </label>
            <input
              type="number"
              id="paymentPerBlock"
              name="paymentPerBlock"
              value={formData.paymentPerBlock}
              onChange={handleInputChange}
              placeholder="0.1"
              min="0"
              step="0.000001"
              required
            />
          </div>

          <button 
            type="submit" 
            className="create-button"
            disabled={!isFormValid() || isLoading}
          >
            {isLoading ? 'Creating Stream...' : 'Create Stream'}
          </button>
        </form>

        <div className="stream-info">
          <h3>Stream Details</h3>
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Duration:</span>
              <span className="info-value">
                {formData.startBlock && formData.stopBlock 
                  ? `${contractUtils.calculateStreamDuration(parseInt(formData.startBlock), parseInt(formData.stopBlock))} blocks`
                  : 'N/A'
                }
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Payment:</span>
              <span className="info-value">
                {formData.paymentPerBlock && formData.startBlock && formData.stopBlock
                  ? `${contractUtils.calculateTotalPayment(parseFloat(formData.paymentPerBlock), contractUtils.calculateStreamDuration(parseInt(formData.startBlock), parseInt(formData.stopBlock))).toFixed(6)} STX`
                  : 'N/A'
                }
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
