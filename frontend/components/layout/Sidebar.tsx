'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FileCheck,
  Brain,
  Activity,
  Shield,
  FileText,
  Monitor,
  BarChart3,
  Download,
} from 'lucide-react';

const navItems = [
  { section: 'Operations', items: [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/inventory', label: 'Inventory', icon: Package, badge: '14', badgeType: 'warn' },
    { href: '/audit-logs', label: 'Audit Logs', icon: FileCheck, badge: '3', badgeType: 'danger' },
    { href: '/ai-procurement', label: 'AI Procurement', icon: Brain, badge: 'New' },
    { href: '/batch-tracker', label: 'Batch Tracker', icon: Activity },
  ]},
  { section: 'Quality', items: [
    { href: '/qc-lab', label: 'QC Lab', icon: Shield },
    { href: '/sops', label: 'SOPs', icon: FileText },
    { href: '/regulatory', label: 'Regulatory', icon: Monitor },
  ]},
  { section: 'Reports', items: [
    { href: '/analytics', label: 'Analytics', icon: BarChart3 },
    { href: '/export', label: 'Export', icon: Download },
  ]},
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[220px] border-r border-cyan-500/12 bg-navy-950/75 backdrop-blur-xl flex flex-col p-5 gap-1 overflow-y-auto">
      {navItems.map((section, sectionIdx) => (
        <div key={sectionIdx}>
          <div className="text-[9px] font-display font-semibold tracking-[0.14em] uppercase text-slate-400 px-2 pt-2 pb-1">
            {section.section}
          </div>
          {section.items.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-2.5 py-[9px] rounded-lg text-[12.5px] font-medium transition-all relative border ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 shadow-[inset_0_0_12px_rgba(0,229,255,0.05),0_0_0_1px_rgba(0,229,255,0.08)]'
                    : 'text-slate-200 border-transparent hover:bg-cyan-500/6 hover:text-slate-100 hover:border-cyan-500/12'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-[20%] bottom-[20%] w-[2px] rounded-sm bg-cyan-500 shadow-[0_0_8px_#00e5ff]" />
                )}
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded-[10px] border ${
                    item.badgeType === 'warn'
                      ? 'bg-amber/15 text-amber border-amber/25'
                      : item.badgeType === 'danger'
                      ? 'bg-crimson/15 text-crimson border-crimson/25'
                      : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/20'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      ))}
      
      <div className="mt-auto pt-4 border-t border-cyan-500/12">
        <div className="bg-cyan-500/6 border border-cyan-500/12 rounded-xl p-3">
          <div className="text-[9px] font-display font-semibold tracking-[0.1em] uppercase text-slate-400 mb-1.5">
            GMP Compliance Score
          </div>
          <div className="font-display font-extrabold text-[26px] text-emerald text-shadow-[0_0_20px_rgba(0,214,143,0.4)]">
            94<span className="text-[13px] font-medium text-slate-400">%</span>
          </div>
          <div className="h-[3px] bg-white/7 rounded-sm mt-1.5 overflow-hidden">
            <div className="h-full w-[94%] bg-gradient-to-r from-emerald to-cyan-400 rounded-sm shadow-[0_0_6px_#00d68f]" />
          </div>
        </div>
      </div>
    </aside>
  );
}
