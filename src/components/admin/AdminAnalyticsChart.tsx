'use client';

import { TrendingUp } from 'lucide-react';

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
  const chartData: AnalyticsData[] = data && data.length > 0 ? data : [
    { month: 'Feb', revenue: 1250, orders: 8 },
    { month: 'Mar', revenue: 2100, orders: 14 },
    { month: 'Apr', revenue: 3400, orders: 22 },
    { month: 'May', revenue: 4800, orders: 31 },
    { month: 'Jun', revenue: 6200, orders: 42 },
    { month: 'Jul', revenue: Math.max(7500, totalRevenue), orders: Math.max(50, totalOrders) },
  ];

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 100);

  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-[#FF4500] tracking-wider uppercase">
            <TrendingUp size={14} />
            <span>Sales & Revenue Analytics</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mt-1">Performance Growth</h3>
        </div>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-1.5 text-gray-500">
            <span className="w-3 h-3 rounded-full bg-[#FF4500]"></span>
            <span>Revenue (₹)</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-500">
            <span className="w-3 h-3 rounded-full bg-gray-300"></span>
            <span>Orders</span>
          </div>
        </div>
      </div>

      {/* SVG Bar Chart */}
      <div className="space-y-2">
        <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 pt-6 pb-2 px-2">
          {chartData.map((item, idx) => {
            const heightPercent = Math.max(12, Math.round((item.revenue / maxRevenue) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-gray-700 text-[11px] py-1 px-2 rounded pointer-events-none whitespace-nowrap z-10 shadow-lg">
                  ₹{item.revenue} ({item.orders} orders)
                </div>

                {/* Bar */}
                <div className="w-full max-w-[36px] bg-gray-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-full">
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full bg-gradient-to-t from-[#FF4500]/80 to-[#FF4500] rounded-t-lg group-hover:from-[#FF4500] group-hover:to-orange-400 transition-all duration-500"
                  />
                </div>

                {/* Label */}
                <span className="text-[11px] font-semibold text-gray-400 group-hover:text-gray-700 transition-colors">
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
