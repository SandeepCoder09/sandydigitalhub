import Link from "next/link";
import { ArrowRight, Box, FileText, CloudUpload, Headset, UserRound, Zap } from "lucide-react";

const actions = [
  { label: "Apply Online", href: "/services", icon: FileText, tone: "text-cyan-300 bg-cyan-500/15 border-cyan-400/25" },
  { label: "Upload Docs", href: "/account", icon: CloudUpload, tone: "text-violet-300 bg-violet-500/15 border-violet-400/25" },
  { label: "Get Support", href: "/support", icon: Headset, tone: "text-amber-300 bg-amber-500/15 border-amber-400/25" },
  { label: "My Account", href: "/account", icon: UserRound, tone: "text-pink-300 bg-pink-500/15 border-pink-400/25" },
];

export function HomeQuickActions() {
  return (
    <section className="relative overflow-hidden bg-[#100B1D] px-4 py-6 text-white sm:px-6 sm:py-10 lg:px-8">
      <div className="pointer-events-none absolute -right-20 top-0 h-64 w-64 rounded-full bg-violet-600/15 blur-3xl" />
      <div className="relative mx-auto grid max-w-7xl gap-5 rounded-3xl border border-violet-400/40 bg-gradient-to-br from-[#24143d]/95 via-[#19112d]/95 to-[#10162d]/95 p-4 shadow-[0_16px_55px_rgba(109,40,217,.14)] sm:p-6 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-8 lg:p-7">
        <div>
          <div className="mb-2 flex items-center gap-2 text-violet-200">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-500/20 text-violet-200"><Box size={19} /></span>
            <span className="text-xs font-black uppercase tracking-[.13em]">Live application & service tracking</span>
          </div>
          <h2 className="text-xl font-black tracking-tight sm:text-2xl">Track Your Order</h2>
          <p className="mt-1 text-xs leading-5 text-slate-300 sm:text-sm">Already submitted a request? Check its latest processing updates in one place.</p>
          <Link href="/track-order" className="mt-4 inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 text-xs font-extrabold text-white shadow-lg shadow-violet-950/40 transition hover:-translate-y-0.5 hover:brightness-110 sm:text-sm">
            Open Order Tracking <ArrowRight size={15} />
          </Link>
        </div>
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-white"><Zap size={16} className="text-amber-300" /> Quick Actions</div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            {actions.map(({ label, href, icon: Icon, tone }) => (
              <Link key={label} href={href} className="group flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[.045] p-3 text-center transition hover:-translate-y-1 hover:border-violet-300/40 hover:bg-white/[.08]">
                <span className={`flex h-9 w-9 items-center justify-center rounded-xl border ${tone}`}><Icon size={18} /></span>
                <span className="text-[11px] font-bold text-slate-100 sm:text-xs">{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
