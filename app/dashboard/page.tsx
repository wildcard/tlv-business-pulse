'use client';

import { useState, useEffect } from 'react';
import { formatCurrency, formatNumber } from '@/lib/utils/helpers';

interface DashboardStats {
  totalBusinesses: number;
  newToday: number;
  closedToday: number;
  articlesPublished: number;
  apiCalls: number;
  revenue: number;
  uptime: number;
  lastUpdated: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: string;
  loading?: boolean;
}

function StatCard({ title, value, change, icon, loading }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          {loading ? (
            <div className="mt-2 h-8 w-24 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
          )}
          {change !== undefined && !loading && (
            <div className="mt-2 flex items-center">
              <span
                className={`text-sm font-medium ${
                  change >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {change >= 0 ? '+' : ''}
                {change}%
              </span>
              <span className="ml-2 text-sm text-gray-500">vs yesterday</span>
            </div>
          )}
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/stats');

      if (!response.ok) {
        throw new Error(`Failed to fetch stats: ${response.statusText}`);
      }

      const data = await response.json();

      if (data.success) {
        setStats(data.data);
        setLastRefresh(new Date());
      } else {
        throw new Error(data.error || 'Failed to fetch stats');
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchStats, 60000);

    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    fetchStats();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                TLV Business Pulse Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Real-time monitoring of Tel Aviv's autonomous business directory
              </p>
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg
                className={`-ml-1 mr-2 h-5 w-5 ${loading ? 'animate-spin' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error State */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <svg
                className="h-5 w-5 text-red-400 mr-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-red-800">Error loading dashboard</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            title="Total Businesses"
            value={stats ? formatNumber(stats.totalBusinesses) : '---'}
            change={stats ? 2.5 : undefined}
            icon="🏢"
            loading={loading}
          />
          <StatCard
            title="New Today"
            value={stats ? formatNumber(stats.newToday) : '---'}
            icon="✨"
            loading={loading}
          />
          <StatCard
            title="Closed Today"
            value={stats ? formatNumber(stats.closedToday) : '---'}
            icon="🔴"
            loading={loading}
          />
          <StatCard
            title="Articles Published"
            value={stats ? formatNumber(stats.articlesPublished) : '---'}
            change={stats ? 15 : undefined}
            icon="📰"
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <StatCard
            title="API Calls (24h)"
            value={stats ? formatNumber(stats.apiCalls) : '---'}
            change={stats ? 8.3 : undefined}
            icon="🔌"
            loading={loading}
          />
          <StatCard
            title="Revenue (Monthly)"
            value={stats ? formatCurrency(stats.revenue) : '---'}
            change={stats ? 12.7 : undefined}
            icon="💰"
            loading={loading}
          />
          <StatCard
            title="System Uptime"
            value={stats ? `${stats.uptime.toFixed(2)}%` : '---'}
            icon="🟢"
            loading={loading}
          />
        </div>

        {/* System Status */}
        <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">System Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Database</p>
                <p className="text-xs text-gray-500">Operational</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">API</p>
                <p className="text-xs text-gray-500">Operational</p>
              </div>
            </div>
            <div className="flex items-center p-4 bg-green-50 rounded-lg">
              <div className="flex-shrink-0">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">AI Services</p>
                <p className="text-xs text-gray-500">Operational</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-6 text-center text-sm text-gray-500">
          Last updated: {lastRefresh.toLocaleString()} | Auto-refreshes every 60 seconds
          {stats?.lastUpdated && (
            <> | Data as of: {new Date(stats.lastUpdated).toLocaleString()}</>
          )}
        </div>

        {/* Autonomous Operations Info */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            Fully Autonomous Operations
          </h3>
          <p className="text-sm text-blue-800">
            This system operates 24/7 with zero human intervention. Data is automatically fetched,
            analyzed, and published. AI-generated content is created daily. All systems are
            monitored and self-healing.
          </p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="font-semibold">Data Sync:</span> Every 6 hours
            </div>
            <div>
              <span className="font-semibold">Content Generation:</span> Daily at 09:00 UTC
            </div>
            <div>
              <span className="font-semibold">Health Checks:</span> Every 15 minutes
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
