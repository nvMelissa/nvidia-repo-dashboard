// GitHub API route for fetching bug data following cursor rules
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

import { NextRequest, NextResponse } from 'next/server';
import { fetchNVIDIABugs } from '@/lib/github/api';
import { calculateCombinedBugMetrics } from '@/lib/github/metrics';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const since = searchParams.get('since');
    const state = searchParams.get('state') as 'open' | 'closed' | 'all' | null;
    
    console.log('Fetching NVIDIA bug data...');
    
    // Fetch bug issues from all NVIDIA repositories
    const issues = await fetchNVIDIABugs({
      state: state || 'all',
      since: since || undefined,
      per_page: 100
    });
    
    console.log(`Fetched ${issues.length} total issues from NVIDIA repositories`);
    
    // Calculate metrics
    const metrics = calculateCombinedBugMetrics(issues);
    
    return NextResponse.json({
      success: true,
      issues,
      metrics,
      fetchedAt: new Date().toISOString(),
      repositories: ['TransformerEngine', 'Thunder', 'NVFuser']
    });
    
  } catch (error) {
    console.error('Failed to fetch GitHub bug data:', error);
    
    // Return appropriate error response
    if (error instanceof Error) {
      const statusCode = error.message.includes('Rate limit') ? 429 : 500;
      
      return NextResponse.json({
        success: false,
        error: error.message,
        fetchedAt: new Date().toISOString(),
      }, { status: statusCode });
    }
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch bug data from GitHub',
      fetchedAt: new Date().toISOString(),
    }, { status: 500 });
  }
}

// Add OPTIONS for CORS if needed
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}