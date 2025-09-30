import React, { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, XCircle, RefreshCw } from 'lucide-react'

export const WalletDiagnostic: React.FC = () => {
  const [diagnostics, setDiagnostics] = useState<{
    wallets: string[]
    conflicts: string[]
    errors: string[]
    recommendations: string[]
  }>({
    wallets: [],
    conflicts: [],
    errors: [],
    recommendations: []
  })

  const [isVisible, setIsVisible] = useState(false)

  const runDiagnostics = () => {
    const wallets: string[] = []
    const conflicts: string[] = []
    const errors: string[] = []
    const recommendations: string[] = []

    // Check for wallet extensions
    if (typeof window !== 'undefined') {
      if (window.Leather) wallets.push('Leather')
      if (window.Xverse) wallets.push('Xverse')
      if (window.Hiro) wallets.push('Hiro')
    }

    // Check for conflicts
    if (wallets.length > 1) {
      conflicts.push(`Multiple wallets detected: ${wallets.join(', ')}`)
      recommendations.push('Disable all wallet extensions except one')
      recommendations.push('Refresh the page after disabling extensions')
    }

    // Check for specific errors
    const consoleErrors = [
      'StacksProvider',
      'Cannot redefine property',
      'L1 is not a function',
      'immutable way'
    ]

    // Check if we're in a problematic state
    if (wallets.length === 0) {
      errors.push('No Stacks wallet detected')
      recommendations.push('Install Leather, Xverse, or Hiro wallet')
    }

    if (conflicts.length > 0) {
      errors.push('Wallet provider conflicts detected')
    }

    setDiagnostics({
      wallets,
      conflicts,
      errors,
      recommendations
    })
  }

  useEffect(() => {
    runDiagnostics()
  }, [])

  if (!isVisible) {
    return (
      <button 
        className="diagnostic-toggle"
        onClick={() => setIsVisible(true)}
      >
        <AlertTriangle size={16} />
        Wallet Diagnostic
      </button>
    )
  }

  return (
    <div className="wallet-diagnostic">
      <div className="diagnostic-header">
        <h3>Wallet Diagnostic Tool</h3>
        <button 
          className="close-diagnostic"
          onClick={() => setIsVisible(false)}
        >
          ×
        </button>
      </div>

      <div className="diagnostic-content">
        <div className="diagnostic-section">
          <h4>Detected Wallets</h4>
          {diagnostics.wallets.length > 0 ? (
            <div className="wallet-list">
              {diagnostics.wallets.map((wallet, index) => (
                <div key={index} className="wallet-item success">
                  <CheckCircle size={16} />
                  {wallet}
                </div>
              ))}
            </div>
          ) : (
            <div className="wallet-item error">
              <XCircle size={16} />
              No wallets detected
            </div>
          )}
        </div>

        {diagnostics.conflicts.length > 0 && (
          <div className="diagnostic-section">
            <h4>Conflicts Detected</h4>
            {diagnostics.conflicts.map((conflict, index) => (
              <div key={index} className="conflict-item">
                <AlertTriangle size={16} />
                {conflict}
              </div>
            ))}
          </div>
        )}

        {diagnostics.errors.length > 0 && (
          <div className="diagnostic-section">
            <h4>Issues Found</h4>
            {diagnostics.errors.map((error, index) => (
              <div key={index} className="error-item">
                <XCircle size={16} />
                {error}
              </div>
            ))}
          </div>
        )}

        {diagnostics.recommendations.length > 0 && (
          <div className="diagnostic-section">
            <h4>Recommendations</h4>
            <ul className="recommendations-list">
              {diagnostics.recommendations.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="diagnostic-actions">
          <button 
            className="refresh-diagnostic"
            onClick={runDiagnostics}
          >
            <RefreshCw size={16} />
            Refresh Diagnostics
          </button>
        </div>
      </div>
    </div>
  )
}
