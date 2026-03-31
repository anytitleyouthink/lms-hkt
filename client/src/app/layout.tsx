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
      <body className="antialiased m-0 p-0">
        <div className="flex min-h-screen bg-[#f8faff]">
          
          {/* Sidebar */}
          <Sidebar />

          {/* Main content */}
          <div className="flex-1 flex flex-col min-h-screen">
            
            {/* Header */}
            <Header />

            {/* Page content */}
            <main className="flex-1 overflow-y-auto p-6">
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