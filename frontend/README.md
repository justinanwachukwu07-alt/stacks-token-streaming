# STX Stream Frontend

A modern React frontend for the Stacks Token Streaming Protocol. This application allows users to create, manage, and interact with STX token streams on the Stacks blockchain.

## Features

### 🔗 Wallet Connection
- Connect with Stacks-compatible wallets (Leather, Xverse, etc.)
- Secure authentication using Stacks Connect
- Support for both testnet and mainnet

### 📊 Dashboard
- View all your streams (sent and received)
- Real-time stream statistics
- Quick access to stream operations

### 💰 Stream Creation
- Create new token streams with custom parameters
- Set recipient address, initial balance, and timeframes
- Configure payment per block rates
- Real-time stream calculation preview

### 🔄 Stream Management
- **Withdraw**: Recipients can withdraw available tokens
- **Refuel**: Senders can add more tokens to active streams
- **Refund**: Senders can reclaim excess tokens after stream completion
- **Update**: Modify stream parameters with dual-party consent (coming soon)

### 🎨 Modern UI/UX
- Beautiful gradient design with glassmorphism effects
- Responsive layout for all device sizes
- Intuitive navigation and user experience
- Real-time status indicators

## Technology Stack

- **React 19** - Modern React with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Stacks Connect** - Wallet integration
- **Stacks Transactions** - Blockchain interactions
- **Lucide React** - Beautiful icons
- **CSS3** - Modern styling with gradients and animations

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- A Stacks wallet (Leather, Xverse, etc.)

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

### Configuration

The application is configured to work with Stacks Testnet by default. To switch to mainnet:

1. Update the `NETWORK` constant in `src/App.tsx`
2. Update the contract address in component files
3. Ensure you have mainnet STX tokens

## Smart Contract Integration

The frontend integrates with the `stacks-token-streaming` smart contract with the following functions:

### Contract Functions Used

- `stream-to` - Create new streams
- `refuel` - Add tokens to existing streams
- `withdraw` - Withdraw available tokens
- `refund` - Reclaim excess tokens
- `balance-of` - Check available balances
- `get-stream` - Fetch stream details
- `get-latest-stream-id` - Get total stream count

### Contract Address

**Testnet**: `ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM` (replace with actual deployed address)

## Project Structure

```
src/
├── components/
│   ├── ConnectWallet.tsx    # Wallet connection interface
│   ├── Dashboard.tsx        # Main dashboard with stream overview
│   ├── CreateStream.tsx     # Stream creation form
│   ├── StreamCard.tsx       # Individual stream management
│   └── Header.tsx           # Navigation and wallet info
├── App.tsx                  # Main application component
├── App.css                  # Application styles
└── index.css               # Global styles
```

## Usage Guide

### 1. Connect Your Wallet
- Click "Connect Wallet" on the landing page
- Select your preferred Stacks wallet
- Approve the connection request

### 2. Create a Stream
- Navigate to "Create Stream" tab
- Fill in recipient address, initial balance, and timeframe
- Set payment per block rate
- Review stream details and submit transaction

### 3. Manage Streams
- View all your streams on the Dashboard
- Click on any stream to expand and see details
- Use available actions based on your role:
  - **As Recipient**: Withdraw available tokens
  - **As Sender**: Refuel active streams or refund excess tokens

### 4. Monitor Activity
- Check stream status (Pending, Active, Completed)
- View real-time balance calculations
- Track transaction history on Stacks Explorer

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Environment Variables

Create a `.env` file for environment-specific configuration:

```env
VITE_CONTRACT_ADDRESS=ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
VITE_NETWORK=testnet
```

## Security Considerations

- All transactions are signed by the user's wallet
- Private keys never leave the user's device
- Contract interactions use proper error handling
- Input validation prevents invalid transactions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the Stacks Developer Degree program.

## Support

For issues and questions:
- Check the [Stacks Documentation](https://docs.stacks.co/)
- Join the [Stacks Discord](https://discord.gg/stacks)
- Review the smart contract code in the parent directory

## Roadmap

- [ ] Stream parameter updates with signature verification
- [ ] Advanced filtering and search for streams
- [ ] Stream analytics and reporting
- [ ] Mobile app development
- [ ] Multi-token support (SIP-010 tokens)
- [ ] Stream templates and presets