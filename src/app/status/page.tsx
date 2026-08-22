'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Activity, CheckCircle2, AlertTriangle, AlertCircle, Wrench,
  Clock, ShieldCheck, RefreshCw, ArrowRight, ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ComponentHealth {
  id: string;
  name: string;
  group: string;
  status: 'OPERATIONAL' | 'DEGRADED' | 'MAINTENANCE' | 'OUTAGE';
}

interface IncidentItem {
  _id: string;
  title: string;
  impact: string;
  status: string;
  affectedComponents: string[];
  updates: { status: string; message: string; timestamp: string }[];
  createdAt: string;
}

export default function StatusPage() {
  const [overallStatus, setOverallStatus] = useState<'OPERATIONAL' | 'DEGRADED'>('OPERATIONAL');
  const [components, setComponents] = useState<ComponentHealth[]>([]);
  const [activeIncidents, setActiveIncidents] = useState<IncidentItem[]>([]);
  const [resolvedIncidents, setResolvedIncidents] = useState<IncidentItem[]>([]);
  const [lastChecked, setLastChecked] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setOverallStatus(data.overallStatus || 'OPERATIONAL');
        setComponents(data.components || []);
        setActiveIncidents(data.activeIncidents || []);
        setResolvedIncidents(data.resolvedIncidents || []);
        setLastChecked(new Date(data.lastCheckedAt || Date.now()));
      }
    } catch (err) {
      console.error('Failed to load status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
    const timer = setInterval(fetchStatus, 60000); // 1 minute auto refresh
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16 sm:pb-20">
      {/* Header Banner */}
      <section className="bg-slate-900 text-white pt-10 sm:pt-16 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-xs font-bold uppercase tracking-wider">
            <Activity size={13} className="text-emerald-400" /> Platform Operations & Uptime
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight">
            System Operational <span className="text-purple-400">Status</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 font-medium max-w-xl mx-auto">
            Live operational status across all SARA DIGITAL HUB and SANDY DIGITAL STUDIO platform subsystems.
          </p>

          {/* Overall Health Card */}
          <div className="pt-4 max-w-xl mx-auto">
            <div
              className={`p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-4 ${
                overallStatus === 'OPERATIONAL'
                  ? 'bg-emerald-950/80 border-emerald-800/80 text-emerald-200'
                  : 'bg-amber-950/80 border-amber-800/80 text-amber-200'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-3.5 h-3.5 rounded-full animate-pulse ${
                    overallStatus === 'OPERATIONAL' ? 'bg-emerald-400' : 'bg-amber-400'
                  }`}
                />
                <span className="text-sm sm:text-base font-black">
                  {overallStatus === 'OPERATIONAL'
                    ? 'All Systems Fully Operational'
                    : 'Some Systems Experiencing Degraded Performance'}
                </span>
              </div>
              <button
                onClick={fetchStatus}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
                title="Refresh Status"
              >
                <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
              </button>
            </div>
            <div className="text-[11px] text-slate-500 font-medium mt-2 text-right">
              Last checked: {lastChecked.toLocaleTimeString('en-IN')}
            </div>
          </div>
        </div>
      </section>

      {/* Subsystem Components Grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        
        {/* Component Health List */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-slate-50/60 flex items-center justify-between">
            <h2 className="text-xs font-black uppercase tracking-wider text-gray-500">
              Platform Subsystems ({components.length})
            </h2>
            <span className="text-[11px] font-bold text-gray-400">Current Status</span>
          </div>

          <div className="divide-y divide-gray-100">
            {components.map((comp) => (
              <div key={comp.id} className="p-4 sm:p-5 flex items-center justify-between gap-4 hover:bg-gray-50/50 transition-colors">
                <div className="space-y-0.5">
                  <div className="text-xs sm:text-sm font-bold text-gray-900">{comp.name}</div>
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{comp.group}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  {comp.status === 'OPERATIONAL' ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                      <CheckCircle2 size={13} className="text-emerald-600" /> Operational
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
                      <AlertTriangle size={13} className="text-amber-600" /> Degraded
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active / Recent Incidents */}
        <div className="space-y-4">
          <h2 className="text-base font-black text-gray-900 flex items-center gap-2">
            <Clock size={16} className="text-purple-600" /> Incident History & Scheduled Maintenance
          </h2>

          {activeIncidents.length === 0 && resolvedIncidents.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center text-xs text-gray-500 font-medium">
              <CheckCircle2 size={24} className="text-emerald-500 mx-auto mb-2" />
              No incidents reported in the past 90 days. Platform operating smoothly.
            </div>
          ) : (
            <div className="space-y-4">
              {[...activeIncidents, ...resolvedIncidents].map((inc) => (
                <div key={inc._id} className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                        inc.status === 'RESOLVED' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {inc.status}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-gray-900 mt-1">{inc.title}</h3>
                    </div>
                    <span className="text-[11px] text-gray-400 font-medium shrink-0">
                      {new Date(inc.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-gray-100">
                    {inc.updates?.map((u, i) => (
                      <div key={i} className="text-xs text-gray-600 leading-relaxed font-medium">
                        <span className="font-bold text-gray-800">[{u.status}]</span> {u.message}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
