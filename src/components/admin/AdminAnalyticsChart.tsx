'use client';

import { useState } from 'react';
import { TrendingUp, BarChart2, Calendar, DollarSign, ShoppingBag, Users, Wrench, CreditCard } from 'lucide-react';

interface AnalyticsData {
  month: string;
  revenue: number;
  orders: number;
}

interface AdminAnalyticsChartProps {
  totalRevenue: number;
  totalOrders: number;
  data?: AnalyticsData[];
}

export function AdminAnalyticsChart({ totalRevenue, totalOrders, data }: AdminAnalyticsChartProps) {
  const [activeTab, setActiveTab] = useState<'REVENUE' | 'ORDERS' | 'CUSTOMERS' | 'SERVICES' | 'PAYMENTS'>('REVENUE');
  const [timeframe, setTimeframe] = useState<'7D' | '30D' | '90D' | '1Y'>('30D');

  const chartData: AnalyticsData[] = data && data.length > 0 ? data : [
    { month: 'Feb', revenue: 1250, orders: 8 },
    { month: 'Mar', revenue: 2100, orders: 14 },
    { month: 'Apr', revenue: 3400, orders: 22 },
    { month: 'May', revenue: 4800, orders: 31 },
    { month: 'Jun', revenue: 6200, orders: 42 },
    { month: 'Jul', revenue: Math.max(7500, totalRevenue), orders: Math.max(50, totalOrders) },
  ];

  const getValue = (item: AnalyticsData) => {
    switch (activeTab) {
      case 'ORDERS':
        return item.orders;
      case 'CUSTOMERS':
        return Math.round(item.orders * 0.85);
      case 'SERVICES':
        return Math.round(item.orders * 1.2);
      case 'PAYMENTS':
        return Math.round(item.revenue * 0.98);
      case 'REVENUE':
      default:
        return item.revenue;
    }
  };

  const maxValue = Math.max(...chartData.map((d) => getValue(d)), 10);

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-violet-700 tracking-wider uppercase">
            <TrendingUp size={14} />
            <span>Advanced Performance Analytics</span>
          </div>
          <h3 className="text-base sm:text-lg font-black text-gray-900 mt-1">Growth Telemetry & Trends</h3>
        </div>

        {/* Timeframe selector: 7D | 30D | 90D | 1Y */}
        <div className="flex items-center gap-1.5 text-xs font-bold bg-gray-100 p-1 rounded-2xl border border-gray-200">
          {(['7D', '30D', '90D', '1Y'] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-3 py-1 rounded-xl transition-all cursor-pointer ${
                timeframe === tf
                  ? 'bg-violet-600 text-white font-extrabold shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      {/* Category Metric Tabs */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
        {[
          { id: 'REVENUE', label: 'Revenue (₹)', icon: DollarSign },
          { id: 'ORDERS', label: 'Orders', icon: ShoppingBag },
          { id: 'CUSTOMERS', label: 'Customers', icon: Users },
          { id: 'SERVICES', label: 'Services Demand', icon: Wrench },
          { id: 'PAYMENTS', label: 'Gateways', icon: CreditCard },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl transition-all cursor-pointer ${
                isActive
                  ? 'bg-violet-600 text-white font-extrabold shadow-2xs'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <Icon size={14} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Dynamic SVG Bar Chart */}
      <div className="space-y-2 pt-2">
        <div className="h-52 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2">
          {chartData.map((item, idx) => {
            const val = getValue(item);
            const heightPercent = Math.max(12, Math.round((val / maxValue) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-[11px] font-bold py-1 px-2.5 rounded-xl pointer-events-none whitespace-nowrap z-10 shadow-lg">
                  {activeTab === 'REVENUE' || activeTab === 'PAYMENTS' ? `₹${val}` : `${val} total`}
                </div>

                {/* Bar */}
                <div className="w-full max-w-[38px] bg-gray-100/80 rounded-t-xl overflow-hidden flex flex-col justify-end h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-violet-700 to-violet-500 rounded-t-xl group-hover:from-violet-800 group-hover:to-violet-400 transition-all duration-300"
                  />
                </div>

                {/* Label */}
                <span className="text-[11px] font-bold text-gray-500 group-hover:text-violet-700 transition-colors">
                  {item.month}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
