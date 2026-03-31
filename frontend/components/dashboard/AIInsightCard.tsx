'use client';

import React from 'react';
import { AIInsight } from '@/types';
import { Sparkles, FileText, X } from 'lucide-react';

interface AIInsightCardProps {
  insight: AIInsight | null;
  isLoading: boolean;
  onGeneratePO: () => void;
  onViewAnalysis: () => void;
  onDismiss: () => void;
}

export default function AIInsightCard({
  insight,
  isLoading,
  onGeneratePO,
  onViewAnalysis,
  onDismiss,
}: AIInsightCardProps) {
  return (
    <div className="bg-gradient-to-br from-navy-800/90 to-navy-600/50 border border-cyan-500/18 shadow-[inset_0_0_30px_rgba(0,229,255,0.04)] rounded-2xl p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
      
      <div className="flex items-center justify-between mb-3.5">
        <span className="font-display font-bold text-[12px] tracking-[0.08em] uppercase text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          AI Procurement
        </span>
        <span className="text-[10px] font-mono text-slate-400">PharOS AI v2.1</span>
      </div>
      
      <div className="inline-flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/22 text-cyan-300 text-[9px] font-display font-bold tracking-[0.12em] uppercase px-2 py-1 rounded-[20px] mb-2">
        <Sparkles className="w-2 h-2" />
        AI Recommendation Active
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        </div>
      ) : insight ? (
        <div className="text-[12px] leading-[1.65] text-slate-200">
          {insight.content}
        </div>
      ) : (
        <div className="text-[12px] leading-[1.65] text-slate-400">
          Click "Analyze" to generate AI-powered procurement insights based on current market data and inventory levels.
        </div>
      )}
      
      <div className="flex gap-2 mt-3 flex-wrap">
        <button
          onClick={onGeneratePO}
          className="text-[10.5px] font-display font-semibold tracking-[0.06em] px-3.5 py-1.5 rounded-md bg-cyan-500/12 border border-cyan-500/35 text-cyan-300 cursor-pointer transition-all hover:bg-cyan-500/20 hover:shadow-[0_0_12px_rgba(0,229,255,0.18)]"
        >
          Generate PO Draft
        </button>
        <button
          onClick={onViewAnalysis}
          className="text-[10.5px] font-display font-semibold tracking-[0.06em] px-3.5 py-1.5 rounded-md bg-transparent border border-white/10 text-slate-400 cursor-pointer transition-all hover:text-slate-100 hover:border-white/20"
        >
          View Analysis
        </button>
        <button
          onClick={onDismiss}
          className="text-[10.5px] font-display font-semibold tracking-[0.06em] px-3.5 py-1.5 rounded-md bg-transparent border border-white/10 text-slate-400 cursor-pointer transition-all hover:text-slate-100 hover:border-white/20"
        >
          Dismiss
        </button>
      </div>
      
      <div className="h-px bg-cyan-500/12 my-3.5" />
      
      <div className="font-display font-bold text-[12px] tracking-[0.08em] uppercase text-slate-200 mb-2.5 flex items-center gap-1.5">
        <FileText className="w-3.5 h-3.5 text-cyan-400" />
        Pending Audits
      </div>
      
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center px-2 py-[7px] bg-white/2.5 rounded-md border border-white/5">
          <div className="text-[11px]">Internal cGMP Walk-through</div>
          <div className="flex gap-1.5 items-center">
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber/15 text-amber border border-amber/20">Due 3d</span>
            <span className="text-[10px] font-mono text-slate-400">Unit-3</span>
          </div>
        </div>
        <div className="flex justify-between items-center px-2 py-[7px] bg-white/2.5 rounded-md border border-white/5">
          <div className="text-[11px]">WHO Pre-Qualification Audit</div>
          <div className="flex gap-1.5 items-center">
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/12 text-cyan-300 border border-cyan-500/20">Scheduled</span>
            <span className="text-[10px] font-mono text-slate-400">Jul 14</span>
          </div>
        </div>
        <div className="flex justify-between items-center px-2 py-[7px] bg-white/2.5 rounded-md border border-white/5">
          <div className="text-[11px]">USFDA PAI — Atorvastatin line</div>
          <div className="flex gap-1.5 items-center">
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-crimson/15 text-crimson border border-crimson/20">High Risk</span>
            <span className="text-[10px] font-mono text-slate-400">Aug 2</span>
          </div>
        </div>
      </div>
    </div>
  );
}
