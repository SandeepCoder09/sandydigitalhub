'use client';

import { useState } from 'react';
import { PublicPartnerHeader } from '@/components/partner/PublicPartnerHeader';
import { PublicPartnerHero } from '@/components/partner/PublicPartnerHero';
import { PublicPartnerServices } from '@/components/partner/PublicPartnerServices';
import { PublicPartnerContact } from '@/components/partner/PublicPartnerContact';
import { PublicPartnerFooter } from '@/components/partner/PublicPartnerFooter';
import { PublicServiceRequestModal } from '@/components/partner/PublicServiceRequestModal';

export function CenterClientView({ partner }: { partner: any }) {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);

  const handleSelectService = (service: any) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleOpenGeneralModal = () => {
    const firstService = (partner.assignedServices || []).find((s: any) => s.enabled);
    setSelectedService(
      firstService || {
        title: 'General Online Service Facilitation',
        basePrice: 50,
        customPrice: 50,
      }
    );
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col antialiased">
      <PublicPartnerHeader partner={partner} />
      <main className="flex-1">
        <PublicPartnerHero partner={partner} onOpenRequestModal={handleOpenGeneralModal} />
        <PublicPartnerServices partner={partner} onSelectService={handleSelectService} />
        <PublicPartnerContact partner={partner} />
      </main>
      <PublicPartnerFooter partner={partner} />

      {showModal && (
        <PublicServiceRequestModal
          partner={partner}
          selectedService={selectedService}
          onClose={() => {
            setShowModal(false);
            setSelectedService(null);
          }}
        />
      )}
    </div>
  );
}
