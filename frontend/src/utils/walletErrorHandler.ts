// Wallet Error Handler Utility
// Handles common wallet provider conflicts and errors

export interface WalletError {
  type: 'PROVIDER_CONFLICT' | 'CONNECTION_FAILED' | 'USER_CANCELLED' | 'UNKNOWN'
  message: string
  originalError?: any
}

export const handleWalletError = (error: any): WalletError => {
  console.error('Wallet error:', error)

  // Check for provider conflicts
  if (error?.message?.includes('StacksProvider') || 
      error?.message?.includes('immutable') ||
      error?.message?.includes('Cannot redefine property')) {
    return {
      type: 'PROVIDER_CONFLICT',
      message: 'Multiple wallet extensions detected. Please disable other Stacks wallets and refresh the page.',
      originalError: error
    }
  }

  // Check for connection failures
  if (error?.message?.includes('connection') || 
      error?.message?.includes('failed') ||
      error?.message?.includes('timeout')) {
    return {
      type: 'CONNECTION_FAILED',
      message: 'Failed to connect to wallet. Please ensure your wallet is unlocked and try again.',
      originalError: error
    }
  }

  // Check for user cancellation
  if (error?.message?.includes('cancelled') || 
      error?.message?.includes('rejected') ||
      error?.message?.includes('denied')) {
    return {
      type: 'USER_CANCELLED',
      message: 'Wallet connection was cancelled by user.',
      originalError: error
    }
  }

  // Unknown error
  return {
    type: 'UNKNOWN',
    message: 'An unexpected error occurred. Please try refreshing the page.',
    originalError: error
  }
}

export const getWalletTroubleshootingSteps = (errorType: WalletError['type']): string[] => {
  switch (errorType) {
    case 'PROVIDER_CONFLICT':
      return [
        'Disable other Stacks wallet extensions (Xverse, Leather, Hiro)',
        'Keep only one wallet extension enabled',
        'Refresh the page after disabling other wallets',
        'Try using an incognito/private browser window'
      ]
    
    case 'CONNECTION_FAILED':
      return [
        'Make sure your wallet is unlocked',
        'Check that you\'re on the correct network (Testnet)',
        'Try disconnecting and reconnecting your wallet',
        'Restart your browser if the issue persists'
      ]
    
    case 'USER_CANCELLED':
      return [
        'Click "Connect Wallet" again',
        'Make sure to approve the connection in your wallet',
        'Check that your wallet popup isn\'t blocked'
      ]
    
    default:
      return [
        'Refresh the page and try again',
        'Clear your browser cache and cookies',
        'Try using a different browser',
        'Use the demo addresses below for testing'
      ]
  }
}

// Global error handler for unhandled wallet errors
export const setupGlobalWalletErrorHandler = () => {
  if (typeof window === 'undefined') return

  const originalError = window.onerror
  const originalUnhandledRejection = window.onunhandledrejection

  window.onerror = (message, source, lineno, colno, error) => {
    // Check if it's a wallet-related error
    if (typeof message === 'string' && 
        (message.includes('StacksProvider') || 
         message.includes('wallet') || 
         message.includes('L1 is not a function'))) {
      
      console.warn('Wallet error detected:', message)
      // Don't prevent default handling, just log it
    }
    
    // Call original error handler if it exists
    if (originalError) {
      return originalError(message, source, lineno, colno, error)
    }
  }

  window.onunhandledrejection = (event) => {
    // Check if it's a wallet-related promise rejection
    if (event.reason && 
        typeof event.reason === 'object' &&
        (event.reason.message?.includes('StacksProvider') ||
         event.reason.message?.includes('wallet'))) {
      
      console.warn('Wallet promise rejection:', event.reason)
      // Don't prevent default handling, just log it
    }
    
    // Call original handler if it exists
    if (originalUnhandledRejection) {
      return originalUnhandledRejection(event)
    }
  }
}

// Check if wallet extensions are available
export const checkWalletAvailability = (): { available: boolean; wallets: string[] } => {
  if (typeof window === 'undefined') {
    return { available: false, wallets: [] }
  }

  const wallets: string[] = []
  
  // Check for common Stacks wallets
  if (window.Leather) wallets.push('Leather')
  if (window.Xverse) wallets.push('Xverse')
  if (window.Hiro) wallets.push('Hiro')
  
  return {
    available: wallets.length > 0,
    wallets
  }
}
