'use client';

import React from 'react';
import { Bell, Settings } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="col-span-full flex items-center px-6 border-b border-cyan-500/12 bg-navy-950/85 backdrop-blur-xl gap-4 relative">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-40" />
      
      <a href="#" className="flex items-center gap-2.5 no-underline">
        <div className="w-8 h-8 relative">
          <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="30" height="30" rx="7" stroke="#00e5ff" strokeWidth="1.5" fill="none"/>
            <path d="M16 5 L16 12 M16 20 L16 27" stroke="#00e5ff" strokeWidth="1.5" strokeLinecap="round"/>
            <path d="M5 16 L12 16 M20 16 L27 16" stroke="#00e5ff" strokeWidth="1.5" strokeLinecap="round"/>
            <circle cx="16" cy="16" r="4" stroke="#00e5ff" strokeWidth="1.5" fill="rgba(0,229,255,0.12)"/>
            <circle cx="16" cy="16" r="1.5" fill="#00e5ff"/>
            <path d="M8 8 L12 12 M20 20 L24 24 M20 12 L24 8 M8 24 L12 20" stroke="#00e5ff" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
          </svg>
        </div>
        <span className="font-display font-extrabold text-[20px] tracking-[0.05em] text-slate-100">
          Phar<span className="text-cyan-500">OS</span>
        </span>
      </a>
      
      <div className="w-px h-7 bg-cyan-500/12 mx-2" />
      
      <div className="text-[11px] text-slate-400 tracking-[0.08em] uppercase font-display font-medium">
        Compliance Command Center &nbsp;›&nbsp; <em className="text-cyan-300 not-italic">Live Operations</em>
      </div>
      
      <div className="flex-1" />
      
      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald shadow-[0_0_8px_#00d68f] animate-pulse" />
        LIVE — 14:32:07 IST &nbsp;|&nbsp; FDA cGMP v2.4 Active
      </div>
      
      <div className="flex items-center gap-2 ml-4">
        <button className="w-8 h-8 rounded-lg border border-cyan-500/12 bg-cyan-500/65 flex items-center justify-center cursor-pointer text-slate-200 transition-all hover:border-cyan-500/28 hover:text-cyan-400 hover:shadow-[0_0_10px_rgba(0,229,255,0.18)] relative">
          <Bell className="w-3.5 h-3.5" />
          <div className="absolute top-1 right-1 w-[7px] h-[7px] rounded-full bg-crimson shadow-[0_0_6px_#ff4757]" />
        </button>
        <button className="w-8 h-8 rounded-lg border border-cyan-500/12 bg-cyan-500/65 flex items-center justify-center cursor-pointer text-slate-200 transition-all hover:border-cyan-500/28 hover:text-cyan-400 hover:shadow-[0_0_10px_rgba(0,229,255,0.18)]">
          <Settings className="w-3.5 h-3.5" />
        </button>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-navy-600 to-slate-500 border border-cyan-500/35 flex items-center justify-center font-display font-bold text-[12px] text-cyan-300 cursor-pointer shadow-[0_0_12px_rgba(0,229,255,0.18)]">
          AM
        </div>
      </div>
    </header>
  );
}
