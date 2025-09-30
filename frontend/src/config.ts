// Application configuration
export const APP_CONFIG = {
  name: 'STX Stream',
  description: 'Token Streaming Protocol',
  version: '1.0.0',
  debug: import.meta.env.VITE_DEBUG === 'true' || false,
}

// Network configuration
export const NETWORK_CONFIG = {
  testnet: {
    name: 'testnet',
    explorer: 'https://explorer.stacks.co',
    faucet: 'https://explorer.stacks.co/sandbox/faucet',
  },
  mainnet: {
    name: 'mainnet',
    explorer: 'https://explorer.stacks.co',
  }
}

// Contract configuration
export const CONTRACT_CONFIG = {
  address: import.meta.env.VITE_CONTRACT_ADDRESS || 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  name: import.meta.env.VITE_CONTRACT_NAME || 'stacks-token-streaming',
  network: import.meta.env.VITE_NETWORK || 'testnet',
}

// UI configuration
export const UI_CONFIG = {
  itemsPerPage: 10,
  refreshInterval: 30000, // 30 seconds
  animationDuration: 200,
  maxRetries: 3,
}

// Feature flags
export const FEATURE_FLAGS = {
  enableStreamUpdates: false, // Stream parameter updates with signatures
  enableAnalytics: false,     // Stream analytics and reporting
  enableNotifications: false, // Push notifications for stream events
  enableMultiToken: false,    // Support for SIP-010 tokens
}

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred. Please check your connection and try again.',
  WALLET_NOT_CONNECTED: 'Please connect your wallet to continue.',
  INSUFFICIENT_BALANCE: 'Insufficient balance for this operation.',
  INVALID_ADDRESS: 'Invalid Stacks address provided.',
  TRANSACTION_FAILED: 'Transaction failed. Please try again.',
  CONTRACT_ERROR: 'Smart contract error occurred.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
}

// Success messages
export const SUCCESS_MESSAGES = {
  STREAM_CREATED: 'Stream created successfully!',
  STREAM_REFUELED: 'Stream refueled successfully!',
  WITHDRAWAL_SUCCESS: 'Withdrawal completed successfully!',
  REFUND_SUCCESS: 'Refund completed successfully!',
  WALLET_CONNECTED: 'Wallet connected successfully!',
}

// Validation rules
export const VALIDATION_RULES = {
  minStreamAmount: 0.000001, // Minimum 1 microSTX
  maxStreamAmount: 1000000,  // Maximum 1M STX
  minBlockDuration: 1,       // Minimum 1 block duration
  maxBlockDuration: 1000000, // Maximum 1M blocks duration
  minPaymentPerBlock: 0.000001, // Minimum 1 microSTX per block
  maxPaymentPerBlock: 1000,  // Maximum 1000 STX per block
}

// API endpoints (if needed for future features)
export const API_ENDPOINTS = {
  blockHeight: 'https://api.stacks.co/v2/info',
  accountInfo: 'https://api.stacks.co/v2/accounts',
  transactionInfo: 'https://api.stacks.co/v2/transactions',
}
