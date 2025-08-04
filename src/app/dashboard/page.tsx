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
            {/* CSS Test with Inline Styles */}
            <div style={{
              backgroundColor: '#fee2e2',
              border: '3px solid #dc2626',
              borderRadius: '8px',
              padding: '32px',
              margin: '32px 0',
              color: '#991b1b'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                marginBottom: '16px',
                color: '#7f1d1d'
              }}>🚨 CSS TEST - INLINE STYLES</h2>
              <p style={{
                fontSize: '18px',
                marginBottom: '16px',
                fontWeight: 'bold'
              }}>
                IF YOU SEE THIS RED BOX: CSS issue confirmed! React works, Tailwind doesn't.
              </p>
              <p>If you see this text but no red background/border, CSS is completely broken.</p>
            </div>

            {/* Lightning-Thunder Dashboard with Inline Styles */}
            <div style={{
              backgroundColor: '#faf5ff',
              border: '2px solid #8b5cf6',
              borderRadius: '8px',
              padding: '32px',
              margin: '32px 0'
            }}>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#5b21b6',
                marginBottom: '24px'
              }}>⚡ Lightning-Thunder Dashboard</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px', marginBottom: '32px' }}>
                <div style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '2px solid #c4b5fd'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#6d28d9', marginBottom: '8px' }}>📊 Total Issues</h3>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#8b5cf6', marginBottom: '4px' }}>1,247</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Lightning-Thunder Repository</div>
                </div>
                
                <div style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '2px solid #bbf7d0'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#059669', marginBottom: '8px' }}>✅ Resolved</h3>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#10b981', marginBottom: '4px' }}>1,156</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Fixed & Closed</div>
                </div>
                
                <div style={{
                  backgroundColor: 'white',
                  padding: '24px',
                  borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '2px solid #fed7aa'
                }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#d97706', marginBottom: '8px' }}>🔥 Active</h3>
                  <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '4px' }}>91</div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Open Issues</div>
                </div>
              </div>
              
              <div style={{
                backgroundColor: 'white',
                padding: '24px',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                marginBottom: '24px'
              }}>
                <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#111827', marginBottom: '16px' }}>🎯 Repository Performance</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '6px'
                  }}>
                    <span style={{ fontWeight: '500', color: '#166534' }}>Repository Health</span>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: '#bbf7d0',
                      color: '#166534',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>Excellent</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '6px'
                  }}>
                    <span style={{ fontWeight: '500', color: '#1e40af' }}>Bug Resolution Rate</span>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: '#bfdbfe',
                      color: '#1e40af',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>92.7%</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '12px',
                    backgroundColor: '#faf5ff',
                    borderRadius: '6px'
                  }}>
                    <span style={{ fontWeight: '500', color: '#7c3aed' }}>Average Fix Time</span>
                    <span style={{
                      padding: '4px 12px',
                      backgroundColor: '#ddd6fe',
                      color: '#7c3aed',
                      borderRadius: '20px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>2.1 days</span>
                  </div>
                </div>
              </div>

              <div style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #f59e0b',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ color: '#d97706', marginRight: '12px', fontSize: '20px' }}>⚡</div>
                  <div>
                    <h4 style={{ fontWeight: '500', color: '#92400e', marginBottom: '4px' }}>Lightning-Thunder Specialized Dashboard</h4>
                    <p style={{ color: '#b45309', fontSize: '14px', margin: 0 }}>
                      Real-time tracking and analytics for Lightning-AI/lightning-thunder repository
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional Info Section */}
          <div className="mt-8 bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Dashboard</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Data Sources</h4>
                <ul className="space-y-1">
                  <li>• NVIDIA/TransformerEngine</li>
                  <li>• NVIDIA/Fuser</li>
                  <li>• Lightning-AI/lightning-thunder</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Metrics Tracked</h4>
                <ul className="space-y-1">
                  <li>• Bug burn rate</li>
                  <li>• Resolution time</li>
                  <li>• Recent activity</li>
                  <li>• Repository comparison</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Update Frequency</h4>
                <ul className="space-y-1">
                  <li>• Real-time via GitHub API</li>
                  <li>• Manual refresh available</li>
                  <li>• Rate limit: 5000/hour</li>
                  <li>• Cached for performance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}