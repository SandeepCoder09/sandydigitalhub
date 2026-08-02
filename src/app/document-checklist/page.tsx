'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FileText, CheckCircle2, Circle, Clock, ShieldCheck, ArrowRight,
  Share2, AlertCircle, Sparkles, Download, PhoneCall, HelpCircle,
  Check, FileCheck, Search, ChevronRight, Calculator
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ServiceDocument {
  id: string;
  title: string;
  hindiTitle: string;
  category: 'Government Certificates' | 'Identity Cards' | 'Registration' | 'Financial & Tax';
  fee: string;
  turnaroundTime: string;
  description: string;
  eligibility: string[];
  documentsRequired: {
    name: string;
    description: string;
    isMandatory: boolean;
  }[];
}

const SERVICES_DATA: ServiceDocument[] = [
  {
    id: 'income-certificate',
    title: 'Income Certificate (आय प्रमाण पत्र)',
    hindiTitle: 'आय प्रमाण पत्र',
    category: 'Government Certificates',
    fee: '₹100 - ₹150',
    turnaroundTime: '3 - 7 Working Days',
    description: 'Official state government certificate verifying annual family income, required for scholarships, government schemes, and fee concessions.',
    eligibility: [
      'Must be a resident of Uttar Pradesh / India',
      'Self-declaration of annual income from all sources',
      'No age restriction (minor applications filed through parents)'
    ],
    documentsRequired: [
      { name: 'Aadhaar Card (आधार कार्ड)', description: 'Self-attested copy of applicant Aadhaar', isMandatory: true },
      { name: 'Passport Size Photo (फोटो)', description: 'Recent white background photograph (JPEG/PNG)', isMandatory: true },
      { name: 'Self-Declaration Form (स्वघोषणा पत्र)', description: 'Signed income affidavit / Swaghoshna Patra', isMandatory: true },
      { name: 'Ration Card / Parivar Register', description: 'Copy of Family Register Nakal or Ration Card', isMandatory: true },
      { name: 'Electricity Bill / Salary Slip', description: 'Recent monthly utility bill or employer salary slip (if employed)', isMandatory: false },
    ]
  },
  {
    id: 'caste-certificate',
    title: 'Caste Certificate (जाति प्रमाण पत्र)',
    hindiTitle: 'जाति प्रमाण पत्र',
    category: 'Government Certificates',
    fee: '₹100 - ₹150',
    turnaroundTime: '7 - 10 Working Days',
    description: 'Official certificate for SC / ST / OBC category candidates needed for educational quota admissions, scholarships, and competitive exams.',
    eligibility: [
      'Resident of Uttar Pradesh with ancestral record in the state',
      'Belonging to recognized OBC / SC / ST community list'
    ],
    documentsRequired: [
      { name: 'Aadhaar Card', description: 'Applicant Aadhaar Card copy', isMandatory: true },
      { name: 'Passport Photo', description: '2 recent passport photographs', isMandatory: true },
      { name: 'Father\'s Caste Certificate / Proof', description: 'Father\'s caste certificate or old family record nakal', isMandatory: true },
      { name: 'Parivar Register Nakal', description: 'Gram Panchayat / Nagar Palika family register record', isMandatory: true },
      { name: 'School Transfer Certificate (TC)', description: 'Class 5th/8th/10th Marksheet or TC showing caste entry', isMandatory: false },
    ]
  },
  {
    id: 'domicile-certificate',
    title: 'Domicile / Niwas Certificate (निवास प्रमाण पत्र)',
    hindiTitle: 'निवास प्रमाण पत्र',
    category: 'Government Certificates',
    fee: '₹100 - ₹150',
    turnaroundTime: '3 - 7 Working Days',
    description: 'Proof of permanent residency in Uttar Pradesh, required for state admissions, recruitment exams, and local benefits.',
    eligibility: [
      'Living in UP for minimum 3 consecutive years or born in UP',
      'Own residence or ancestral property in UP'
    ],
    documentsRequired: [
      { name: 'Aadhaar Card', description: 'Applicant Aadhaar showing UP address', isMandatory: true },
      { name: 'Passport Size Photo', description: 'Clean recent photograph', isMandatory: true },
      { name: 'House Tax / Electricity Bill', description: 'Recent house bill or land Khasra Khatauni copy', isMandatory: true },
      { name: 'Voter ID / School Marksheet', description: 'Proof of education or voter registration in UP', isMandatory: true },
    ]
  },
  {
    id: 'pan-card',
    title: 'New PAN Card & Correction (पैन कार्ड)',
    hindiTitle: 'पैन कार्ड नया / संशोधन',
    category: 'Identity Cards',
    fee: '₹200 - ₹250',
    turnaroundTime: '3 Days (e-PAN) / 10 Days (Physical)',
    description: 'Instant e-PAN & physical Taxpayer Identification Card issuance or name/DOB/address correction.',
    eligibility: [
      'Any Indian citizen aged 18+ (minor PAN available through guardian)',
      'Aadhaar card linked with active mobile number for instant e-KYC'
    ],
    documentsRequired: [
      { name: 'Aadhaar Card', description: 'Mandatory proof of identity, address & DOB', isMandatory: true },
      { name: 'Passport Photographs', description: '2 passport photos (if physical form path)', isMandatory: true },
      { name: 'Existing PAN Card Copy', description: 'Required ONLY for correction applications', isMandatory: false },
    ]
  },
  {
    id: 'passport-apply',
    title: 'Fresh Passport Application (पासपोर्ट सेवा)',
    hindiTitle: 'नया पासपोर्ट आवेदन',
    category: 'Identity Cards',
    fee: '₹1,800 - ₹2,200',
    turnaroundTime: '15 - 25 Days',
    description: 'Complete Passport Seva Kendra appointment booking, fee payment, and document preparation assistance.',
    eligibility: [
      'Indian citizen with no active criminal proceedings',
      'Valid identity & address proof documents'
    ],
    documentsRequired: [
      { name: 'Aadhaar Card', description: 'Primary identity & address proof', isMandatory: true },
      { name: 'Class 10th Marksheet', description: 'Required for ECNR (Non-Emigration Check Required) status', isMandatory: true },
      { name: 'Bank Passbook / Voter ID', description: 'Passbook with photo stamped by nationalized bank', isMandatory: true },
      { name: 'PAN Card', description: 'Secondary identity verification document', isMandatory: false },
    ]
  },
  {
    id: 'gst-registration',
    title: 'GST Registration & Filing (जीएसटी रजिस्ट्रेशन)',
    hindiTitle: 'जीएसटी रजिस्ट्रेशन',
    category: 'Financial & Tax',
    fee: '₹1,499 - ₹2,499',
    turnaroundTime: '3 - 5 Working Days',
    description: 'New GSTIN registration for proprietorships, partnerships, and companies with monthly/quarterly filing setup.',
    eligibility: [
      'Business turnover > ₹20 Lakhs (services) or > ₹40 Lakhs (goods)',
      'Inter-state e-commerce sellers or service providers'
    ],
    documentsRequired: [
      { name: 'PAN Card of Business Owner', description: 'Proprietor / Partner PAN card', isMandatory: true },
      { name: 'Aadhaar Card', description: 'Owner Aadhaar linked with mobile OTP', isMandatory: true },
      { name: 'Rent Agreement / Registry', description: 'Business premise proof with Electricity Bill & NOC', isMandatory: true },
      { name: 'Cancelled Cheque / Bank Statement', description: 'Bank account proof in business name', isMandatory: true },
    ]
  }
];

export default function DocumentChecklistPage() {
  const [selectedService, setSelectedService] = useState<ServiceDocument>(SERVICES_DATA[0]);
  const [checkedDocs, setCheckedDocs] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState('');

  const toggleCheck = (docName: string) => {
    setCheckedDocs(prev => ({ ...prev, [docName]: !prev[docName] }));
  };

  const totalMandatory = selectedService.documentsRequired.filter(d => d.isMandatory).length;
  const checkedMandatoryCount = selectedService.documentsRequired
    .filter(d => d.isMandatory && checkedDocs[d.name]).length;
  const readinessPercent = totalMandatory > 0 ? Math.round((checkedMandatoryCount / totalMandatory) * 100) : 0;

  const filteredServices = SERVICES_DATA.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.hindiTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const shareChecklist = () => {
    const text = `📋 *Document Checklist for ${selectedService.title}*\n\nRequired Documents:\n` +
      selectedService.documentsRequired.map((d, i) => `${i + 1}. ${d.name} ${d.isMandatory ? '(Mandatory)' : '(Optional)'}`).join('\n') +
      `\n\n📌 Apply Online at Sandy Digital Hub: https://sandydigitalhub.com/services\n📞 Phone: +91 8756454282`;
    
    if (navigator.share) {
      navigator.share({ title: selectedService.title, text });
    } else {
      window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/60 pb-16">
      {/* Header Banner */}
      <section className="bg-gradient-to-br from-gray-900 via-black to-slate-900 text-white py-14 px-4 sm:px-6 lg:px-8 border-b border-gray-800">
        <div className="max-w-6xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider">
            <FileCheck size={14} /> Jan Seva Document Assistant
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Government Document <span className="text-[#FF4500]">Checklist & Eligibility</span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 font-medium">
            Select any government service below to check exact document requirements, eligibility criteria, official processing time, and verify your readiness instantly!
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Panel: Service Selector Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-4 border border-gray-200 shadow-sm space-y-3">
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search certificate or service..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:border-[#FF4500]"
                />
              </div>

              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider px-1">
                Select Service ({filteredServices.length})
              </div>

              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {filteredServices.map((service) => {
                  const isSelected = selectedService.id === service.id;
                  return (
                    <button
                      key={service.id}
                      onClick={() => { setSelectedService(service); setCheckedDocs({}); }}
                      className={`w-full text-left p-3.5 rounded-xl transition-all cursor-pointer border flex items-center justify-between gap-3 ${
                        isSelected
                          ? 'bg-orange-50 border-[#FF4500] text-gray-900 shadow-xs'
                          : 'bg-white border-gray-100 hover:border-gray-200 text-gray-700'
                      }`}
                    >
                      <div>
                        <div className={`text-xs font-bold ${isSelected ? 'text-[#FF4500]' : 'text-gray-900'}`}>
                          {service.title}
                        </div>
                        <div className="text-[10px] text-gray-500 mt-0.5 flex items-center gap-2">
                          <span>⏱️ {service.turnaroundTime}</span>
                          <span>•</span>
                          <span>💰 {service.fee}</span>
                        </div>
                      </div>
                      <ChevronRight size={16} className={isSelected ? 'text-[#FF4500]' : 'text-gray-400'} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Consultation Banner */}
            <div className="bg-gradient-to-br from-orange-500 to-amber-600 text-white rounded-2xl p-5 shadow-lg space-y-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                <PhoneCall size={16} /> Need Personal Help?
              </div>
              <p className="text-xs text-orange-100 font-medium leading-relaxed">
                Unsure about your documents or need doorstep document pickup in Fatehpur? Call our team directly.
              </p>
              <a href="tel:+918756454282" className="block">
                <Button className="w-full bg-white hover:bg-gray-100 text-gray-900 font-bold text-xs rounded-xl shadow-md">
                  📞 Call +91 8756454282
                </Button>
              </a>
            </div>
          </div>

          {/* Right Panel: Selected Service Detail & Document Interactive Checklist */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Overview Card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <span className="px-3 py-1 rounded-full bg-orange-100 text-[#FF4500] text-[11px] font-bold uppercase tracking-wider">
                    {selectedService.category}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-gray-900 mt-2">
                    {selectedService.title}
                  </h2>
                  <p className="text-xs text-gray-600 font-medium mt-1">
                    {selectedService.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={shareChecklist}
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl text-xs font-bold flex items-center gap-1.5"
                  >
                    <Share2 size={14} className="text-[#FF4500]" /> Share
                  </Button>
                  <Link href={`/checkout?service=${selectedService.id}`}>
                    <Button className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-orange-200">
                      Apply Online <ArrowRight size={14} />
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Service Meta Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Estimated Fee</div>
                  <div className="text-sm font-extrabold text-gray-900 mt-0.5">{selectedService.fee}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Processing Time</div>
                  <div className="text-sm font-extrabold text-emerald-600 mt-0.5">{selectedService.turnaroundTime}</div>
                </div>
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 col-span-2 sm:col-span-1">
                  <div className="text-[10px] text-gray-500 font-bold uppercase">Service Location</div>
                  <div className="text-sm font-extrabold text-gray-900 mt-0.5">Jan Seva / Online</div>
                </div>
              </div>

              {/* Eligibility Criteria */}
              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck size={16} className="text-emerald-500" /> Eligibility Criteria
                </h3>
                <ul className="space-y-1.5">
                  {selectedService.eligibility.map((criterion, idx) => (
                    <li key={idx} className="text-xs text-gray-700 font-medium flex items-start gap-2">
                      <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                      <span>{criterion}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Interactive Document Checklist & Readiness Bar */}
            <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                    <FileText size={18} className="text-[#FF4500]" /> Required Documents Checklist
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    Check off the documents you currently have to verify your application readiness:
                  </p>
                </div>

                {/* Readiness Badge */}
                <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                  <div className="text-right">
                    <div className="text-[10px] text-gray-500 font-bold uppercase">Document Readiness</div>
                    <div className="text-xs font-black text-gray-900">
                      {checkedMandatoryCount} of {totalMandatory} Mandatory Ready
                    </div>
                  </div>
                  <div className={`w-10 h-10 rounded-full font-black text-xs flex items-center justify-center border-2 ${
                    readinessPercent === 100
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-500'
                      : 'bg-orange-50 text-[#FF4500] border-[#FF4500]'
                  }`}>
                    {readinessPercent}%
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    readinessPercent === 100 ? 'bg-emerald-500' : 'bg-[#FF4500]'
                  }`}
                  style={{ width: `${readinessPercent}%` }}
                />
              </div>

              {/* Interactive Checklist Items */}
              <div className="space-y-3">
                {selectedService.documentsRequired.map((doc) => {
                  const isChecked = !!checkedDocs[doc.name];
                  return (
                    <div
                      key={doc.name}
                      onClick={() => toggleCheck(doc.name)}
                      className={`p-4 rounded-xl transition-all cursor-pointer border flex items-start gap-3.5 ${
                        isChecked
                          ? 'bg-emerald-50/60 border-emerald-300 text-gray-900'
                          : 'bg-white border-gray-200 hover:border-gray-300 text-gray-700'
                      }`}
                    >
                      <div className="pt-0.5">
                        {isChecked ? (
                          <CheckCircle2 size={20} className="text-emerald-600 shrink-0" />
                        ) : (
                          <Circle size={20} className="text-gray-300 shrink-0" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-xs font-bold ${isChecked ? 'text-emerald-900 line-through opacity-80' : 'text-gray-900'}`}>
                            {doc.name}
                          </span>
                          {doc.isMandatory ? (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-extrabold uppercase bg-red-100 text-red-600">
                              Mandatory
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-medium uppercase bg-gray-100 text-gray-600">
                              Optional
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium mt-0.5">
                          {doc.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Bottom CTA Box */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-wrap items-center justify-between gap-4 pt-4">
                <div className="space-y-0.5">
                  <div className="text-xs font-extrabold flex items-center gap-1.5">
                    <Sparkles size={14} className="text-amber-400" />
                    {readinessPercent === 100
                      ? '🎉 All mandatory documents checked! You are ready to apply.'
                      : 'Have your documents ready? Submit online or visit shop.'}
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium">
                    We verify all documents before government submission to prevent rejection.
                  </p>
                </div>

                <Link href={`/checkout?service=${selectedService.id}`}>
                  <Button className="bg-[#FF4500] hover:bg-[#FF4500]/90 text-white font-bold rounded-xl text-xs px-5 shadow-lg">
                    Proceed to Application <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
