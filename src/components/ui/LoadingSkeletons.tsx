'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Base accessible Skeleton shimmer element.
 * Respects prefers-reduced-motion automatically.
 */
export function Skeleton({
  className = '',
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-xl bg-slate-200/80 dark:bg-slate-800 motion-reduce:animate-none ${className}`}
      {...props}
    />
  );
}

/**
 * Full page loading overlay for major route transitions
 */
export function PageLoader({ message = 'Loading Sandy Digital Hub...' }: { message?: string }) {
  return (
    <div
      className="min-h-[60vh] flex flex-col items-center justify-center p-6 space-y-4 text-center"
      role="status"
      aria-busy="true"
      aria-label={message}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#7C3AED] animate-spin" />
        </div>
      </div>
      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider animate-pulse">
        {message}
      </p>
    </div>
  );
}

/**
 * Section Loader for isolated asynchronous components
 */
export function SectionLoader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div
      className="py-12 flex flex-col items-center justify-center space-y-2 text-center"
      role="status"
      aria-busy="true"
    >
      <Loader2 className="w-5 h-5 text-purple-600 animate-spin" />
      <span className="text-[11px] text-gray-400 font-medium">{message}</span>
    </div>
  );
}

/**
 * Inline Spinner Loader for small badges or status indicators
 */
export function InlineLoader({ size = 14, className = '' }: { size?: number; className?: string }) {
  return <Loader2 size={size} className={`animate-spin text-current shrink-0 ${className}`} />;
}

/**
 * Button Loading State helper
 */
export function ButtonLoader({
  loading,
  loadingText,
  children,
  icon,
}: {
  loading: boolean;
  loadingText?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}) {
  if (loading) {
    return (
      <span className="inline-flex items-center gap-2">
        <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />
        <span>{loadingText || 'Please wait...'}</span>
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      {children}
    </span>
  );
}

/**
 * Card Skeleton grid for Services, Tools, Portfolio, Reviews, Partner Centers
 */
export function CardSkeleton({
  count = 6,
  type = 'default',
}: {
  count?: number;
  type?: 'default' | 'service' | 'review' | 'portfolio' | 'tool';
}) {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
      role="status"
      aria-busy="true"
      aria-label="Loading content cards"
    >
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-3xl p-5 sm:p-6 border border-gray-200 shadow-2xs space-y-4"
        >
          {type === 'portfolio' && (
            <Skeleton className="h-36 w-full rounded-2xl" />
          )}

          <div className="flex items-start gap-3">
            <Skeleton className="w-10 h-10 rounded-2xl shrink-0" />
            <div className="space-y-2 flex-1 min-w-0">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-5/6" />
          </div>

          <div className="flex items-center justify-between pt-2">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-24 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Table Skeleton for Orders, Users, Partners, Tickets, Quotes
 */
export function TableSkeleton({
  rows = 5,
  columns = 5,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <div
      className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden"
      role="status"
      aria-busy="true"
      aria-label="Loading table records"
    >
      {/* Table Header */}
      <div className="p-4 bg-slate-50 border-b border-gray-100 flex items-center justify-between gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1 max-w-[120px]" />
        ))}
      </div>

      {/* Table Rows */}
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="p-4 flex items-center justify-between gap-4">
            {Array.from({ length: columns }).map((_, cIdx) => (
              <div key={cIdx} className="flex-1 space-y-1">
                <Skeleton className={`h-3.5 ${cIdx === 0 ? 'w-3/4' : 'w-1/2'}`} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Dashboard Skeleton for Admin / Partner / Customer dashboards
 */
export function DashboardSkeleton() {
  return (
    <div
      className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6"
      role="status"
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-gray-200 space-y-3 shadow-2xs">
            <div className="flex items-center justify-between">
              <Skeleton className="w-9 h-9 rounded-2xl" />
              <Skeleton className="w-12 h-4 rounded-md" />
            </div>
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        ))}
      </div>

      {/* Main Content + Sidebar Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Chart Skeleton */}
          <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-4">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-24 rounded-xl" />
            </div>
            <Skeleton className="h-64 w-full rounded-2xl" />
          </div>

          {/* Table Skeleton */}
          <TableSkeleton rows={4} columns={4} />
        </div>

        {/* Sidebar Widget Skeleton */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-gray-200 space-y-4">
            <Skeleton className="h-4 w-36" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-2.5 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Notification List Skeleton
 */
export function NotificationSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-3" role="status" aria-busy="true">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="bg-white p-4 rounded-2xl border border-gray-200 space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-3.5 w-1/3" />
            <Skeleton className="h-3 w-16" />
          </div>
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>
      ))}
    </div>
  );
}

/**
 * Upload Progress Indicator with support for indeterminate and measured progress
 */
export function UploadProgress({
  progress,
  filename,
  isProcessing = false,
}: {
  progress?: number;
  filename?: string;
  isProcessing?: boolean;
}) {
  const isIndeterminate = progress === undefined;

  return (
    <div className="p-3.5 bg-purple-50 rounded-2xl border border-purple-200 space-y-2 text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-purple-950 truncate max-w-[200px]">
          {filename || 'Uploading document...'}
        </span>
        <span className="font-black text-purple-700">
          {isProcessing ? 'Processing...' : isIndeterminate ? 'Uploading...' : `${progress}%`}
        </span>
      </div>

      <div className="w-full h-2 bg-purple-200 rounded-full overflow-hidden">
        {isIndeterminate || isProcessing ? (
          <div className="w-1/2 h-full bg-purple-600 rounded-full animate-indeterminate" />
        ) : (
          <div
            className="h-full bg-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        )}
      </div>
    </div>
  );
}
