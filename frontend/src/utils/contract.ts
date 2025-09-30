import { makeContractCall, fetchCallReadOnlyFunction, cvToValue } from '@stacks/transactions'
import { STACKS_TESTNET, STACKS_MAINNET } from '@stacks/network'
import { CONTRACT_CONFIG } from '../config'

// Network configuration
export const NETWORK_CONFIG = {
  testnet: STACKS_TESTNET,
  mainnet: STACKS_MAINNET,
}

// Get the appropriate network instance
const getNetwork = () => {
  return CONTRACT_CONFIG.network === 'mainnet' ? STACKS_MAINNET : STACKS_TESTNET
}

// Utility functions for contract interactions
export const contractUtils = {
  // Convert STX to microSTX
  stxToMicroStx: (stx: number): number => Math.floor(stx * 1000000),
  
  // Convert microSTX to STX
  microStxToStx: (microStx: number): number => microStx / 1000000,
  
  // Format address for display
  formatAddress: (address: string): string => {
    if (!address) return ''
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  },
  
  // Get current block height (mock for now - should be fetched from network)
  getCurrentBlockHeight: (): number => {
    // In a real implementation, this should fetch from the network
    return 100000
  },
  
  // Calculate stream duration in blocks
  calculateStreamDuration: (startBlock: number, stopBlock: number): number => {
    return stopBlock - startBlock
  },
  
  // Calculate total payment for a stream
  calculateTotalPayment: (paymentPerBlock: number, duration: number): number => {
    return paymentPerBlock * duration
  }
}

// Contract function interfaces
export type StreamData = {
  id: number
  sender: string
  recipient: string
  balance: number
  withdrawnBalance: number
  paymentPerBlock: number
  timeframe: {
    startBlock: number
    stopBlock: number
  }
}

export type CreateStreamParams = {
  recipient: string
  initialBalance: number
  startBlock: number
  stopBlock: number
  paymentPerBlock: number
}

// Contract interaction functions
export const contractFunctions = {
  // Create a new stream
  createStream: async (
    params: CreateStreamParams,
    userSession: any,
    onFinish?: (data: any) => void,
    onCancel?: () => void
  ) => {
    const functionArgs = [
      params.recipient,
      contractUtils.stxToMicroStx(params.initialBalance),
      {
        'start-block': params.startBlock,
        'stop-block': params.stopBlock
      },
      contractUtils.stxToMicroStx(params.paymentPerBlock)
    ]

    const options = {
      contractAddress: CONTRACT_CONFIG.address,
      contractName: CONTRACT_CONFIG.name,
      functionName: 'stream-to',
      functionArgs,
      network: getNetwork(),
      senderKey: userSession.loadUserData().appPrivateKey,
      fee: 10000,
      onFinish,
      onCancel
    }

    return await makeContractCall(options)
  },

  // Refuel a stream
  refuelStream: async (
    streamId: number,
    amount: number,
    userSession: any,
    onFinish?: (data: any) => void,
    onCancel?: () => void
  ) => {
    const options = {
      contractAddress: CONTRACT_CONFIG.address,
      contractName: CONTRACT_CONFIG.name,
      functionName: 'refuel',
      functionArgs: [streamId, contractUtils.stxToMicroStx(amount)],
      network: getNetwork(),
      senderKey: userSession.loadUserData().appPrivateKey,
      fee: 10000,
      onFinish,
      onCancel
    }

    return await makeContractCall(options)
  },

  // Withdraw from a stream
  withdrawFromStream: async (
    streamId: number,
    userSession: any,
    onFinish?: (data: any) => void,
    onCancel?: () => void
  ) => {
    const options = {
      contractAddress: CONTRACT_CONFIG.address,
      contractName: CONTRACT_CONFIG.name,
      functionName: 'withdraw',
      functionArgs: [streamId],
      network: getNetwork(),
      senderKey: userSession.loadUserData().appPrivateKey,
      fee: 10000,
      onFinish,
      onCancel
    }

    return await makeContractCall(options)
  },

  // Refund excess tokens
  refundStream: async (
    streamId: number,
    userSession: any,
    onFinish?: (data: any) => void,
    onCancel?: () => void
  ) => {
    const options = {
      contractAddress: CONTRACT_CONFIG.address,
      contractName: CONTRACT_CONFIG.name,
      functionName: 'refund',
      functionArgs: [streamId],
      network: getNetwork(),
      senderKey: userSession.loadUserData().appPrivateKey,
      fee: 10000,
      onFinish,
      onCancel
    }

    return await makeContractCall(options)
  },

  // Get stream data
  getStream: async (streamId: number, userAddress: string): Promise<StreamData | null> => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_CONFIG.address,
        contractName: CONTRACT_CONFIG.name,
        functionName: 'get-stream',
        functionArgs: [streamId],
        network: getNetwork(),
        senderAddress: userAddress,
      })
      
      const streamData = cvToValue(result)
      if (streamData) {
        return {
          id: streamId,
          sender: streamData.sender,
          recipient: streamData.recipient,
          balance: contractUtils.microStxToStx(streamData.balance),
          withdrawnBalance: contractUtils.microStxToStx(streamData.withdrawnBalance),
          paymentPerBlock: contractUtils.microStxToStx(streamData.paymentPerBlock),
          timeframe: {
            startBlock: streamData.timeframe['start-block'],
            stopBlock: streamData.timeframe['stop-block']
          }
        }
      }
      return null
    } catch (error) {
      console.error(`Error fetching stream ${streamId}:`, error)
      return null
    }
  },

  // Get latest stream ID
  getLatestStreamId: async (userAddress: string): Promise<number> => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_CONFIG.address,
        contractName: CONTRACT_CONFIG.name,
        functionName: 'get-latest-stream-id',
        functionArgs: [],
        network: getNetwork(),
        senderAddress: userAddress,
      })
      
      return cvToValue(result)
    } catch (error) {
      console.error('Error fetching latest stream ID:', error)
      return 0
    }
  },

  // Get balance for a user in a stream
  getStreamBalance: async (streamId: number, userAddress: string): Promise<number> => {
    try {
      const result = await fetchCallReadOnlyFunction({
        contractAddress: CONTRACT_CONFIG.address,
        contractName: CONTRACT_CONFIG.name,
        functionName: 'balance-of',
        functionArgs: [streamId, userAddress],
        network: getNetwork(),
        senderAddress: userAddress,
      })
      
      return contractUtils.microStxToStx(cvToValue(result))
    } catch (error) {
      console.error('Error fetching stream balance:', error)
      return 0
    }
  }
}

// Error handling utilities
export const errorUtils = {
  // Parse contract error messages
  parseContractError: (error: any): string => {
    if (error.message) {
      return error.message
    }
    if (error.reason) {
      return error.reason
    }
    return 'An unknown error occurred'
  },

  // Common error messages
  errorMessages: {
    UNAUTHORIZED: 'You are not authorized to perform this action',
    INVALID_STREAM: 'Stream not found or invalid',
    INSUFFICIENT_BALANCE: 'Insufficient balance for this operation',
    STREAM_ACTIVE: 'Stream is still active and cannot be refunded',
    INVALID_SIGNATURE: 'Invalid signature provided',
    NETWORK_ERROR: 'Network error occurred. Please try again.'
  }
}
