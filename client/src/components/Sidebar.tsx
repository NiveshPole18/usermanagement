"use client"

import { Link, useLocation } from "react-router-dom"
import { Users, LayoutDashboard, UserCircle, Settings } from "lucide-react"
import { cn } from "../lib/utils"
import { useAuth } from "../context/AuthContext"

export const Sidebar = () => {
  const location = useLocation()
  const { user } = useAuth()

  const links = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/users", label: "Users", icon: Users, adminOnly: true },
    { href: "/profile", label: "Profile", icon: UserCircle },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  const filteredLinks = links.filter(link => 
    !link.adminOnly || (user?.role === 'admin')
  )

  return (
    <div className="w-64 h-screen bg-slate-900/50 backdrop-blur-xl border-r border-white/[0.08]">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-white/90">Admin Panel</h2>
          <p className="text-sm text-slate-400">Welcome back, {user?.name}</p>
        </div>
        <nav className="px-3 space-y-1">
          {filteredLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  location.pathname === link.href
                    ? "bg-sky-500/10 text-sky-400 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
                    : "text-slate-400 hover:bg-white/[0.04] hover:text-white"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5",
                  location.pathname === link.href && "text-sky-400"
                )} />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}

