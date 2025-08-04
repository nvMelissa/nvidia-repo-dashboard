// Optimized dashboard API route with caching and smart loading
export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

import { NextRequest, NextResponse } from 'next/server';
import { optimizedGitHub } from '@/lib/github/optimized-api';
import { calculateCombinedBugMetrics, generateBugTrends } from '@/lib/github/metrics';
import { dataCache, CACHE_KEYS } from '@/lib/cache';
import type { NVIDIARepo } from '@/lib/github/types';

const NVIDIA_REPOS: NVIDIARepo[] = ['TransformerEngine', 'Fuser'];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const priority = searchParams.get('priority') as 'critical' | 'full' || 'critical';
  const clearCache = searchParams.get('clearCache') === 'true';

  try {
    if (clearCache) {
      optimizedGitHub.clearCache();
    }

    console.log(`🚀 Dashboard API called with priority: ${priority}`);
    const startTime = Date.now();

    if (priority === 'critical') {
      // Fast response with essential data
      const { critical, loading } = await optimizedGitHub.loadDashboardData(NVIDIA_REPOS);
      
      const metrics = calculateCombinedBugMetrics(critical);
      const trends = generateBugTrends(critical);

      // Cache the metrics
      dataCache.set(CACHE_KEYS.COMBINED_METRICS, metrics, 5 * 60 * 1000);
      
      const loadTime = Date.now() - startTime;
      console.log(`⚡ Critical data loaded in ${loadTime}ms (${critical.length} issues)`);

      // Start background loading but don't wait
      loading.then(fullData => {
        const fullMetrics = calculateCombinedBugMetrics(fullData);
        const fullTrends = generateBugTrends(fullData);
        dataCache.set(CACHE_KEYS.COMBINED_METRICS, fullMetrics, 15 * 60 * 1000);
        dataCache.set(CACHE_KEYS.PROGRESSION_DATA, fullTrends, 15 * 60 * 1000);
        console.log(`🔄 Background data updated (${fullData.length} total issues)`);
      });

      return NextResponse.json({
        issues: critical,
        metrics,
        trends,
        loadTime,
        totalIssues: critical.length,
        backgroundLoading: true,
        timestamp: new Date().toISOString()
      });

    } else {
      // Full data load
      const allIssues = await Promise.all(
        NVIDIA_REPOS.map(repo => optimizedGitHub.loadRepoData(repo, { 
          priority: 'background', 
          cacheFirst: true 
        }))
      ).then(results => results.flat());

      const metrics = calculateCombinedBugMetrics(allIssues);
      const trends = generateBugTrends(allIssues);

      // Cache with longer TTL
      dataCache.set(CACHE_KEYS.COMBINED_METRICS, metrics, 15 * 60 * 1000);
      dataCache.set(CACHE_KEYS.PROGRESSION_DATA, trends, 15 * 60 * 1000);

      const loadTime = Date.now() - startTime;
      console.log(`📊 Full data loaded in ${loadTime}ms (${allIssues.length} issues)`);

      return NextResponse.json({
        issues: allIssues,
        metrics,
        trends,
        loadTime,
        totalIssues: allIssues.length,
        backgroundLoading: false,
        timestamp: new Date().toISOString()
      });
    }

  } catch (error) {
    console.error('❌ Dashboard API error:', error);
    
    // Try to return cached data as fallback
    const cachedMetrics = optimizedGitHub.getCachedMetrics('all');
    if (cachedMetrics) {
      console.log('🔄 Returning cached fallback data');
      return NextResponse.json({
        metrics: cachedMetrics,
        trends: dataCache.get(CACHE_KEYS.PROGRESSION_DATA) || [],
        issues: [],
        error: 'Live data unavailable, showing cached data',
        loadTime: 0,
        totalIssues: 0,
        backgroundLoading: false,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json(
      { 
        error: 'Failed to load dashboard data',
        message: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Background refresh endpoint
export async function POST(request: NextRequest) {
  try {
    console.log('🔄 Starting background refresh...');
    
    // Clear cache and reload all data
    optimizedGitHub.clearCache();
    await optimizedGitHub.preloadInBackground(NVIDIA_REPOS);
    
    return NextResponse.json({ 
      message: 'Background refresh started',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: 'Background refresh failed' },
      { status: 500 }
    );
  }
}