'use client';

import { useState, useEffect } from 'react';
import { ShieldAlert, ShieldCheck, AlertOctagon, Trash2, RefreshCw, Lock, AlertTriangle } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import { toast } from '@/components/ui/Toast';
import { ConfirmModal } from '@/components/ui/ConfirmModal';

export default function AdminSecurityLogsPage() {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [criticalCount, setCriticalCount] = useState(0);
  const [totalThreats, setTotalThreats] = useState(0);
  const [showClearModal, setShowClearModal] = useState(false);
  const [clearing, setClearing] = useState(false);

  const fetchLogs = async (showToast = false) => {
    if (showToast) setRefreshing(true);
    try {
      const res = await fetch('/api/admin/security-logs');
      if (res.ok) {
        const json = await res.json();
        setLogs(json.logs || []);
        setCriticalCount(json.criticalCount || 0);
        setTotalThreats(json.totalThreats || 0);
        if (showToast) toast.success('Security audit logs updated!');
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

  const handleConfirmClearLogs = async () => {
    setClearing(true);
    try {
      const res = await fetch('/api/admin/security-logs', { method: 'DELETE' });
      if (res.ok) {
        toast.success('All security audit logs cleared successfully!', 'Logs Purged');
        setLogs([]);
        setCriticalCount(0);
        setTotalThreats(0);
      } else {
        toast.error('Failed to clear logs.');
      }
    } catch (error) {
      console.error(error);
      toast.error('Error clearing logs.');
    } finally {
      setClearing(false);
      setShowClearModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
            <AlertOctagon className="text-violet-600" size={24} />
            Security Audit Logs
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            Real-time automated security firewall logs & unauthorized access attempts ({logs.length} logged events)
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => fetchLogs(true)}
            disabled={refreshing}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gray-100 hover:bg-violet-50 text-gray-700 hover:text-violet-700 font-bold text-xs transition-colors cursor-pointer border border-gray-200"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            <span>Refresh</span>
          </button>
          <button
            onClick={() => setShowClearModal(true)}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs transition-colors cursor-pointer border border-red-200 disabled:opacity-50"
          >
            <Trash2 size={14} />
            <span>Purge Audit Logs</span>
          </button>
        </div>
      </div>

      {/* Security Threat Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Total System Logs</span>
          <h3 className="text-2xl font-black text-gray-900">{logs.length}</h3>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Blocked Threat Events</span>
          <h3 className="text-2xl font-black text-amber-600">{totalThreats}</h3>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Critical Alerts</span>
          <h3 className="text-2xl font-black text-red-600">{criticalCount}</h3>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-2xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-xs font-bold text-gray-400">Loading security logs...</div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <ShieldCheck size={40} className="mx-auto text-emerald-500" />
            <h3 className="text-sm font-extrabold text-gray-900">Security Firewall Status Clean</h3>
            <p className="text-xs text-gray-500">No security audit violations logged.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-gray-700">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-[11px] text-gray-600 font-extrabold uppercase tracking-wider">
                <tr>
                  <th className="p-4">Severity</th>
                  <th className="p-4">Security Event</th>
                  <th className="p-4">IP Address</th>
                  <th className="p-4">Target Endpoint</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {logs.map((log) => {
                  const isHigh = log.severity === 'CRITICAL' || log.severity === 'HIGH';
                  return (
                    <tr key={log._id || log.timestamp} className="hover:bg-gray-50/80 transition-colors">
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                          isHigh
                            ? 'bg-red-100 text-red-800 border border-red-200'
                            : 'bg-amber-100 text-amber-800 border border-amber-200'
                        }`}>
                          {log.severity || 'INFO'}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-gray-900">
                        {log.action || log.event || 'Security Log'}
                      </td>
                      <td className="p-4 font-mono font-bold text-violet-700">
                        {log.ip || '127.0.0.1'}
                      </td>
                      <td className="p-4 font-mono text-gray-500 text-[11px]">
                        {log.endpoint || log.path || '/api/admin'}
                      </td>
                      <td className="p-4 text-gray-500 font-medium">
                        {formatDateTime(log.timestamp || log.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={showClearModal}
        onClose={() => setShowClearModal(false)}
        onConfirm={handleConfirmClearLogs}
        title="Purge All Security Audit Logs?"
        message="Are you sure you want to permanently delete all security audit log entries? This action cannot be undone."
        confirmText={clearing ? 'Purging...' : 'Purge All Logs'}
      />
    </div>
  );
}
