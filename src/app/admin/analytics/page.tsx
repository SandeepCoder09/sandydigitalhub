'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
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
        toast.info(`IP ${ip} is already blocked on firewall.`);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to block IP.');
    }
  };

  const activeUsersCount = data?.activeUsersCount || 0;
  const totalPageViews = data?.totalPageViews || 0;
  const todayPageViews = data?.todayPageViews || 0;
  const totalUniqueVisitors = data?.totalUniqueVisitors || 0;
  const totalOrdersCount = data?.totalOrdersCount || 0;
  const conversionRate = totalUniqueVisitors > 0 ? ((totalOrdersCount / totalUniqueVisitors) * 100).toFixed(1) : '0.0';

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        <AdminSidebar />

        <main className="flex-1 space-y-8">
          {/* Header */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2.5">
                <BarChart3 className="text-[#FF4500]" /> Website Visitor Analytics & Traffic Monitor
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Real-time visitor tracking, page view breakdowns, device analytics, and instant security IP blocking.
              </p>
            </div>

            <button
              onClick={() => fetchAnalytics(true)}
              disabled={refreshing}
              className="px-5 py-2.5 rounded-2xl bg-gray-900 hover:bg-black text-white font-extrabold text-xs flex items-center gap-2 transition-all cursor-pointer shrink-0 shadow-sm"
            >
              <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh Analytics'}</span>
            </button>
          </div>

          {/* Metric Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Live Active Users */}
            <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-emerald-700 tracking-wider flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span> Live Active Users
                </span>
                <Users className="text-emerald-500" size={22} />
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black text-gray-900">{activeUsersCount}</div>
                <p className="text-[11px] text-gray-500 mt-1 font-semibold">Active in last 15 minutes</p>
              </div>
            </div>

            {/* Today's Page Views */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-gray-500 tracking-wider">Today's Page Views</span>
                <Eye className="text-[#FF4500]" size={22} />
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black text-gray-900">{todayPageViews}</div>
                <p className="text-[11px] text-gray-500 mt-1 font-semibold">{totalPageViews} total lifetime views</p>
              </div>
            </div>

            {/* Unique Visitors */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-gray-500 tracking-wider">Unique Visitors</span>
                <Globe className="text-blue-500" size={22} />
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black text-gray-900">{totalUniqueVisitors}</div>
                <p className="text-[11px] text-gray-500 mt-1 font-semibold">Distinct IP addresses</p>
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase text-gray-500 tracking-wider">Order Conversion</span>
                <TrendingUp className="text-orange-500" size={22} />
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black text-gray-900">{conversionRate}%</div>
                <p className="text-[11px] text-gray-500 mt-1 font-semibold">{totalOrdersCount} orders placed</p>
              </div>
            </div>
          </div>

          {/* Section 2: Top Visited Pages & Device Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Popular Pages */}
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Zap size={18} className="text-[#FF4500]" /> Most Visited Pages
                </h3>
                <span className="text-xs font-bold text-gray-400 uppercase">Top Routes</span>
              </div>

              {loading ? (
                <div className="py-8 text-center text-xs text-gray-400 font-bold">Loading popular pages...</div>
              ) : !data?.topPages?.length ? (
                <div className="py-8 text-center text-xs text-gray-400 font-bold">No page views recorded yet.</div>
              ) : (
                <div className="space-y-3">
                  {data.topPages.map((item: any) => {
                    const percentage = totalPageViews > 0 ? Math.round((item.views / totalPageViews) * 100) : 0;
                    return (
                      <div key={item.path} className="space-y-1.5">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="font-mono text-gray-800">{item.path}</span>
                          <span className="text-gray-500">{item.views} views ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div
                            className="bg-[#FF4500] h-full rounded-full transition-all duration-500"
                            style={{ width: `${Math.max(percentage, 4)}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Device Breakdown */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Smartphone size={18} className="text-[#FF4500]" /> Device Type Breakdown
              </h3>

              <div className="space-y-4 pt-2">
                {data?.deviceBreakdown?.map((item: any) => (
                  <div key={item.device} className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-white text-[#FF4500] shadow-2xs border border-gray-200">
                        {item.device === 'Mobile' ? <Smartphone size={18} /> : <Monitor size={18} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900">{item.device}</h4>
                        <p className="text-xs text-gray-500">{item.count} sessions</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-gray-800">
                      {totalPageViews > 0 ? Math.round((item.count / totalPageViews) * 100) : 0}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Live Visitor Log Stream Table */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                  <Clock size={18} className="text-[#FF4500]" /> Live Visitor Activity Log Stream
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Real-time log of users browsing pages. Use 1-click IP Block to blacklist spammers instantly.
                </p>
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 text-[11px] font-black uppercase tracking-wider border border-emerald-300 self-start sm:self-auto">
                Auto-Updating Stream
              </span>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto shadow-2xs">
              <table className="w-full text-left text-xs sm:text-sm text-gray-900">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-700 font-extrabold uppercase">
                  <tr>
                    <th className="p-3.5">Visited Route</th>
                    <th className="p-3.5">IP Address</th>
                    <th className="p-3.5">Device</th>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5 text-center">Firewall Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400 font-bold">
                        Loading visitor stream...
                      </td>
                    </tr>
                  ) : !data?.recentLogs?.length ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400 font-bold">
                        No visitor traffic logged yet.
                      </td>
                    </tr>
                  ) : (
                    data.recentLogs.map((log: any) => (
                      <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-gray-900">{log.path}</td>
                        <td className="p-3.5 font-mono text-gray-600 font-medium">{log.ip}</td>
                        <td className="p-3.5 font-bold text-gray-800">{log.deviceType}</td>
                        <td className="p-3.5 text-gray-500 font-medium whitespace-nowrap">{formatDateTime(log.createdAt)}</td>
                        <td className="p-3.5 text-center">
                          <button
                            onClick={() => handleQuickBlockIp(log.ip)}
                            className="px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-800 font-black text-[11px] inline-flex items-center gap-1 border border-red-300 transition-colors cursor-pointer"
                            title="Block this IP on Security Firewall"
                          >
                            <Ban size={12} />
                            <span>Block IP</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
