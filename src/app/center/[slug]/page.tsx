import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPartnerBySlug } from '@/lib/tenant';
import { CenterClientView } from './CenterClientView';
import { ShieldAlert, Building2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const partner = await getPartnerBySlug(slug);

  if (!partner) {
    return {
      title: 'Center Not Found | SARA Partner Network',
      description: 'The requested digital service center was not found.',
    };
  }

  const title = `${partner.name} - Digital Service Center in ${partner.city || 'India'}`;
  const description =
    partner.branding?.description ||
    `${partner.name} provides online application facilitation, form submissions, and document assistance.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
    },
  };
}

export default async function PartnerCenterPage({ params }: PageProps) {
  const { slug } = await params;
  const partner = await getPartnerBySlug(slug);

  if (!partner) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-5 bg-slate-950/80 p-8 rounded-3xl border border-slate-800 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-violet-600/20 text-violet-400 border border-violet-500/30 flex items-center justify-center mx-auto">
            <Building2 size={32} />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-black text-white">Partner Center Not Found</h1>
            <p className="text-xs text-slate-400">
              The digital service center with URL identifier &apos;{slug}&apos; does not exist or has been relocated.
            </p>
          </div>
          <div className="pt-2">
            <Link href="/">
              <Button className="h-11 px-6 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-extrabold text-xs">
                <ArrowLeft size={14} className="mr-2" />
                <span>Go to SARA Main Platform</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if partner is suspended
  if (partner.status === 'SUSPENDED') {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-5 bg-slate-950/80 p-8 rounded-3xl border border-rose-500/30 shadow-2xl">
          <div className="w-16 h-16 rounded-3xl bg-rose-500/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mx-auto">
            <ShieldAlert size={32} />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-black text-white">{partner.name}</h1>
            <div className="text-xs font-bold text-rose-400 uppercase tracking-wider">Service Center Temporarily Inactive</div>
            <p className="text-xs text-slate-400 leading-relaxed">
              {partner.statusReason || 'This center is currently undergoing scheduled platform maintenance or compliance review.'}
            </p>
          </div>
          <div className="pt-2">
            <Link href="/">
              <Button className="h-11 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs">
                <span>Visit Main Platform</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return <CenterClientView partner={partner} />;
}
