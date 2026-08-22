'use client';

import React from 'react';
import Link from 'next/link';
import {
  Inbox, Search, ShoppingBag, LifeBuoy, Bell, Building2,
  FileQuestion, LucideIcon, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  type?: 'search' | 'requests' | 'tickets' | 'notifications' | 'partners' | 'general';
  title?: string;
  description?: string;
  icon?: LucideIcon;
  actionText?: string;
  actionHref?: string;
  onActionClick?: () => void;
  className?: string;
}

const DEFAULT_CONFIGS = {
  search: {
    icon: Search,
    title: 'No Matching Results Found',
    description: 'We couldn’t find anything matching your search criteria. Try using different keywords or clearing filters.',
  },
  requests: {
    icon: ShoppingBag,
    title: 'No Service Requests Yet',
    description: 'You haven’t submitted any digital service requests yet. Browse our catalog to get started.',
    actionText: 'Browse Services →',
    actionHref: '/services',
  },
  tickets: {
    icon: LifeBuoy,
    title: 'No Support Tickets',
    description: 'You don’t have any active support requests. If you need assistance, our team is ready to help.',
    actionText: 'Create Support Ticket →',
    actionHref: '/support',
  },
  notifications: {
    icon: Bell,
    title: 'You’re All Caught Up',
    description: 'There are no new notifications or announcements right now. Check back later for updates.',
  },
  partners: {
    icon: Building2,
    title: 'No Partner Centers Found',
    description: 'No authorized partner locations match your selected city or search filters.',
    actionText: 'Apply to Become a Partner →',
    actionHref: '/partners/apply',
  },
  general: {
    icon: Inbox,
    title: 'No Data Available',
    description: 'There are currently no records to display in this view.',
  },
};

export function EmptyState({
  type = 'general',
  title,
  description,
  icon: CustomIcon,
  actionText,
  actionHref,
  onActionClick,
  className = '',
}: EmptyStateProps) {
  const config = DEFAULT_CONFIGS[type] || DEFAULT_CONFIGS.general;
  const Icon = CustomIcon || config.icon;
  const finalTitle = title || config.title;
  const finalDescription = description || config.description;
  const finalActionText = actionText || ('actionText' in config ? (config as any).actionText : undefined);
  const finalActionHref = actionHref || ('actionHref' in config ? (config as any).actionHref : undefined);

  return (
    <div
      className={`bg-white rounded-3xl border border-gray-200/80 p-8 sm:p-12 text-center max-w-md mx-auto space-y-4 shadow-xs ${className}`}
      role="status"
    >
      <div className="w-14 h-14 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mx-auto shadow-2xs">
        <Icon size={26} className="text-purple-600" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-black text-gray-900">{finalTitle}</h3>
        <p className="text-xs text-gray-500 font-medium leading-relaxed">{finalDescription}</p>
      </div>

      {(finalActionText || onActionClick) && (
        <div className="pt-2">
          {finalActionHref ? (
            <Link href={finalActionHref}>
              <Button className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl h-10 px-5 shadow-xs">
                {finalActionText}
              </Button>
            </Link>
          ) : onActionClick ? (
            <Button
              onClick={onActionClick}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white text-xs font-bold rounded-xl h-10 px-5 shadow-xs"
            >
              {finalActionText || 'Try Again'}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
}
