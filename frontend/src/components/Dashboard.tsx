import React, { useState, useEffect } from 'react'
import { LayoutDashboard, Eye, RefreshCw } from 'lucide-react'
import { StreamCard } from './StreamCard'
import { contractFunctions } from '../utils/contract'
import type { StreamData } from '../utils/contract'

interface DashboardProps {
  userAddress: string
  userSession: any
}

export const Dashboard: React.FC<DashboardProps> = ({ userAddress, userSession }) => {
  const [streams, setStreams] = useState<StreamData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [, setLatestStreamId] = useState(0)

  const fetchAllStreams = async () => {
    setIsLoading(true)
    try {
      const latestId = await contractFunctions.getLatestStreamId(userAddress)
      setLatestStreamId(latestId)
      
      const streamPromises = []
      for (let i = 0; i < latestId; i++) {
        streamPromises.push(contractFunctions.getStream(i, userAddress))
      }
      
      const streamResults = await Promise.all(streamPromises)
      const validStreams = streamResults.filter(stream => stream !== null) as StreamData[]
      
      // Filter streams where user is either sender or recipient
      const userStreams = validStreams.filter(stream => 
        stream.sender === userAddress || stream.recipient === userAddress
      )
      
      setStreams(userStreams)
    } catch (error) {
      console.error('Error fetching streams:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchAllStreams()
  }, [userAddress])

  const handleRefresh = () => {
    fetchAllStreams()
  }

  const getStreamStats = () => {
    const sentStreams = streams.filter(s => s.sender === userAddress)
    const receivedStreams = streams.filter(s => s.recipient === userAddress)
    
    const totalSent = sentStreams.reduce((sum, s) => sum + s.balance, 0)
    const totalReceived = receivedStreams.reduce((sum, s) => sum + s.withdrawnBalance, 0)
    
    return {
      totalStreams: streams.length,
      sentStreams: sentStreams.length,
      receivedStreams: receivedStreams.length,
      totalSent,
      totalReceived
    }
  }

  const stats = getStreamStats()

  if (isLoading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">
          <RefreshCw className="loading-spinner" size={32} />
          <p>Loading your streams...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-title">
          <LayoutDashboard size={32} />
          <h2>Dashboard</h2>
        </div>
        <button className="refresh-button" onClick={handleRefresh}>
          <RefreshCw size={20} />
          Refresh
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>{stats.totalStreams}</h3>
            <p>Total Streams</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📤</div>
          <div className="stat-content">
            <h3>{stats.sentStreams}</h3>
            <p>Streams Sent</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📥</div>
          <div className="stat-content">
            <h3>{stats.receivedStreams}</h3>
            <p>Streams Received</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <h3>{stats.totalSent.toFixed(6)}</h3>
            <p>Total Sent (STX)</p>
          </div>
        </div>
      </div>

      <div className="streams-section">
        <div className="section-header">
          <Eye size={24} />
          <h3>Your Streams</h3>
        </div>
        
        {streams.length === 0 ? (
          <div className="empty-state">
            <p>No streams found. Create your first stream to get started!</p>
          </div>
        ) : (
          <div className="streams-grid">
            {streams.map(stream => (
              <StreamCard
                key={stream.id}
                stream={stream}
                userAddress={userAddress}
                userSession={userSession}
                onStreamUpdate={fetchAllStreams}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
