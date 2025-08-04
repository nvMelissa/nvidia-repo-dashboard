'use client';

import { BugDashboard } from '@/components/BugDashboard'

// Static page for GitHub Pages - all data fetching happens client-side
export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Bug Dashboard */}
          <BugDashboard 
            initialIssues={[]} 
            initialRepository={'all'}
          />
          
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