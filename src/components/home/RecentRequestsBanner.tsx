'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, CheckCircle2 } from 'lucide-react';

export function RecentRequestsBanner() {
  const { data: session } = useSession();
  const [recentOrder, setRecentOrder] = useState<any>(null);
  const [totalOrders, setTotalOrders] = useState(0);

  useEffect(() => {
    if (!session) return;
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.orders && data.orders.length > 0) {
          setRecentOrder(data.orders[0]);
          setTotalOrders(data.orders.length);
        }
      })
      .catch((err) => console.error(err));
  }, [session]);

  if (!session || !recentOrder) return null;

  const firstServiceTitle = recentOrder.services?.[0]?.title || 'Service Request';

  return (
    <div className="bg-gradient-to-r from-primary/20 via-primary/10 to-transparent border-y border-primary/20 py-3 px-4 sm:px-8">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-full bg-primary/20 text-primary">
            {recentOrder.paymentStatus === 'PAID' ? (
              <CheckCircle2 className="h-4 w-4" />
            ) : (
              <Clock className="h-4 w-4" />
            )}
          </div>
          <div>
            <span className="font-semibold text-white">Your Requested Services: </span>
            <span className="text-muted-foreground">
              {firstServiceTitle} ({recentOrder.orderStatus === 'AWAITING_CUSTOMER_VISIT' ? 'Awaiting Visit' : recentOrder.orderStatus})
            </span>
            {totalOrders > 1 && (
              <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full font-medium">
                +{totalOrders - 1} more
              </span>
            )}
          </div>
        </div>
        <Link 
          href="/requests" 
          className="flex items-center text-primary font-medium hover:underline text-xs sm:text-sm whitespace-nowrap"
        >
          View Requested Services
          <ArrowRight className="ml-1 h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}
