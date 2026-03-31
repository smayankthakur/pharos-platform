'use client';

import React from 'react';
import { Alert } from '@/types';
import { AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';

interface AlertFeedProps {
  alerts: Alert[];
}

const severityConfig = {
  critical: {
    bg: 'bg-crimson/12',
    border: 'border-l-crimson',
    icon: AlertTriangle,
  },
  warning: {
    bg: 'bg-amber/12',
    border: 'border-l-amber',
    icon: AlertCircle,
  },
  info: {
    bg: 'bg-cyan-500/10',
    border: 'border-l-cyan-500',
    icon: Info,
  },
  ok: {
    bg: 'bg-emerald/10',
    border: 'border-l-emerald',
    icon: CheckCircle,
  },
};

export default function AlertFeed({ alerts }: AlertFeedProps) {
  return (
    <div className="flex flex-col gap-2 max-h-[240px] overflow-y-auto">
      {alerts.map((alert) => {
        const config = severityConfig[alert.severity];
        const Icon = config.icon;
        
        return (
          <div
            key={alert.id}
            className={`flex items-start gap-2.5 px-2.5 py-[9px] bg-white/2 rounded-lg border border-white/4 border-l-2 ${config.border} transition-colors hover:bg-white/4`}
          >
            <div className={`w-7 h-7 rounded-md flex items-center justify-center text-[14px] ${config.bg}`}>
              <Icon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[11.5px] font-medium text-slate-100 truncate">
                {alert.title}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {alert.detail}
              </div>
            </div>
            <div className="text-[9.5px] font-mono text-slate-400 whitespace-nowrap flex-shrink-0">
              {alert.timestamp}
            </div>
          </div>
        );
      })}
    </div>
  );
}
