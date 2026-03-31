'use client';

import React, { useEffect } from 'react';
import useStore from '@/store/useStore';
import AlertFeed from '@/components/dashboard/AlertFeed';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function AlertsPage() {
  const { alerts, isLoading, fetchAlerts } = useStore();

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin" />
          <p className="text-slate-400">Loading alerts...</p>
        </div>
      </div>
    );
  }

  const criticalAlerts = alerts.filter(a => a.severity === 'critical');
  const warningAlerts = alerts.filter(a => a.severity === 'warning');
  const infoAlerts = alerts.filter(a => a.severity === 'info');
  const okAlerts = alerts.filter(a => a.severity === 'ok');

  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-extrabold text-[22px] text-slate-100 tracking-[-0.02em]">
            Compliance Alerts
          </h1>
          <p className="text-[11.5px] text-slate-400 font-mono mt-0.5">
            Real-time compliance monitoring and alert management
          </p>
        </div>
        <div className="flex gap-2.5 items-center">
          <div className="bg-crimson/12 border border-crimson/20 rounded-lg px-3 py-[7px] backdrop-blur-xl">
            <div className="text-[9px] uppercase tracking-[0.1em] text-slate-400 font-display font-semibold">Critical</div>
            <div className="font-mono font-medium text-[15px] text-crimson">{criticalAlerts.length}</div>
          </div>
          <div className="bg-amber/12 border border-amber/20 rounded-lg px-3 py-[7px] backdrop-blur-xl">
            <div className="text-[9px] uppercase tracking-[0.1em] text-slate-400 font-display font-semibold">Warning</div>
            <div className="font-mono font-medium text-[15px] text-amber">{warningAlerts.length}</div>
          </div>
          <div className="bg-cyan-500/12 border border-cyan-500/20 rounded-lg px-3 py-[7px] backdrop-blur-xl">
            <div className="text-[9px] uppercase tracking-[0.1em] text-slate-400 font-display font-semibold">Info</div>
            <div className="font-mono font-medium text-[15px] text-cyan-400">{infoAlerts.length}</div>
          </div>
          <div className="bg-emerald/12 border border-emerald/20 rounded-lg px-3 py-[7px] backdrop-blur-xl">
            <div className="text-[9px] uppercase tracking-[0.1em] text-slate-400 font-display font-semibold">Resolved</div>
            <div className="font-mono font-medium text-[15px] text-emerald">{okAlerts.length}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5">
        {criticalAlerts.length > 0 && (
          <div className="bg-glass-bg border border-glass-border rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden animate-fade-in-up">
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-crimson/30 to-transparent" />
            <div className="flex items-center justify-between mb-3.5">
              <span className="font-display font-bold text-[12px] tracking-[0.08em] uppercase text-slate-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-crimson" />
                Critical Alerts
              </span>
              <span className="text-[10px] font-mono text-crimson">{criticalAlerts.length} active</span>
            </div>
            <AlertFeed alerts={criticalAlerts} />
          </div>
        )}

        {warningAlerts.length > 0 && (
          <div className="bg-glass-bg border border-glass-border rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent" />
            <div className="flex items-center justify-between mb-3.5">
              <span className="font-display font-bold text-[12px] tracking-[0.08em] uppercase text-slate-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-amber" />
                Warnings
              </span>
              <span className="text-[10px] font-mono text-amber">{warningAlerts.length} active</span>
            </div>
            <AlertFeed alerts={warningAlerts} />
          </div>
        )}

        {infoAlerts.length > 0 && (
          <div className="bg-glass-bg border border-glass-border rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            <div className="flex items-center justify-between mb-3.5">
              <span className="font-display font-bold text-[12px] tracking-[0.08em] uppercase text-slate-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
                Information
              </span>
              <span className="text-[10px] font-mono text-cyan-400">{infoAlerts.length} active</span>
            </div>
            <AlertFeed alerts={infoAlerts} />
          </div>
        )}

        {okAlerts.length > 0 && (
          <div className="bg-glass-bg border border-glass-border rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald/30 to-transparent" />
            <div className="flex items-center justify-between mb-3.5">
              <span className="font-display font-bold text-[12px] tracking-[0.08em] uppercase text-slate-200 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5 text-emerald" />
                Resolved
              </span>
              <span className="text-[10px] font-mono text-emerald">{okAlerts.length} resolved</span>
            </div>
            <AlertFeed alerts={okAlerts} />
          </div>
        )}
      </div>
    </>
  );
}
