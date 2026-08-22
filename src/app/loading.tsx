import { CardSkeleton } from '@/components/ui/LoadingSkeletons';

export default function RootLoading() {
  return (
    <div className="min-h-[70vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header skeleton */}
      <div className="max-w-xl mx-auto text-center space-y-3">
        <div className="h-5 w-32 bg-slate-200 rounded-full mx-auto animate-pulse" />
        <div className="h-8 w-3/4 bg-slate-200 rounded-2xl mx-auto animate-pulse" />
        <div className="h-4 w-1/2 bg-slate-200 rounded-xl mx-auto animate-pulse" />
      </div>

      {/* Cards Grid skeleton */}
      <CardSkeleton count={6} />
    </div>
  );
}
