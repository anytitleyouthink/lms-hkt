import React from 'react';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { ChatNotificationHandler } from '@/components/chat/ChatNotificationHandler';
import { Suspense } from 'react';

export default function TrainerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#f8faff] w-full overflow-hidden text-slate-800 font-sans">
      <Suspense fallback={null}>
        <ChatNotificationHandler />
      </Suspense>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <Header />
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
