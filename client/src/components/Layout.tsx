"use client"

import { Header } from "./Header"
import { Sidebar } from "./Sidebar"

interface LayoutProps {
  children: React.ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-[#0A0A0B] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-white/[0.08] rounded-xl p-6 shadow-[0_0_1px_1px_rgba(0,0,0,0.2)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout

