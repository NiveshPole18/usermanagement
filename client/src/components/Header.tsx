"use client"

import { Link } from "react-router-dom"
import { Bell, Shield } from "lucide-react"
import { useAuth } from "../context/AuthContext"
import { Button } from "./ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export const Header = () => {
  const { user, logout } = useAuth()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <header className="bg-slate-900/50 backdrop-blur-xl border-b border-white/[0.08]">
      <div className="flex h-16 items-center px-6">
        <div className="flex items-center gap-3">
          <Shield className="h-6 w-6 text-sky-400" />
          <h1 className="text-xl font-semibold bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="relative text-slate-400 hover:text-white hover:bg-white/[0.04]"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute h-2 w-2 top-2 right-2 rounded-full bg-sky-500 ring-2 ring-slate-900" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="relative h-9 w-9 rounded-full hover:bg-white/[0.04] ring-1 ring-white/[0.08]"
              >
                <Avatar>
                  <AvatarImage src="/placeholder.svg" alt={user?.name} />
                  <AvatarFallback className="bg-sky-500/10 text-sky-500 font-medium">
                    {user?.name ? getInitials(user.name) : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="end" 
              className="w-56 bg-slate-900/95 backdrop-blur-sm border border-white/[0.08] mt-2"
            >
              <DropdownMenuLabel className="text-white">My Account</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/[0.08]" />
              <DropdownMenuItem asChild>
                <Link 
                  to="/profile" 
                  className="cursor-pointer text-slate-300 hover:text-white focus:text-white hover:bg-white/[0.04] focus:bg-white/[0.04]"
                >
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link 
                  to="/settings" 
                  className="cursor-pointer text-slate-300 hover:text-white focus:text-white hover:bg-white/[0.04] focus:bg-white/[0.04]"
                >
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.08]" />
              <DropdownMenuItem 
                onClick={handleLogout} 
                className="cursor-pointer text-red-400 hover:text-red-300 focus:text-red-300 hover:bg-white/[0.04] focus:bg-white/[0.04]"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

