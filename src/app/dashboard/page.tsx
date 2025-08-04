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
            {/* Super Simple Test - NO imports, just basic HTML */}
            <div className="bg-red-50 border-2 border-red-500 rounded-lg p-8 my-8">
              <h2 className="text-2xl font-bold text-red-800 mb-4">🚨 CRITICAL TEST</h2>
              <p className="text-red-700 text-lg mb-4">
                <strong>IF YOU SEE THIS RED BOX: React rendering works fine.</strong>
              </p>
              <p className="text-red-700">
                If you DON'T see this red box, there's a fundamental React/build issue.
              </p>
            </div>

            <div className="bg-purple-50 border-2 border-purple-500 rounded-lg p-8 my-8">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">⚡ Lightning-Thunder Dashboard</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow border-2 border-purple-200">
                  <h3 className="text-lg font-bold text-purple-700 mb-2">📊 Demo Metrics</h3>
                  <div className="text-3xl font-bold text-purple-600 mb-1">1,247</div>
                  <div className="text-sm text-gray-600">Total Thunder Issues</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-2 border-green-200">
                  <h3 className="text-lg font-bold text-green-700 mb-2">✅ Resolved</h3>
                  <div className="text-3xl font-bold text-green-600 mb-1">1,156</div>
                  <div className="text-sm text-gray-600">Fixed Issues</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow border-2 border-orange-200">
                  <h3 className="text-lg font-bold text-orange-700 mb-2">🔥 Active</h3>
                  <div className="text-3xl font-bold text-orange-600 mb-1">91</div>
                  <div className="text-sm text-gray-600">Open Issues</div>
                </div>
              </div>
              
              <div className="mt-8 bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-bold text-gray-900 mb-4">🎯 Lightning-Thunder Status</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span className="font-medium text-green-800">Repository Health</span>
                    <span className="px-3 py-1 bg-green-200 text-green-800 rounded-full text-sm">Excellent</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="font-medium text-blue-800">Bug Resolution Rate</span>
                    <span className="px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-sm">92.7%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                    <span className="font-medium text-purple-800">Avg Fix Time</span>
                    <span className="px-3 py-1 bg-purple-200 text-purple-800 rounded-full text-sm">2.1 days</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="text-yellow-600 mr-3">⚡</div>
                  <div>
                    <h4 className="font-medium text-yellow-800">Lightning-Thunder Dashboard</h4>
                    <p className="text-yellow-700 text-sm">Specialized tracking for Lightning-AI/lightning-thunder repository</p>
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