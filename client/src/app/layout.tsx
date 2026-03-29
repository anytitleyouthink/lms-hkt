import React from 'react'
import './globals.css'
import Sidebar from '../../components/shared/Sidebar'
import Header from '../../components/shared/Header'

export const metadata = {
  title: 'LMS - Academy',
  description: 'Hệ thống quản lý học tập',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className="antialiased m-0 p-0 overflow-hidden">
        <div className="flex min-h-screen bg-[#f8faff]">
          
          <Sidebar />

          <div className="flex-1 flex flex-col h-screen relative">
            
            <Header />

            <main className="flex-1 overflow-y-auto p-8 pt-2">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>

          </div>
        </div>
      </body>
    </html>
  )
}