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
            {/* Test if basic React works */}
            <div className="bg-white rounded-lg shadow p-8 mb-6">
              <h2 className="text-2xl font-bold text-green-600 mb-4">✅ React is Working!</h2>
              <p className="text-gray-600 mb-4">If you see this green message, React components are loading correctly.</p>
              <div className="bg-blue-50 border border-blue-200 rounded p-4">
                <p className="text-blue-800 font-medium">Dashboard Status: Testing React Components</p>
                <p className="text-blue-600 text-sm mt-1">This is a simplified test to isolate the issue.</p>
              </div>
            </div>

            {/* Simplified Dashboard Test */}
            <Suspense fallback={
              <div className="bg-white rounded-lg shadow p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading Dashboard Components...</p>
              </div>
            }>
              <div className="bg-white rounded-lg shadow p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Dashboard Components</h3>
                <p className="text-gray-600 mb-4">Testing component loading...</p>
                {/* Simplified Working Dashboard */}
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                    <h4 className="text-lg font-bold text-blue-900 mb-3">🚀 NVIDIA Bug Tracking Dashboard</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h5 className="font-semibold text-gray-800 mb-2">📊 TransformerEngine</h5>
                        <div className="text-2xl font-bold text-green-600">2,847</div>
                        <div className="text-sm text-gray-600">Total Issues Tracked</div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h5 className="font-semibold text-gray-800 mb-2">🔥 Fuser</h5>
                        <div className="text-2xl font-bold text-blue-600">1,523</div>
                        <div className="text-sm text-gray-600">Total Issues Tracked</div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h5 className="font-semibold text-gray-800 mb-2">⚡ Lightning-Thunder</h5>
                        <div className="text-2xl font-bold text-purple-600">527</div>
                        <div className="text-sm text-gray-600">Total Issues Tracked</div>
                      </div>
                      
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-lg p-6 shadow">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">📈 Key Metrics</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-500">94%</div>
                        <div className="text-sm text-gray-600">Bug Resolution Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-500">2.3</div>
                        <div className="text-sm text-gray-600">Avg Days to Fix</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-purple-500">156</div>
                        <div className="text-sm text-gray-600">Open Bugs</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-orange-500">28</div>
                        <div className="text-sm text-gray-600">Critical Issues</div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow">
                    <h4 className="text-lg font-bold text-gray-900 mb-4">🎯 Repository Status</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                        <span className="font-medium text-green-800">NVIDIA/TransformerEngine</span>
                        <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm font-medium">Healthy</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                        <span className="font-medium text-blue-800">NVIDIA/Fuser</span>
                        <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm font-medium">Active</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                        <span className="font-medium text-purple-800">Lightning-AI/lightning-thunder</span>
                        <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm font-medium">Monitored</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <div className="text-yellow-600 mr-3">⚠️</div>
                      <div>
                        <h5 className="font-medium text-yellow-800">Dashboard Status</h5>
                        <p className="text-yellow-700 text-sm">Currently showing demo data. Connect GitHub token for live metrics.</p>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </Suspense>
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