'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  return (
    <div className="relative z-10 grid grid-cols-[220px_1fr] grid-rows-[60px_1fr] h-screen">
      <Navbar />
      <Sidebar />
      <main className="overflow-y-auto p-5 flex flex-col gap-4 bg-transparent">
        {children}
      </main>
    </div>
  );
}
