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
            {/* Debug: Test if BugDashboard loads at all */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-green-800 mb-2">🔍 Debug: Testing BugDashboard Component</h2>
              <p className="text-green-700 mb-4">If you see this green box but nothing below it, the BugDashboard component is failing.</p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-bold text-blue-800 mb-4">Loading BugDashboard...</h3>
              <div className="mb-4">
                <div className="animate-pulse bg-blue-200 h-4 rounded mb-2"></div>
                <div className="animate-pulse bg-blue-200 h-4 rounded w-3/4"></div>
              </div>
              
              <BugDashboard 
                initialIssues={[]} 
                initialRepository={'lightning-thunder'}
              />
              
              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                <p className="text-yellow-800 text-sm">
                  ⚠️ If you see this yellow box, the BugDashboard rendered but might be empty.
                </p>
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