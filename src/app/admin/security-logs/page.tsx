'use client';

import { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { ShieldAlert, ShieldCheck, AlertOctagon, Trash2, RefreshCw, Lock, AlertTriangle, Eye } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';

export default function AdminSecurityLogsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [criticalCount, setCriticalCount] = useState(0);
  const [totalThreats, setTotalThreats] = useState(0);

  const fetchLogs = async (showToast = false) => {
    if (showToast) setRefreshing(true);
    try {
      const res = await fetch('/api/admin/security-logs');
      if (res.ok) {
        const json = await res.json();
        setLogs(json.logs || []);
        setCriticalCount(json.criticalCount || 0);
        setTotalThreats(json.totalThreats || 0);
        if (showToast) toast.success('Security logs refreshed!');
      } else {
        toast.error('Failed to load security logs.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error connecting to security server.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleClearLogs = async () => {
    if (!confirm('Are you sure you want to clear all security audit logs?')) return;
    try {
      const res = await fetch('/api/admin/security-logs', { method: 'DELETE' });
      if (res.ok) {
        toast.success('All security audit logs cleared.');
        setLogs([]);
        setCriticalCount(0);
        setTotalThreats(0);
      }
    } catch (error) {
      console.error(error);
      toast.error('Error clearing logs.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        <AdminSidebar />

        <main className="flex-1 space-y-8">
          {/* Header */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2.5">
                <ShieldAlert className="text-[#FF4500]" /> Security Threat & Firewall Audit Logs
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Real-time security events: blocked IP attempts, rate limits, failed logins, and suspicious payloads.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchLogs(true)}
                disabled={refreshing}
                className="px-4 py-2.5 rounded-2xl bg-gray-900 text-white font-extrabold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
                <span>Refresh</span>
              </button>
              <button
                onClick={handleClearLogs}
                className="px-4 py-2.5 rounded-2xl bg-red-100 text-red-800 font-extrabold text-xs flex items-center gap-1.5 border border-red-300 cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Clear Audit Logs</span>
              </button>
            </div>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm">
              <div className="text-xs font-black uppercase text-gray-500 tracking-wider">Total Threat Hits</div>
              <div className="text-3xl font-black text-gray-900 mt-2">{totalThreats}</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-red-200 shadow-sm">
              <div className="text-xs font-black uppercase text-red-600 tracking-wider">Critical Threat Alerts</div>
              <div className="text-3xl font-black text-red-600 mt-2">{criticalCount}</div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-emerald-200 shadow-sm">
              <div className="text-xs font-black uppercase text-emerald-700 tracking-wider">Active Firewall Status</div>
              <div className="text-lg font-black text-emerald-800 mt-2 flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-600" /> Active Protection
              </div>
            </div>
          </div>

          {/* Security Log Table */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-sm space-y-5">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <AlertOctagon size={18} className="text-[#FF4500]" /> Real-Time Security Audit Stream
            </h3>

            <div className="bg-white rounded-2xl border border-gray-200 overflow-x-auto shadow-2xs">
              <table className="w-full text-left text-xs sm:text-sm text-gray-900">
                <thead className="bg-gray-50 border-b border-gray-200 text-xs text-gray-700 font-extrabold uppercase">
                  <tr>
                    <th className="p-3.5">Severity</th>
                    <th className="p-3.5">Event Type</th>
                    <th className="p-3.5">IP Address</th>
                    <th className="p-3.5">Path / Details</th>
                    <th className="p-3.5">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-xs">
                  {loading ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400 font-bold">
                        Loading security logs...
                      </td>
                    </tr>
                  ) : !logs.length ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-gray-400 font-bold py-12">
                        🛡️ Zero security threats detected. Your website firewall is operating normally.
                      </td>
                    </tr>
                  ) : (
                    logs.map((log: any) => (
                      <tr key={log._id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${
                            log.severity === 'CRITICAL' ? 'bg-red-100 text-red-900 border-red-300' :
                            log.severity === 'HIGH' ? 'bg-orange-100 text-orange-900 border-orange-300' :
                            'bg-yellow-100 text-yellow-900 border-yellow-300'
                          }`}>
                            {log.severity}
                          </span>
                        </td>
                        <td className="p-3.5 font-bold text-gray-900">{log.eventType}</td>
                        <td className="p-3.5 font-mono text-gray-600 font-medium">{log.ip}</td>
                        <td className="p-3.5 font-mono text-xs text-gray-800">{log.path} - {log.details}</td>
                        <td className="p-3.5 text-gray-500 font-medium whitespace-nowrap">{formatDateTime(log.createdAt)}</td>
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
