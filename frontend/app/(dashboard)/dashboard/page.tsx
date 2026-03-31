'use client';

import React, { useEffect } from 'react';
import useStore from '@/store/useStore';
import KpiCard from '@/components/dashboard/KpiCard';
import AlertFeed from '@/components/dashboard/AlertFeed';
import AIInsightCard from '@/components/dashboard/AIInsightCard';
import {
  Activity,
  AlertTriangle,
  TrendingUp,
  Package,
  RefreshCw,
} from 'lucide-react';

export default function DashboardPage() {
  const {
    kpis,
    batchHealth,
    alerts,
    inventory,
    complianceScore,
    insight,
    isLoading,
    isAILoading,
    fetchDashboard,
    fetchAI,
  } = useStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleAnalyze = () => {
    fetchAI({
      alerts: alerts,
      inventory: inventory,
      complianceScore: complianceScore,
    });
  };

  const handleGeneratePO = () => {
    alert('Purchase Order draft generated! Check your email.');
  };

  const handleViewAnalysis = () => {
    alert('Opening detailed analysis view...');
  };

  const handleDismiss = () => {
    useStore.setState({ insight: null });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw className="w-8 h-8 text-cyan-500 animate-spin" />
          <p className="text-slate-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="font-display font-extrabold text-[22px] text-slate-100 tracking-[-0.02em]">
            Compliance Command Center
          </h1>
          <p className="text-[11.5px] text-slate-400 font-mono mt-0.5">
            Plant: <em className="text-cyan-300 not-italic">Hyderabad Unit-3</em> &nbsp;·&nbsp; Shift: <em className="text-cyan-300 not-italic">B (14:00–22:00)</em> &nbsp;·&nbsp; Batches Active: <em className="text-cyan-300 not-italic">6</em>
          </p>
        </div>
        <div className="flex gap-2.5 items-center flex-nowrap">
          {kpis.map((kpi, idx) => (
            <KpiCard key={idx} label={kpi.label} value={kpi.value} trend={kpi.trend} />
          ))}
        </div>
      </div>

      {/* Market Ticker */}
      <div className="flex gap-0 overflow-hidden bg-navy-950/90 border border-cyan-500/12 rounded-lg h-8 items-center font-mono text-[10.5px]">
        <div className="px-3 text-cyan-400 font-display font-medium text-[9px] tracking-[0.1em] uppercase border-r border-cyan-500/12 h-full flex items-center whitespace-nowrap">
          API Markets
        </div>
        <div className="flex gap-7 items-center px-4 animate-[ticker-move_22s_linear_infinite] whitespace-nowrap">
          <div className="flex gap-1.5 items-center">
            <span className="text-slate-400">Paracetamol API</span>
            <span className="text-slate-100">₹488/kg</span>
            <span className="text-emerald">▲2.3%</span>
          </div>
          <div className="flex gap-1.5 items-center">
            <span className="text-slate-400">Metformin HCl</span>
            <span className="text-slate-100">₹1,204/kg</span>
            <span className="text-crimson">▼0.8%</span>
          </div>
          <div className="flex gap-1.5 items-center">
            <span className="text-slate-400">Atorvastatin</span>
            <span className="text-slate-100">₹3,870/kg</span>
            <span className="text-emerald">▲1.1%</span>
          </div>
          <div className="flex gap-1.5 items-center">
            <span className="text-slate-400">Amoxicillin</span>
            <span className="text-slate-100">₹720/kg</span>
            <span className="text-crimson">▼3.2%</span>
          </div>
          <div className="flex gap-1.5 items-center">
            <span className="text-slate-400">Amlodipine</span>
            <span className="text-slate-100">₹2,140/kg</span>
            <span className="text-emerald">▲0.5%</span>
          </div>
        </div>
      </div>

      {/* Row 1: Batch Health | Risk Heatmap | Market Trend */}
      <div className="grid grid-cols-[240px_1fr_1fr] gap-3.5">
        {/* Batch Health Gauge */}
        <div className="bg-glass-bg border border-glass-border rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden animate-fade-in-up">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <div className="flex items-center justify-between mb-3.5">
            <span className="font-display font-bold text-[12px] tracking-[0.08em] uppercase text-slate-200 flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Batch Health
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              <span className="text-emerald">●</span> Live
            </span>
          </div>
          <div className="flex flex-col items-center py-2">
            <svg className="w-[180px] h-[108px] overflow-visible" viewBox="0 0 180 110">
              <defs>
                <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#00d68f" />
                  <stop offset="60%" stopColor="#00e5ff" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <path d="M 20 95 A 70 70 0 0 1 160 95" stroke="rgba(255,255,255,0.07)" strokeWidth="10" fill="none" strokeLinecap="round" />
              <path d="M 20 95 A 70 70 0 0 1 80 29" stroke="rgba(0,214,143,0.3)" strokeWidth="10" fill="none" strokeLinecap="round" />
              <path d="M 80 29 A 70 70 0 0 1 130 35" stroke="rgba(0,229,255,0.3)" strokeWidth="10" fill="none" strokeLinecap="round" />
              <path d="M 130 35 A 70 70 0 0 1 160 95" stroke="rgba(255,71,87,0.2)" strokeWidth="10" fill="none" strokeLinecap="round" />
              <path d="M 20 95 A 70 70 0 0 1 152 61" stroke="url(#gaugeGrad)" strokeWidth="10" fill="none" strokeLinecap="round" filter="url(#glow)" />
              <line x1="90" y1="95" x2="152" y2="61" stroke="#00e5ff" strokeWidth="2" strokeLinecap="round" opacity="0.9" />
              <circle cx="90" cy="95" r="5" fill="#00e5ff" opacity="0.9" />
              <circle cx="90" cy="95" r="3" fill="#050c1a" />
              <text x="15" y="108" fill="rgba(107,135,168,0.7)" fontSize="8" fontFamily="DM Mono">0</text>
              <text x="82" y="20" fill="rgba(107,135,168,0.7)" fontSize="8" fontFamily="DM Mono">50</text>
              <text x="157" y="108" fill="rgba(107,135,168,0.7)" fontSize="8" fontFamily="DM Mono">100</text>
            </svg>
            <div className="text-center -mt-1.5">
              <div className="font-display font-extrabold text-[34px] text-cyan-400 text-shadow-[0_0_24px_rgba(0,229,255,0.35)] leading-none">
                {batchHealth.overall}<span className="text-[16px] text-slate-400">%</span>
              </div>
              <div className="text-[10px] font-display font-semibold tracking-[0.1em] uppercase text-slate-400 mt-1">
                Batch Integrity Index
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 mt-3">
            {batchHealth.batches.map((batch) => (
              <div key={batch.id} className="flex items-center gap-2 px-2.5 py-[7px] bg-white/2.5 border border-white/4 rounded-md">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                  batch.status === 'ok' ? 'bg-emerald shadow-[0_0_6px_#00d68f]' :
                  batch.status === 'warn' ? 'bg-amber shadow-[0_0_6px_#f5a623]' :
                  'bg-crimson shadow-[0_0_6px_#ff4757]'
                }`} />
                <div className="font-mono text-[11px] text-cyan-300 flex-1">{batch.id}</div>
                <div className="flex-1 h-[3px] bg-white/7 rounded-sm overflow-hidden">
                  <div className={`h-full rounded-sm ${
                    batch.status === 'ok' ? 'bg-emerald' :
                    batch.status === 'warn' ? 'bg-amber' :
                    'bg-crimson'
                  }`} style={{ width: `${batch.percentage}%` }} />
                </div>
                <div className={`font-mono text-[11px] font-medium ${
                  batch.status === 'ok' ? 'text-emerald' :
                  batch.status === 'warn' ? 'text-amber' :
                  'text-crimson'
                }`}>{batch.percentage}%</div>
              </div>
            ))}
          </div>
        </div>

        {/* Regulatory Risk Heatmap */}
        <div className="bg-glass-bg border border-glass-border rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <div className="flex items-center justify-between mb-3.5">
            <span className="font-display font-bold text-[12px] tracking-[0.08em] uppercase text-slate-200 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
              Regulatory Risk Matrix
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              FDA 21 CFR Part 211 · <span className="text-emerald">●</span> Live
            </span>
          </div>
          <div className="flex gap-1.5 items-start">
            <div className="flex flex-col gap-[3px]">
              {['Documentation', 'Equipment', 'Environment', 'Materials', 'Personnel'].map((label) => (
                <div key={label} className="text-[9px] font-mono text-slate-400/70 flex items-center whitespace-nowrap pr-1">
                  {label}
                </div>
              ))}
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-7 gap-[3px]">
                {[
                  [2,1,4,3,1,0,2],[5,3,2,8,4,1,3],[1,2,3,5,7,2,4],[3,4,6,4,2,3,5],[2,1,3,2,4,1,2]
                ].flat().map((val, idx) => {
                  const colors = [
                    'rgba(0,214,143,', 'rgba(0,229,255,', 'rgba(94,202,230,',
                    'rgba(245,166,35,', 'rgba(255,100,60,', 'rgba(255,71,87,',
                    'rgba(220,30,60,', 'rgba(180,10,30,', 'rgba(150,0,20,'
                  ];
                  const colorIdx = Math.min(Math.floor(val), colors.length - 1);
                  const opacity = 0.15 + val * 0.1;
                  return (
                    <div
                      key={idx}
                      className="aspect-square rounded cursor-pointer transition-transform hover:scale-110 hover:z-10 flex items-center justify-center text-[8px] font-mono text-white/60"
                      style={{
                        background: `${colors[colorIdx]}${opacity})`,
                        boxShadow: val > 5 ? `0 0 8px ${colors[colorIdx]}0.5)` : 'none',
                      }}
                      title={`Risk: ${val}/10`}
                    >
                      {val > 4 ? val : ''}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="flex justify-between mt-2 px-0.5">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
              <span key={day} className="text-[9px] font-mono text-slate-400">{day}</span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 mt-2.5">
            <span className="text-[9px] font-mono text-slate-400">Low</span>
            <div className="flex-1 h-1 rounded-sm bg-gradient-to-r from-emerald via-amber to-crimson" />
            <span className="text-[9px] font-mono text-slate-400">Critical</span>
          </div>
        </div>

        {/* Market Price Trend */}
        <div className="bg-glass-bg border border-glass-border rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <div className="flex items-center justify-between mb-3.5">
            <span className="font-display font-bold text-[12px] tracking-[0.08em] uppercase text-slate-200 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
              API Market Prices
            </span>
            <span className="text-[10px] font-mono text-slate-400">30-day trend · INR/kg</span>
          </div>
          <div className="relative w-full h-[140px]">
            <div className="absolute left-0 top-0 bottom-0 flex flex-col justify-between pointer-events-none">
              <span className="text-[8.5px] font-mono text-slate-400 leading-none">5.2k</span>
              <span className="text-[8.5px] font-mono text-slate-400 leading-none">3.9k</span>
              <span className="text-[8.5px] font-mono text-slate-400 leading-none">2.6k</span>
              <span className="text-[8.5px] font-mono text-slate-400 leading-none">1.3k</span>
              <span className="text-[8.5px] font-mono text-slate-400 leading-none">0</span>
            </div>
            <svg className="w-full h-full overflow-visible" viewBox="0 0 320 140" preserveAspectRatio="none">
              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => (
                <line key={i} x1="30" x2="310" y1={10 + (i / 4) * 120} y2={10 + (i / 4) * 120} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
              ))}
              {/* Paracetamol line */}
              <polyline
                points="30,110 52,105 74,100 96,103 118,95 140,90 162,97 184,92 206,87 228,90 250,95 272,91 294,85 310,82"
                fill="none"
                stroke="#00e5ff"
                strokeWidth="1.8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Metformin line */}
              <polyline
                points="30,80 52,78 74,75 96,77 118,74 140,70 162,72 184,69 206,66 228,70 250,72 272,70 294,68 310,70"
                fill="none"
                stroke="#00d68f"
                strokeWidth="1.8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Atorvastatin line */}
              <polyline
                points="30,40 52,38 74,36 96,37 118,34 140,32 162,33 184,31 206,29 228,30 250,32 272,31 294,29 310,30"
                fill="none"
                stroke="#a855f7"
                strokeWidth="1.8"
                strokeLinejoin="round"
                strokeLinecap="round"
              />
              {/* Last dots */}
              <circle cx="310" cy="82" r="3.5" fill="#00e5ff" />
              <circle cx="310" cy="70" r="3.5" fill="#00d68f" />
              <circle cx="310" cy="30" r="3.5" fill="#a855f7" />
            </svg>
          </div>
          <div className="flex justify-between mt-1 px-7">
            {['1 Jun', '8 Jun', '15 Jun', '22 Jun', '29 Jun'].map((date) => (
              <span key={date} className="text-[8.5px] font-mono text-slate-400">{date}</span>
            ))}
          </div>
          <div className="flex gap-4 mt-2.5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-[3px] bg-cyan-500 rounded-sm inline-block shadow-[0_0_6px_#00e5ff]" />
              <span className="text-[10px] text-slate-400">Paracetamol</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-[3px] bg-emerald rounded-sm inline-block shadow-[0_0_6px_#00d68f]" />
              <span className="text-[10px] text-slate-400">Metformin</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-[3px] bg-violet rounded-sm inline-block shadow-[0_0_6px_#a855f7]" />
              <span className="text-[10px] text-slate-400">Atorvastatin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Row 2: Inventory Table | Alert Feed | AI Insights */}
      <div className="grid grid-cols-[1fr_1fr_320px] gap-3.5">
        {/* Inventory Table */}
        <div className="bg-glass-bg border border-glass-border rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <div className="flex items-center justify-between mb-3.5">
            <span className="font-display font-bold text-[12px] tracking-[0.08em] uppercase text-slate-200 flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-cyan-400" />
              Inventory Status
            </span>
            <span className="text-[10px] font-mono text-slate-400">247 SKUs · Updated 2m ago</span>
          </div>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left px-2.5 py-1.5 text-[9px] uppercase tracking-[0.1em] font-display font-semibold text-slate-400 border-b border-cyan-500/12">SKU / Material</th>
                <th className="text-left px-2.5 py-1.5 text-[9px] uppercase tracking-[0.1em] font-display font-semibold text-slate-400 border-b border-cyan-500/12">Batch</th>
                <th className="text-left px-2.5 py-1.5 text-[9px] uppercase tracking-[0.1em] font-display font-semibold text-slate-400 border-b border-cyan-500/12">Stock (kg)</th>
                <th className="text-left px-2.5 py-1.5 text-[9px] uppercase tracking-[0.1em] font-display font-semibold text-slate-400 border-b border-cyan-500/12">Expiry</th>
                <th className="text-left px-2.5 py-1.5 text-[9px] uppercase tracking-[0.1em] font-display font-semibold text-slate-400 border-b border-cyan-500/12">Status</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item.id} className="hover:bg-cyan-500/3 transition-colors">
                  <td className="px-2.5 py-2 border-b border-white/3">
                    <div className="font-medium text-[11.5px]">{item.name}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{item.sku}</div>
                  </td>
                  <td className="px-2.5 py-2 font-mono text-[11.5px] text-cyan-300 border-b border-white/3">{item.batch}</td>
                  <td className="px-2.5 py-2 font-mono text-[11.5px] border-b border-white/3">{item.stock.toLocaleString()}</td>
                  <td className={`px-2.5 py-2 font-mono text-[11.5px] border-b border-white/3 ${
                    new Date(item.expiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? 'text-crimson' :
                    new Date(item.expiry) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) ? 'text-amber' :
                    'text-emerald'
                  }`}>{item.expiry}</td>
                  <td className="px-2.5 py-2 border-b border-white/3">
                    <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                      item.status === 'GMP Passed' ? 'bg-emerald/15 text-emerald border border-emerald/20' :
                      item.status === 'Expiring Soon' ? 'bg-amber/15 text-amber border border-amber/20' :
                      item.status === 'Recall Risk' ? 'bg-crimson/15 text-crimson border border-crimson/20' :
                      'bg-cyan-500/12 text-cyan-300 border border-cyan-500/20'
                    }`}>
                      {item.status === 'GMP Passed' ? '✓ ' : item.status === 'Expiring Soon' ? '⚠ ' : item.status === 'Recall Risk' ? '✕ ' : '↻ '}
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Alert Feed */}
        <div className="bg-glass-bg border border-glass-border rounded-2xl p-4 backdrop-blur-xl relative overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          <div className="flex items-center justify-between mb-3.5">
            <span className="font-display font-bold text-[12px] tracking-[0.08em] uppercase text-slate-200 flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-cyan-400" />
              Compliance Alerts
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              <span className="text-emerald">●</span> {alerts.filter(a => a.severity === 'critical').length} Critical
            </span>
          </div>
          <AlertFeed alerts={alerts} />
        </div>

        {/* AI Procurement Insights */}
        <AIInsightCard
          insight={insight}
          isLoading={isAILoading}
          onGeneratePO={handleGeneratePO}
          onViewAnalysis={handleViewAnalysis}
          onDismiss={handleDismiss}
        />
      </div>

      {/* AI Analyze Button */}
      <div className="flex justify-center">
        <button
          onClick={handleAnalyze}
          disabled={isAILoading}
          className="bg-cyan-500/12 border border-cyan-500/35 text-cyan-300 font-display font-semibold text-sm tracking-[0.06em] px-8 py-3 rounded-lg cursor-pointer transition-all hover:bg-cyan-500/20 hover:shadow-[0_0_12px_rgba(0,229,255,0.18)] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isAILoading ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Activity className="w-4 h-4" />
              Run AI Analysis
            </>
          )}
        </button>
      </div>
    </>
  );
}
