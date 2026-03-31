'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authAPI } from '@/lib/api';
import { Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await authAPI.login(email, password);
      localStorage.setItem('token', response.data.access_token);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-12 h-12">
              <rect x="1" y="1" width="30" height="30" rx="7" stroke="#00e5ff" strokeWidth="1.5" fill="none"/>
              <path d="M16 5 L16 12 M16 20 L16 27" stroke="#00e5ff" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M5 16 L12 16 M20 16 L27 16" stroke="#00e5ff" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="16" cy="16" r="4" stroke="#00e5ff" strokeWidth="1.5" fill="rgba(0,229,255,0.12)"/>
              <circle cx="16" cy="16" r="1.5" fill="#00e5ff"/>
              <path d="M8 8 L12 12 M20 20 L24 24 M20 12 L24 8 M8 24 L12 20" stroke="#00e5ff" strokeWidth="1" strokeLinecap="round" opacity="0.5"/>
            </svg>
            <span className="font-display font-extrabold text-3xl tracking-[0.05em] text-slate-100">
              Phar<span className="text-cyan-500">OS</span>
            </span>
          </div>
          <p className="text-slate-400 text-sm">AI Compliance Command Center</p>
        </div>

        <div className="bg-glass-bg border border-glass-border rounded-2xl p-8 backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
          
          <h2 className="font-display font-bold text-xl text-slate-100 mb-6 text-center">Sign In</h2>
          
          {error && (
            <div className="flex items-center gap-2 bg-crimson/10 border border-crimson/20 rounded-lg px-4 py-3 mb-4">
              <AlertCircle className="w-4 h-4 text-crimson" />
              <span className="text-sm text-crimson">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-display font-semibold tracking-[0.1em] uppercase text-slate-400 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-navy-800/50 border border-glass-border rounded-lg pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_12px_rgba(0,229,255,0.15)] transition-all"
                  placeholder="admin@pharos.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-display font-semibold tracking-[0.1em] uppercase text-slate-400 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-navy-800/50 border border-glass-border rounded-lg pl-10 pr-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 focus:shadow-[0_0_12px_rgba(0,229,255,0.15)] transition-all"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-cyan-500/12 border border-cyan-500/35 text-cyan-300 font-display font-semibold text-sm tracking-[0.06em] py-3 rounded-lg cursor-pointer transition-all hover:bg-cyan-500/20 hover:shadow-[0_0_12px_rgba(0,229,255,0.18)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[11px] text-slate-500">
              Demo credentials: admin@pharos.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
