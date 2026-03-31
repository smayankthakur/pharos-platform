'use client';

import React from 'react';

interface KpiCardProps {
  label: string;
  value: string;
  trend: 'up' | 'down' | 'warn' | 'cyan';
}

export default function KpiCard({ label, value, trend }: KpiCardProps) {
  const trendColors = {
    up: 'text-emerald',
    down: 'text-crimson',
    warn: 'text-amber',
    cyan: 'text-cyan-400',
  };

  return (
    <div className="bg-cyan-500/65 border border-cyan-500/12 rounded-lg px-3 py-[7px] backdrop-blur-xl whitespace-nowrap">
      <div className="text-[9px] uppercase tracking-[0.1em] text-slate-400 font-display font-semibold">
        {label}
      </div>
      <div className={`font-mono font-medium text-[15px] mt-px ${trendColors[trend]}`}>
        {value}
      </div>
    </div>
  );
}
