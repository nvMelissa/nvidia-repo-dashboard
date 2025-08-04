'use client';

import { BugDashboard } from '@/components/BugDashboard'
import { Suspense } from 'react'

// Static page for GitHub Pages - all data fetching happens client-side
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Bug Dashboard */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">NVIDIA Repository Dashboard</h1>
            {/* Full Interactive Lightning-Thunder Dashboard */}
            <BugDashboard 
              initialIssues={[]} 
              initialRepository={'lightning-thunder'}
            />
          </div>
          
          {/* About Section with Inline Styles */}
          <div style={{
            marginTop: '32px',
            backgroundColor: 'white',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            padding: '24px'
          }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '16px'
            }}>About This Lightning-Thunder Dashboard</h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '24px',
              fontSize: '14px',
              color: '#4b5563'
            }}>
              <div>
                <h4 style={{
                  fontWeight: '500',
                  color: '#111827',
                  marginBottom: '8px'
                }}>Data Sources</h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  <li style={{ marginBottom: '4px' }}>• NVIDIA/TransformerEngine</li>
                  <li style={{ marginBottom: '4px' }}>• NVIDIA/Fuser</li>
                  <li style={{ marginBottom: '4px', fontWeight: '600', color: '#7c3aed' }}>• Lightning-AI/lightning-thunder</li>
                </ul>
              </div>
              
              <div>
                <h4 style={{
                  fontWeight: '500',
                  color: '#111827',
                  marginBottom: '8px'
                }}>Metrics Tracked</h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  <li style={{ marginBottom: '4px' }}>• Bug burn rate</li>
                  <li style={{ marginBottom: '4px' }}>• Resolution time</li>
                  <li style={{ marginBottom: '4px' }}>• Recent activity</li>
                  <li style={{ marginBottom: '4px' }}>• Repository comparison</li>
                </ul>
              </div>
              
              <div>
                <h4 style={{
                  fontWeight: '500',
                  color: '#111827',
                  marginBottom: '8px'
                }}>Update Frequency</h4>
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0
                }}>
                  <li style={{ marginBottom: '4px' }}>• Real-time via GitHub API</li>
                  <li style={{ marginBottom: '4px' }}>• Manual refresh available</li>
                  <li style={{ marginBottom: '4px' }}>• Rate limit: 5000/hour</li>
                  <li style={{ marginBottom: '4px' }}>• Cached for performance</li>
                </ul>
              </div>
            </div>
            
            <div style={{
              marginTop: '20px',
              padding: '12px',
              backgroundColor: '#f3f4f6',
              borderRadius: '6px',
              borderLeft: '4px solid #8b5cf6'
            }}>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#374151',
                fontStyle: 'italic'
              }}>
                ⚡ This dashboard is specifically optimized for tracking Lightning-AI/lightning-thunder repository metrics and team performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}