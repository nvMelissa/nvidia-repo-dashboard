'use client';

import { useSearchParams } from 'next/navigation';
import { BugDashboard } from '@/components/BugDashboard'

// Client-side page for local development
export default function DashboardPage() {
  const searchParams = useSearchParams();
  const repo = searchParams.get('repo') || 'lightning-thunder';
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Bug Dashboard */}
          <BugDashboard 
            initialIssues={[]} 
            initialRepository={repo as 'lightning-thunder' | 'TransformerEngine' | 'Fuser' | 'all'}
          />
        </div>
      </div>
    </div>
  )
}