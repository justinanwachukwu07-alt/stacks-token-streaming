import React, { useState } from 'react'
import { Settings, Save, X, AlertCircle } from 'lucide-react'
import { contractFunctions, contractUtils } from '../utils/contract'
import type { StreamData } from '../utils/contract'

interface UpdateStreamProps {
  stream: StreamData
  userAddress: string
  userSession: any
  onStreamUpdate: () => void
  onClose: () => void
}

export const UpdateStream: React.FC<UpdateStreamProps> = ({
  stream,
  userAddress,
  userSession,
  onStreamUpdate,
  onClose
}) => {
  const [formData, setFormData] = useState({
    newPaymentPerBlock: stream.paymentPerBlock.toString(),
    newStartBlock: stream.timeframe.startBlock.toString(),
    newStopBlock: stream.timeframe.stopBlock.toString(),
    signerAddress: '',
    signature: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

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
    setError('')
    setSuccess('')

    try {
      const newPaymentPerBlock = parseFloat(formData.newPaymentPerBlock)
      const newStartBlock = parseInt(formData.newStartBlock)
      const newStopBlock = parseInt(formData.newStopBlock)

      // Validate inputs
      if (newPaymentPerBlock <= 0) {
        throw new Error('Payment per block must be greater than 0')
      }
      if (newStartBlock >= newStopBlock) {
        throw new Error('Start block must be before stop block')
      }
      if (!formData.signerAddress) {
        throw new Error('Signer address is required')
      }
      if (!formData.signature) {
        throw new Error('Signature is required')
      }

      // Call the contract function
      await contractFunctions.updateStreamDetails(
        stream.id,
        newPaymentPerBlock,
        { startBlock: newStartBlock, stopBlock: newStopBlock },
        formData.signerAddress,
        formData.signature,
        userSession,
        (data) => {
          setSuccess('Stream updated successfully!')
          onStreamUpdate()
          setTimeout(() => {
            onClose()
          }, 2000)
        },
        () => {
          setError('Transaction was cancelled')
        }
      )
    } catch (err: any) {
      setError(err.message || 'Failed to update stream')
    } finally {
      setIsLoading(false)
    }
  }

  const isSender = userAddress === stream.sender
  const isRecipient = userAddress === stream.recipient

  return (
    <div className="update-stream-overlay">
      <div className="update-stream-modal">
        <div className="modal-header">
          <div className="modal-title">
            <Settings size={24} />
            <h3>Update Stream Parameters</h3>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-content">
          <div className="stream-info">
            <p><strong>Stream ID:</strong> {stream.id}</p>
            <p><strong>Your Role:</strong> {isSender ? 'Sender' : isRecipient ? 'Recipient' : 'Unknown'}</p>
            <p><strong>Current Payment/Block:</strong> {stream.paymentPerBlock} STX</p>
            <p><strong>Current Timeframe:</strong> Block {stream.timeframe.startBlock} - {stream.timeframe.stopBlock}</p>
          </div>

          <form onSubmit={handleSubmit} className="update-form">
            <div className="form-group">
              <label htmlFor="newPaymentPerBlock">New Payment Per Block (STX)</label>
              <input
                type="number"
                id="newPaymentPerBlock"
                name="newPaymentPerBlock"
                value={formData.newPaymentPerBlock}
                onChange={handleInputChange}
                step="0.000001"
                min="0.000001"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="newStartBlock">New Start Block</label>
                <input
                  type="number"
                  id="newStartBlock"
                  name="newStartBlock"
                  value={formData.newStartBlock}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newStopBlock">New Stop Block</label>
                <input
                  type="number"
                  id="newStopBlock"
                  name="newStopBlock"
                  value={formData.newStopBlock}
                  onChange={handleInputChange}
                  min={parseInt(formData.newStartBlock) + 1}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="signerAddress">Signer Address</label>
              <input
                type="text"
                id="signerAddress"
                name="signerAddress"
                value={formData.signerAddress}
                onChange={handleInputChange}
                placeholder="Enter the address of the other party"
                required
              />
              <small>This should be the address of the other party (sender or recipient)</small>
            </div>

            <div className="form-group">
              <label htmlFor="signature">Signature</label>
              <input
                type="text"
                id="signature"
                name="signature"
                value={formData.signature}
                onChange={handleInputChange}
                placeholder="Enter the cryptographic signature"
                required
              />
              <small>This should be a valid signature from the other party</small>
            </div>

            {error && (
              <div className="error-message">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            {success && (
              <div className="success-message">
                <AlertCircle size={16} />
                {success}
              </div>
            )}

            <div className="form-actions">
              <button type="button" className="cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="update-btn" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Stream'}
                <Save size={16} />
              </button>
            </div>
          </form>

          <div className="update-info">
            <h4>How Stream Updates Work:</h4>
            <ul>
              <li>Both sender and recipient must agree to the changes</li>
              <li>One party initiates the update with new parameters</li>
              <li>The other party signs the update to approve it</li>
              <li>Once both parties agree, the stream parameters are updated</li>
              <li>This ensures no single party can modify the stream unilaterally</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
