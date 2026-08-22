'use client';

import { useState, useEffect } from 'react';
import { BarChart3, Users, Eye, Smartphone, Monitor, Globe, RefreshCw, Ban, TrendingUp, Zap, Clock, ShieldAlert } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<any>(null);

  const fetchAnalytics = async (showToast = false) => {
    if (showToast) setRefreshing(true);
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) {
        const json = await res.json();
        setData(json.analytics);
        if (showToast) toast.success('Analytics updated successfully!');
      } else {
        toast.error('Failed to load analytics.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error connecting to analytics server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    const interval = setInterval(() => {
      if (!document.hidden) fetchAnalytics();
    }, 10000); // 10s auto-update
    return () => clearInterval(interval);
  }, []);

  const handleQuickBlockIp = async (ip: string) => {
    try {
      const siteRes = await fetch('/api/admin/site-control');
      if (!siteRes.ok) return;
      const siteData = await siteRes.json();
      const currentBlockedIps = siteData.settings?.blockedIps || [];

      if (!currentBlockedIps.includes(ip)) {
        const updateRes = await fetch('/api/admin/site-control', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            blockedIps: [...currentBlockedIps, ip],
          }),
        });

        if (updateRes.ok) {
          toast.success(`IP ${ip} blocked successfully on firewall!`);
        }
      } else {
        toast.info(`IP ${ip} is already blocked.`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to block IP.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <BarChart3 className="text-violet-600" size={24} />
            Visitor Analytics & Real-Time Traffic
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Monitor active online sessions, top visited pages, device breakdown, and traffic sources
          </p>
        </div>

        <button
          onClick={() => fetchAnalytics(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer shrink-0"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          <span>Refresh Traffic Data</span>
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs font-bold text-gray-400">
          Loading visitor telemetry...
        </div>
      ) : !data ? (
        <div className="bg-white rounded-3xl border border-gray-200 p-12 text-center text-xs font-bold text-red-500">
          Analytics data unavailable.
        </div>
      ) : (
        <div className="space-y-6">
          {/* KPI Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Users size={14} className="text-violet-600" /> Active Sessions
              </span>
              <h3 className="text-2xl font-black text-gray-900">{data.activeSessionsCount || 0}</h3>
              <p className="text-[11px] font-semibold text-emerald-600">Online right now</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Eye size={14} className="text-purple-600" /> Today's Page Views
              </span>
              <h3 className="text-2xl font-black text-gray-900">{data.totalPageViewsToday || 0}</h3>
              <p className="text-[11px] font-semibold text-purple-600">Views in last 24h</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Smartphone size={14} className="text-amber-600" /> Mobile Visitors
              </span>
              <h3 className="text-2xl font-black text-gray-900">{data.mobilePercentage || 0}%</h3>
              <p className="text-[11px] font-semibold text-amber-600">Mobile traffic ratio</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-2">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
                <Globe size={14} className="text-emerald-600" /> Top Region
              </span>
              <h3 className="text-2xl font-black text-gray-900">{data.topRegion || 'India'}</h3>
              <p className="text-[11px] font-semibold text-emerald-600">Dominant traffic origin</p>
            </div>
          </div>

          {/* Top Pages & Device Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Top Visited Pages */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-3">
              <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <TrendingUp size={16} className="text-violet-600" />
                Most Visited Pages
              </h2>
              <div className="space-y-2">
                {(!data.topPages || data.topPages.length === 0) ? (
                  <p className="text-xs text-gray-400 font-medium py-3">No page view data available yet.</p>
                ) : (
                  data.topPages.map((page: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 text-xs">
                      <span className="font-mono font-bold text-gray-800 truncate max-w-[200px] sm:max-w-xs">{page.path}</span>
                      <span className="font-bold text-violet-700 px-2 py-0.5 rounded-md bg-violet-50 border border-violet-200 shrink-0">
                        {page.views} views
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Device Breakdown */}
            <div className="bg-white rounded-3xl p-5 border border-gray-200 shadow-2xs space-y-3">
              <h2 className="text-sm font-black text-gray-900 flex items-center gap-2">
                <Smartphone size={16} className="text-purple-600" />
                Device Breakdown
              </h2>
              <div className="space-y-2">
                {(!data.deviceBreakdown || data.deviceBreakdown.length === 0) ? (
                  <p className="text-xs text-gray-400 font-medium py-3">No device data available yet.</p>
                ) : (
                  data.deviceBreakdown.map((d: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 text-xs">
                      <span className="font-bold text-gray-800 flex items-center gap-2">
                        {d.device === 'Mobile' ? <Smartphone size={14} className="text-amber-500" /> : <Monitor size={14} className="text-blue-500" />}
                        {d.device}
                      </span>
                      <span className="font-bold text-purple-700 px-2 py-0.5 rounded-md bg-purple-50 border border-purple-200 shrink-0">
                        {d.count} hits
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Real-time Recent Visitors Table */}
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Clock size={18} className="text-violet-600" />
                Live Visitor Log
              </h2>
              <span className="text-xs text-gray-500 font-semibold">Auto-updating every 10s</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-gray-700">
                <thead className="bg-gray-50/80 border-b border-gray-200 text-[11px] text-gray-600 font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="p-4">Visitor IP</th>
                    <th className="p-4">Current Page</th>
                    <th className="p-4">Device / OS</th>
                    <th className="p-4">Last Activity</th>
                    <th className="p-4 text-center">Firewall Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {(!data.recentVisitors || data.recentVisitors.length === 0) ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400 font-medium">
                        No visitor telemetry recorded yet. Browse public pages (e.g. /services, /partners) to see live logs!
                      </td>
                    </tr>
                  ) : (
                    (data.recentVisitors || []).map((v: any, idx: number) => (
                      <tr key={idx} className="hover:bg-gray-50/80 transition-colors">
                        <td className="p-4 font-mono font-bold text-violet-700">
                          {v.ip || '127.0.0.1'}
                        </td>
                        <td className="p-4 font-mono font-bold text-gray-900 text-[11px]">
                          {v.path || '/'}
                        </td>
                        <td className="p-4 text-gray-600 font-medium">
                          {v.device || 'Desktop'} ({v.browser || 'Chrome'})
                        </td>
                        <td className="p-4 text-gray-500 font-medium">
                          {formatDateTime(v.lastSeen || v.createdAt || new Date())}
                        </td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => handleQuickBlockIp(v.ip)}
                            className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold border border-red-200 text-[11px] transition-colors cursor-pointer"
                          >
                            Quick Block IP
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
